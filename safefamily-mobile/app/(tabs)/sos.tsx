// app/(tabs)/sos.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "../../utils/apiClient";

export default function SosScreen() {
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const openConfirm = () => setConfirmVisible(true);
  const closeConfirm = () => setConfirmVisible(false);

  const sendSOS = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission required for SOS");
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const res = await apiFetch<{ _id: string; status: string }>("/sos/trigger", {
        method: "POST",
        body: JSON.stringify({ coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      });
      alert("SOS sent");
      closeConfirm();
    } catch (err) {
      alert("Failed to send SOS: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={openConfirm} style={styles.sosButton}>
        <Text style={styles.sosText}>🚨 SOS</Text>
      </Pressable>

      <Modal visible={confirmVisible} transparent animationType="slide">
        <View style={styles.modalBack}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Send SOS?</Text>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <Pressable style={[styles.modalBtn, { backgroundColor: "#FF3B30" }]} onPress={sendSOS}>
                  <Text style={styles.modalBtnText}>Send SOS</Text>
                </Pressable>
                <Pressable style={[styles.modalBtn, { backgroundColor: "#ccc" }]} onPress={closeConfirm}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  sosButton: {
    backgroundColor: "#FF3B30",
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  sosText: { color: "#fff", fontSize: 40, fontWeight: "700" },
  modalBack: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", padding: 24, borderRadius: 12, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  modalBtn: { padding: 12, borderRadius: 8, marginTop: 8, alignItems: "center" },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});