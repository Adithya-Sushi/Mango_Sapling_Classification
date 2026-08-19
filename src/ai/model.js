import { loadTensorflowModel } from "react-native-fast-tflite";

let model = null;
let modelPromise = null;

export async function getModel() {
  if (model) {
    console.log("Using cached TensorFlow Lite model");
    return model;
  }

  if (modelPromise) {
    console.log("Model is already loading...");
    return modelPromise;
  }

  console.log("Loading Tensorflow Lite Model 7");

  modelPromise = loadTensorflowModel(
    require("../../assets/model/mobilenetv2.tflite"),
    []
  );

  try {
    model = await modelPromise;

    console.log(
      "=============================="
    );

    console.log(
      "✅ Model Loaded Successfully"
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
      console.log("Data Type:", output.dataType);
    });

    console.log(
      "=============================="
    );

    return model;
  } catch (error) {
    modelPromise = null;
    model = null;

    console.log(
      "❌ Model Loading Error:",
      error
    );

    throw error;
  }
}