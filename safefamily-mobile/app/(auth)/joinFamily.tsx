// app/(auth)/joinFamily.tsx
import { useForm } from "react-hook-form";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { apiFetch } from "../../utils/apiClient";
// import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function JoinFamilyScreen() {
  const router = useRouter();
  const { handleSubmit, setValue } = useForm<{ inviteCode: string }>();
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: { inviteCode: string }) => {
    setLoading(true)
    try {
      await apiFetch(`/family/join`, {
        method: "POST",
        body: JSON.stringify({ inviteCode: data.inviteCode }),
      });
      router.replace("/map");
    } catch (err: any) {
      console.error("Join family failed:", err.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Family</Text>

      <TextInput
        placeholder="Enter Invite Code"
        style={styles.input}
        onChangeText={(text) => setValue("inviteCode", text)}
      />

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>
          {loading? "Joining Family....." : "Join Family"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});