// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
// import ShakeHandler from "../components/ShakeHandler";

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* <ShakeHandler /> */}
      <Slot />
    </AuthProvider>
  );
}