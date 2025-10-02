// app/(tabs)/map.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView, RefreshControl } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { apiFetch } from "../../utils/apiClient";
import { useAuth } from "../../contexts/AuthContext";

interface MemberLocation {
  userId: string;
  name: string;
  lat: number;
  lng: number;
  lastActiveAt?: string | null;
}

export default function MapScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<MemberLocation[]>([]);
  const [refreshing, setRefreshing] = useState(false)

    const load = async () => {
      try {
        // fetch family members' last known locations
        const data = await apiFetch<MemberLocation[]>("/location/family/last");
        if (data.length > 0) {
          const first = data[0];
          setRegion((r) => ({ ...r, latitude: first.lat, longitude: first.lng }));
        }
        setMembers(data);
      } catch (err) {
        console.error("Failed to load locations:", (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load()
    }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  const centerOnMe = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission required");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setRegion((r) => ({ ...r, latitude: lat, longitude: lng }));
      // optional: post location to backend
      await apiFetch("/location", {
        method: "POST",
        body: JSON.stringify({ lat, lng }),
      });
    } catch (err) {
      console.error("Center on me failed:", (err as Error).message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onRegionChangeComplete={(r) => setRegion(r)}>
        {/* member markers */}
        {members.map((m) => (
          <Marker
            key={m.userId}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            title={m.name}
            description={m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleString() : "Unknown"}
          />
        ))}
      </MapView>

      <Pressable style={[styles.fab, { bottom: 120 }]} onPress={centerOnMe}>
        <Text style={styles.fabText}>Center</Text>
      </Pressable>

      <Pressable
        style={[styles.fab, { bottom: 40, backgroundColor: "#FF3B30" }]}
        onPress={async () => {
          // navigate to SOS tab (expo-router link)
          // or open modal; simplest: call SOS endpoint with current location
          const pos = await Location.getCurrentPositionAsync({});
          await apiFetch("/sos/trigger", {
            method: "POST",
            body: JSON.stringify({ coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
          });
          alert("SOS triggered");
        }}
      >
        <Text style={styles.fabText}>SOS</Text>
      </Pressable>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  fab: {
    position: "absolute",
    right: 20,
    padding: 14,
    borderRadius: 30,
    backgroundColor: "#1E90FF",
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700" },
});