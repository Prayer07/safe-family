// // app/authLoading.tsx
// import { useEffect } from "react";
// import { View, ActivityIndicator } from "react-native";
// import { useRouter } from "expo-router";
// import { getToken } from "../utils/secureStore";

// export default function AuthLoading() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await getToken();
//         if (token) {
//           router.replace("/home");
//         } else {
//           router.replace("/welcome");
//         }
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         router.replace("/welcome");
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }