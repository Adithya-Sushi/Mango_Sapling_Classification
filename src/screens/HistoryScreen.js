import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { getHistory } from "../storage/history";

export default function HistoryScreen({
  navigation,
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      console.log("================================");
      console.log("HISTORY SCREEN");
      console.log("Loading saved predictions...");

      setLoading(true);

      const data = await getHistory();

      console.log(
        "History records:",
        data.length
      );

      console.log(
        "History data:",
        data
      );

      setHistory(data);
    } catch (error) {
      console.log(
        "HISTORY SCREEN ERROR:",
        error
      );

      setHistory([]);
    } finally {
      setLoading(false);

      console.log(
        "History screen loading finished."
      );

      console.log("================================");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Unknown date";
    }

    try {
      return new Date(
        timestamp
      ).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  const openPrediction = (item) => {
    navigation.navigate("Result", {
      image: item.image,

      result: {
        prediction: item.prediction,
        confidence: item.confidence,
        topPredictions:
          item.topPredictions || [],
        inferenceTime:
          item.inferenceTime || 0,
        model: item.model || "MobileNetV2",
        valid: true,
      },
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          openPrediction(item)
        }
      >
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <Text
            style={styles.variety}
            numberOfLines={2}
          >
            {item.prediction}
          </Text>

          <Text style={styles.confidence}>
            {Number(
              item.confidence || 0
            ).toFixed(2)}
            %
          </Text>

          <Text style={styles.date}>
            {formatDate(
              item.timestamp
            )}
          </Text>

          <Text style={styles.model}>
            {item.model ||
              "MobileNetV2"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#2D7D32"
          />

          <Text style={styles.loadingText}>
            Loading history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Prediction History
        </Text>

        <Text style={styles.subtitle}>
          {history.length}{" "}
          {history.length === 1
            ? "prediction"
            : "predictions"}
        </Text>
      </View>

      {history.length === 0 ? (
        <View
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyIcon}>
            🌿
          </Text>

          <Text style={styles.emptyTitle}>
            No Predictions Yet
          </Text>

          <Text style={styles.emptyText}>
            Your mango leaf predictions
            will appear here.
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() =>
              navigation.navigate(
                "Camera"
              )
            }
          >
            <Text
              style={styles.scanButtonText}
            >
              Scan A Leaf
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={renderItem}
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
  },

  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2D7D32",
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginTop: 5,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 15,
    padding: 12,
    flexDirection: "row",
    elevation: 3,
  },

  image: {
    width: 105,
    height: 105,
    borderRadius: 14,
    backgroundColor: "#E8F1E8",
  },

  info: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "center",
  },

  variety: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D7D32",
    marginBottom: 5,
  },

  confidence: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },

  date: {
    fontSize: 12,
    color: "#777777",
    marginBottom: 4,
  },

  model: {
    fontSize: 12,
    color: "#999999",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 27,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
    color: "#777777",
    textAlign: "center",
    marginBottom: 25,
  },

  scanButton: {
    backgroundColor: "#2D7D32",
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 14,
  },

  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#777777",
  },
});