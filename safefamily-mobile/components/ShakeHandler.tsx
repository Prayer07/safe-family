// app/components/ShakeHandler.tsx
import React, { JSX, useEffect, useRef, useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet, Alert } from "react-native";
import * as Shake from "expo-shake";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "../utils/apiClient";
import { useAuth } from "../contexts/AuthContext";

const SOS_THROTTLE_MS = 0 * 60 * 1000; // 2 minutes
const SOS_TIMESTAMP_KEY = "safefamily_sos_last_trigger";

interface SosResponse {
  _id: string;
  status: string;
  autoCallInitiated?: boolean;
}

export default function ShakeHandler(): JSX.Element | null {
  const { user } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);
  const countdownRef = useRef<number | null>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    // only enable shake listener if user is logged in
    if (!user) return;

    const sub = Shake.addListener(() => {
      void handleShake();
    });

    return () => {
      sub.remove();
      stopCountdown();
    };
  }, [user]);

  const stopCountdown = () => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(5);
    setConfirmVisible(false);
  };

  const canTrigger = async (): Promise<{ ok: boolean; waitMs?: number }> => {
    try {
      const last = await SecureStore.getItemAsync(SOS_TIMESTAMP_KEY);
      const lastTs = last ? Number(last) : 0;
      const now = Date.now();
      const delta = now - lastTs;
      if (delta < SOS_THROTTLE_MS) {
        return { ok: false, waitMs: SOS_THROTTLE_MS - delta };
      }
      return { ok: true };
    } catch (err) {
      return { ok: true }; // if securestore fails, allow it (server will throttle)
    }
  };

  const handleShake = async () => {
    // guard: user must be logged in
    if (!user) return;

    const { ok, waitMs } = await canTrigger();
    if (!ok) {
      Alert.alert("Please wait", `You can trigger another SOS in ${Math.ceil(waitMs! / 1000)}s`);
      return;
    }
    // show confirmation modal with countdown
    setConfirmVisible(true);
    setCountdown(3);

    // start countdown
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // reached 0 — trigger
          stopCountdown();
          void sendSos();
          return 3; // reset
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  };

  const sendSos = async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    try {
      // request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location required", "Allow location access to send SOS.");
        sendingRef.current = false;
        return;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const body = {
        coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        deviceId: "mobile", // optional: pass actual device id if available
      };

      const res = await apiFetch<SosResponse>("/sos/trigger", {
        method: "POST",
        body: JSON.stringify(body),
      });

      // store timestamp locally for client-side throttle
      await SecureStore.setItemAsync(SOS_TIMESTAMP_KEY, Date.now().toString());

      Alert.alert("SOS sent", "Your family has been alerted.");
      // optionally: navigate to SOS screen or open a details modal
      setConfirmVisible(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert("Failed to send SOS", msg);
    } finally {
      sendingRef.current = false;
    }
  };

  if (!user) return null;

  return (
    <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={stopCountdown}>
      <View style={styles.modalBack}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Send SOS?</Text>
          <Text style={styles.subtitle}>Sending in {countdown} second{countdown !== 1 ? "s" : ""}…</Text>

          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={() => stopCountdown()}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.send]}
              onPress={async () => {
                // immediate send
                stopCountdown();
                await sendSos();
              }}
            >
              <Text style={styles.btnText}>Send Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBack: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "84%", backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#333", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 6 },
  cancel: { backgroundColor: "#ccc" },
  send: { backgroundColor: "#FF3B30" },
  btnText: { color: "#fff", fontWeight: "700" },
});