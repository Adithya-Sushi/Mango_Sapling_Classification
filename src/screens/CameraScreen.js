import {
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to identify mango leaves.
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      navigation.navigate("Preview", {
        image: photo.uri,
      });
    } catch (error) {
      console.log("Camera Error:", error);
    }
  };

  const switchCamera = () => {
    setFacing((current) =>
      current === "back" ? "front" : "back"
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.icon}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={switchCamera}
      >
        <Text style={styles.icon}>🔄</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
      >
        <View style={styles.captureInner} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  permissionText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: "#2D6A4F",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },

  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  switchButton: {
    position: "absolute",
    top: 55,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#2D6A4F",
  },

  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2D6A4F",
  },
});