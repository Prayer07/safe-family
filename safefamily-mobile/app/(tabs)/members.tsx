// app/(tabs)/members.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { apiFetch } from "../../utils/apiClient";

interface Member {
  _id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  lastActiveAt?: string | null;
  lastKnownLat?: number | null;
  lastKnownLng?: number | null;
}

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
      try {
        const data = await apiFetch<{ members: Member[] }>("/family/me");
        setMembers(data.members);
      } catch (err) {
        console.error("Failed to fetch members:", (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load()
    }, [])

    const onRefresh = useCallback(async () => {
      setRefreshing(true)
      await load()
      setRefreshing(false)
    }, [])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!members || members.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No members yet. Create or join a family.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={members}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        const isOnline = item.lastActiveAt ? Date.now() - new Date(item.lastActiveAt).getTime() < 5 * 60 * 1000 : false;
        return (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>{item.phone ?? item.email ?? ""}</Text>
            <Text style={{ color: isOnline ? "green" : "gray" }}>{isOnline ? "Online" : "Offline"}</Text>
          </View>
        );
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      ListEmptyComponent={<Text>No members found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F2FAFF",
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "600" },
  detail: { color: "#6B7280" },
});