import { loadTensorflowModel } from "react-native-fast-tflite";

import {
  DEFAULT_MODEL_KEY,
  MODELS,
} from "./modelConfig";

// Keyed cache: { mobilenetv2: model, densenet121: model }
const modelCache = {};
const loadingPromises = {};

export async function getModel(
  modelKey = DEFAULT_MODEL_KEY
) {
  if (modelCache[modelKey]) {
    console.log(
      `Using cached model: ${modelKey}`
    );
    return modelCache[modelKey];
  }

  if (loadingPromises[modelKey]) {
    console.log(
      `Model ${modelKey} is already loading...`
    );
    return loadingPromises[modelKey];
  }

  const config = MODELS[modelKey];

  if (!config) {
    throw new Error(
      `Unknown model key: ${modelKey}`
    );
  }

  console.log(
    `Loading TFLite model: ${config.name}`
  );

  loadingPromises[modelKey] =
    loadTensorflowModel(config.asset, []);

  try {
    const model =
      await loadingPromises[modelKey];

    modelCache[modelKey] = model;

    console.log(
      "=============================="
    );

    console.log(
      `✅ ${config.name} Loaded Successfully`
    );

    console.log("MODEL INPUTS:");

    model.inputs.forEach((input, index) => {
      console.log(`Input ${index}:`);
      console.log("Name:", input.name);
      console.log("Shape:", input.shape);
      console.log("Data Type:", input.dataType);
    });

    console.log("MODEL OUTPUTS:");

    model.outputs.forEach((output, index) => {
      console.log(`Output ${index}:`);
      console.log("Name:", output.name);
      console.log("Shape:", output.shape);
      console.log(
        "Data Type:",
        output.dataType
      );
    });

    console.log(
      "=============================="
    );

    return model;
  } catch (error) {
    delete loadingPromises[modelKey];
    delete modelCache[modelKey];

    console.log(
      `❌ ${config.name} Loading Error:`,
      error
    );

    throw error;
  }
}