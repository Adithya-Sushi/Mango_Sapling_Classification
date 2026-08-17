import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import COLORS from "../styles/colors";

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        MangoLeaf AI
      </Text>

      <Text style={styles.subtitle}>
        Offline Mango Variety Identifier
      </Text>

      <ActivityIndicator
        size="large"
        color="#ffffff"
        style={{ marginTop: 35 }}
      />

      <Text style={styles.footer}>
        VIT Vellore
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#E8F5E9",
  },

  footer: {
    position: "absolute",
    bottom: 50,
    color: "#ffffff",
    fontSize: 14,
  },

});