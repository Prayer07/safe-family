import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false)

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setLoading(true)
    try {
      await signup(data.name, data.email, data.password, data.phone);
      router.replace("/onboarding"); // ✅ go to home after signup
    } catch (err: any) {
      console.error("Signup failed:", err.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={(text) => setValue("name", text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <TextInput
        placeholder="Phone"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={(text) => setValue("phone", text)}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => setValue("password", text)}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>
          {loading? "Creating account....." : "Signup"}
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </Text>
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
  error: { color: "red", marginBottom: 8 },
  footer: { marginTop: 20, textAlign: "center" },
  link: { color: "#1E90FF", fontWeight: "600" },
});