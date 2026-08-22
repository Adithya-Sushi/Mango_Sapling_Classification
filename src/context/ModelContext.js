import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DEFAULT_MODEL_KEY,
  MODELS,
} from "../ai/modelConfig";

const STORAGE_KEY = "@selected_model";

const ModelContext = createContext({
  selectedModelKey: DEFAULT_MODEL_KEY,
  setSelectedModelKey: () => {},
});

export function ModelProvider({ children }) {
  const [selectedModelKey, setSelectedModelKey] =
    useState(DEFAULT_MODEL_KEY);

  const [loaded, setLoaded] = useState(false);

  // Load persisted selection on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && MODELS[stored]) {
          setSelectedModelKey(stored);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Persist whenever selection changes
  const updateModel = (key) => {
    if (MODELS[key]) {
      setSelectedModelKey(key);
      AsyncStorage.setItem(STORAGE_KEY, key).catch(
        () => {}
      );
    }
  };

  if (!loaded) {
    return null; // avoid rendering until we know the stored preference
  }

  return (
    <ModelContext.Provider
      value={{
        selectedModelKey,
        setSelectedModelKey: updateModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModelSelection() {
  return useContext(ModelContext);
}
