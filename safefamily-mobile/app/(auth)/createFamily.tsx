// app/(auth)/createFamily.tsx
import { useForm } from "react-hook-form";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { apiFetch } from "../../utils/apiClient";
// import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function CreateFamilyScreen() {
  const router = useRouter();
  // const { token } = useAuth();
  const { handleSubmit, setValue } = useForm<{ name: string }>();
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: { name: string }) => {
    setLoading(true)
    try {
      await apiFetch("/family", {
        method: "POST",
        body: JSON.stringify({ name: data.name }),
      });
      router.replace("/map");
    } catch (err: any) {
      console.error("Create family failed:", err.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Family</Text>

      <TextInput
        placeholder="Family Name"
        style={styles.input}
        onChangeText={(text) => setValue("name", text)}
      />

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>
          {loading? "Creating Family....." : "Create Family"}
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