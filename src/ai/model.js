import { loadTensorflowModel } from "react-native-fast-tflite";

let model = null;

export async function getModel() {
  if (model) {
    return model;
  }

  model = await loadTensorflowModel(
    require("../../assets/model/mobilenetv2.tflite"),
    []
  );

  console.log("================================");
  console.log("✅ Model Loaded Successfully");

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

  console.log("================================");

  return model;
}