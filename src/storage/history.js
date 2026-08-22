import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "@mangoleafai_history";

export async function getHistory() {
  try {
    console.log("HISTORY: Reading storage");

    if (!AsyncStorage) {
      console.log("HISTORY ERROR: AsyncStorage is undefined");
      return [];
    }

    if (typeof AsyncStorage.getItem !== "function") {
      console.log(
        "HISTORY ERROR: AsyncStorage.getItem is not a function"
      );
      console.log("AsyncStorage:", AsyncStorage);
      return [];
    }

    const data = await AsyncStorage.getItem(HISTORY_KEY);

    console.log("HISTORY: Storage read successful");

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.log("HISTORY READ ERROR:", error);
    return [];
  }
}

export async function savePrediction({
  image,
  result,
}) {
  try {
    console.log("HISTORY: Starting save");

    if (!AsyncStorage) {
      console.log(
        "HISTORY ERROR: AsyncStorage is undefined"
      );
      return null;
    }

    if (typeof AsyncStorage.getItem !== "function") {
      console.log(
        "HISTORY ERROR: getItem is not available"
      );
      return null;
    }

    if (typeof AsyncStorage.setItem !== "function") {
      console.log(
        "HISTORY ERROR: setItem is not available"
      );
      return null;
    }

    if (!image) {
      console.log(
        "HISTORY ERROR: Image is missing"
      );
      return null;
    }

    if (!result) {
      console.log(
        "HISTORY ERROR: Result is missing"
      );
      return null;
    }

    const history = await getHistory();

    const newItem = {
      id: Date.now().toString(),
      image: image,
      prediction: result.prediction,
      confidence: result.confidence,
      topPredictions: result.topPredictions || [],
      inferenceTime: result.inferenceTime || 0,
      model: result.model || "MobileNetV2",
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [
      newItem,
      ...history,
    ];

    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );

    console.log(
      "HISTORY: Prediction saved successfully"
    );

    return newItem;
  } catch (error) {
    console.log(
      "================================"
    );
    console.log(
      "HISTORY SAVE ERROR"
    );
    console.log(error);
    console.log(
      "================================"
    );

    return null;
  }
}

export async function deleteHistoryItem(id) {
  try {
    const history = await getHistory();

    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );

    return updatedHistory;
  } catch (error) {
    console.log(
      "HISTORY DELETE ERROR:",
      error
    );

    return [];
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);

    console.log(
      "HISTORY: Cleared successfully"
    );
  } catch (error) {
    console.log(
      "HISTORY CLEAR ERROR:",
      error
    );
  }
}