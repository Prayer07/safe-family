// app/welcome.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome to Safe Family</Text> */}

      <Pressable
        style={styles.button}
        onPress={() => router.push("/createFamily")}
      >
        <Text style={styles.buttonText}>Create Family</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/joinFamily")}
      >
        <Text style={styles.buttonText}>Join Family</Text>
      </Pressable>

      {/* <Pressable onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 40 },
  button: {
    backgroundColor: "#1E90FF",
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#1E90FF", marginTop: 20 },
});