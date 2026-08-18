import {
    AlphaType,
    ColorType,
    Skia,
} from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system/legacy";

import { getModel } from "./model";

const LABELS = [
  "MV10_Cherukurasam",
  "MV11_Daseri",
  "MV12_Himam Pasand",
  "MV13_Kalapedu",
  "MV14_Kesari",
  "MV15_Khadar",
  "MV16_Malaguba",
  "MV17_Mallika",
  "MV18_Miyazaki",
  "MV19_Namdac",
  "MV1_All time mango",
  "MV20_Neelam",
  "MV21_Noor jahan",
  "MV22_Peddarasam",
  "MV23_Punasa",
  "MV24_Red Ivory",
  "MV25_Rumani",
  "MV2_Alphonso",
  "MV3_Athimadhuram",
  "MV4_Banglora",
  "MV5_Benisha",
  "MV6_Bhastara",
  "MV7_Black Mango",
  "MV8_Chakrakuti",
  "MV9_Chandura",
];

export async function predictMango(imageUri) {
  console.log("================================");
  console.log("STEP 1: Starting prediction");
  console.log("Image URI:", imageUri);

  if (!imageUri) {
    throw new Error("No image URI received");
  }

  console.log("STEP 2: Loading model");

  const model = await getModel();

  console.log("STEP 3: Model ready");

  console.log("STEP 4: Reading image");

  const base64 = await FileSystem.readAsStringAsync(
    imageUri,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );

  console.log("STEP 5: Image read successfully");
  console.log("Base64 length:", base64.length);

  console.log("STEP 6: Skia decoding image");

  const encodedData =
    Skia.Data.fromBase64(base64);

  const image =
    Skia.Image.MakeImageFromEncoded(
      encodedData
    );

  if (!image) {
    throw new Error(
      "Skia could not decode the image"
    );
  }

  const originalWidth = image.width();
  const originalHeight = image.height();

  console.log(
    "Decoded width:",
    originalWidth
  );

  console.log(
    "Decoded height:",
    originalHeight
  );

  console.log("STEP 7: Reading pixels with Skia");

  let pixelImage = image;

  /*
   * Your current dataset images are already
   * 224x224. If the selected image is another
   * size, create a 224x224 Skia surface and
   * resize the image natively.
   */

  if (
    originalWidth !== 224 ||
    originalHeight !== 224
  ) {
    console.log(
      "STEP 7A: Resizing image with Skia"
    );

    const surface =
      Skia.Surface.MakeOffscreen(
        224,
        224
      );

    if (!surface) {
      throw new Error(
        "Could not create Skia surface"
      );
    }

    const canvas =
      surface.getCanvas();

    const paint =
      Skia.Paint();

    const sourceRect = {
      x: 0,
      y: 0,
      width: originalWidth,
      height: originalHeight,
    };

    const destinationRect = {
      x: 0,
      y: 0,
      width: 224,
      height: 224,
    };

    canvas.drawImageRect(
      image,
      sourceRect,
      destinationRect,
      paint
    );

    const resizedImage =
      surface.makeImageSnapshot();

    surface.dispose();

    if (!resizedImage) {
      throw new Error(
        "Skia resize failed"
      );
    }

    pixelImage = resizedImage;

    console.log(
      "STEP 7B: Skia resize completed"
    );
  }

  console.log(
    "Final image:",
    pixelImage.width(),
    "x",
    pixelImage.height()
  );

  console.log(
    "STEP 8: Extracting RGB pixels"
  );

  const imageInfo = {
    width: 224,
    height: 224,
    alphaType: AlphaType.Opaque,
    colorType: ColorType.RGBA_8888,
  };

  const pixels =
    pixelImage.readPixels(
      0,
      0,
      imageInfo
    );

  if (!pixels) {
    throw new Error(
      "Skia failed to read image pixels"
    );
  }

  console.log(
    "Pixel buffer length:",
    pixels.length
  );

  console.log(
    "STEP 9: Creating Float32 input"
  );

  const input = new Float32Array(
    224 * 224 * 3
  );

  let inputIndex = 0;

  for (
    let i = 0;
    i < pixels.length;
    i += 4
  ) {
    input[inputIndex++] =
      pixels[i] / 255.0;

    input[inputIndex++] =
      pixels[i + 1] / 255.0;

    input[inputIndex++] =
      pixels[i + 2] / 255.0;
  }

  console.log(
    "Input length:",
    input.length
  );

  console.log("INPUT SAMPLE:");

  console.log(
    "Pixel 0:",
    input[0],
    input[1],
    input[2]
  );

  console.log(
    "Pixel 1:",
    input[3],
    input[4],
    input[5]
  );

  console.log(
    "Pixel 2:",
    input[6],
    input[7],
    input[8]
  );

  let min = input[0];
  let max = input[0];

  for (
    let i = 1;
    i < input.length;
    i++
  ) {
    if (input[i] < min) {
      min = input[i];
    }

    if (input[i] > max) {
      max = input[i];
    }
  }

  console.log(
    "Input min:",
    min
  );

  console.log(
    "Input max:",
    max
  );

  console.log(
    "STEP 10: Running TFLite model"
  );

  const startTime = Date.now();

  const outputs = await model.run([
    input.buffer,
  ]);

  const inferenceTime =
    Date.now() - startTime;

  console.log(
    "STEP 11: Inference completed"
  );

  console.log(
    "Inference time:",
    inferenceTime,
    "ms"
  );

  console.log(
    "Number of outputs:",
    outputs.length
  );

  const output =
    new Float32Array(outputs[0]);

  console.log(
    "Output length:",
    output.length
  );

  console.log(
    "RAW OUTPUT:",
    Array.from(output)
  );

  let bestIndex = 0;

  for (
    let i = 1;
    i < output.length;
    i++
  ) {
    if (
      output[i] >
      output[bestIndex]
    ) {
      bestIndex = i;
    }
  }

  const prediction =
    LABELS[bestIndex];

  const confidence =
    output[bestIndex] * 100;

  const topPredictions =
    Array.from(output)
      .map((value, index) => ({
        index,
        label: LABELS[index],
        confidence:
          value * 100,
      }))
      .sort(
        (a, b) =>
          b.confidence -
          a.confidence
      )
      .slice(0, 3);

  console.log(
    "STEP 12: Prediction:",
    prediction
  );

  console.log(
    "Confidence:",
    confidence.toFixed(2) + "%"
  );

  console.log(
    "Top 3:",
    topPredictions
  );

  console.log(
    "================================"
  );

  return {
    prediction,
    confidence:
      confidence.toFixed(2) + "%",
    inferenceTime,
    topPredictions,
  };
}