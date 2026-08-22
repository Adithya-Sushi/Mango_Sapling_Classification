export const MODELS = {
  mobilenetv2: {
    key: "mobilenetv2",
    name: "MobileNetV2",
    description: "Lightweight & fast inference",
    asset: require("../../assets/model/mobilenetv2.tflite"),
    inputSize: 224,
  },
  densenet121: {
    key: "densenet121",
    name: "DenseNet121",
    description: "Higher accuracy, slower inference",
    asset: require("../../assets/model/denseNet121.tflite"),
    inputSize: 224,
  },
};

export const DEFAULT_MODEL_KEY = "mobilenetv2";
