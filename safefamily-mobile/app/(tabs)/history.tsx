// app/(tabs)/history.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl  } from "react-native";
import { apiFetch } from "../../utils/apiClient";

type HistoryItem =
  | { _id: string; type: "location"; user: string; coords: { lat: number; lng: number }; timestamp: string }
  | { _id: string; type: "sos"; triggeredBy: string; coords: { lat: number; lng: number }; status: string; timestamp: string };

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
      try {
        const data = await apiFetch<HistoryItem[]>("/history");
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history:", (err as Error).message);
      } finally {
        setLoading(false);
        setRefreshing(false)
      }
    }, []);

    useEffect(() => {
      load()
    }, [load])

    const onRefresh = () => {
      setRefreshing(true);
      load();
    };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!history || history.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No recent events</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={history}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.type === "sos" ? (
            <>
              <Text style={styles.title}>🚨 SOS</Text>
              <Text>By: {item.triggeredBy}</Text>
              <Text>Status: {item.status}</Text>
              <Text>When: {new Date(item.timestamp).toLocaleString()}</Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>📍 Location</Text>
              <Text>User: {item.user}</Text>
              <Text>
                Lat: {item.coords.lat.toFixed(4)}, Lng: {item.coords.lng.toFixed(4)}
              </Text>
              <Text>When: {new Date(item.timestamp).toLocaleString()}</Text>
            </>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { padding: 12, borderRadius: 10, backgroundColor: "#F2FAFF", marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "700" },
});