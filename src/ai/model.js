import { loadTensorflowModel } from "react-native-fast-tflite";

let model = null;

export async function getModel() {
  if (model) return model;

  model = await loadTensorflowModel(
    require("../../assets/model/mobilenetv2.tflite"),
    []
  );

  console.log("✅ Model Loaded Successfully");

  return model;
}