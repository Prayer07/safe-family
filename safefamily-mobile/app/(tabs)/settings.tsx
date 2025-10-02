// app/(tabs)/settings.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.text}>Signed in as: {user?.name ?? "Unknown"}</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  text: { marginBottom: 20 },
  button: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});