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

function isLikelyMangoLeaf(pixels) {
  let greenPixels = 0;
  let strongGreenPixels = 0;

  const totalPixels = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const greenDominant =
      g > r * 1.15 &&
      g > b * 1.10;

    const strongGreen =
      g > 60 &&
      g - r > 15 &&
      g - b > 10;

    if (greenDominant) {
      greenPixels++;
    }

    if (
      greenDominant &&
      strongGreen
    ) {
      strongGreenPixels++;
    }
  }

  const greenRatio =
    greenPixels / totalPixels;

  const strongGreenRatio =
    strongGreenPixels / totalPixels;

  console.log("==============================");
  console.log("IMAGE VALIDATION");

  console.log(
    "Green ratio:",
    (greenRatio * 100).toFixed(2) + "%"
  );

  console.log(
    "Strong green ratio:",
    (strongGreenRatio * 100).toFixed(2) + "%"
  );

  const looksLikeLeaf =
    greenRatio >= 0.18 &&
    strongGreenRatio >= 0.10;

  console.log(
    looksLikeLeaf
      ? "✅ Image passed leaf validation"
      : "❌ Image failed leaf validation"
  );

  console.log("==============================");

  return looksLikeLeaf;
}

export async function predictMango(imageUri) {
  console.log("================================");
  console.log("STEP 1: Starting prediction");
  console.log("Image URI:", imageUri);

  try {
    if (!imageUri) {
      throw new Error("No image URI received");
    }

    console.log("STEP 2: Loading model");

    const model = await getModel();

    console.log("STEP 3: Model ready");

    console.log("STEP 4: Reading image");

    const base64 =
      await FileSystem.readAsStringAsync(
        imageUri,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

    console.log(
      "STEP 5: Image read successfully"
    );

    console.log(
      "Base64 length:",
      base64.length
    );

    console.log(
      "STEP 6: Skia decoding image"
    );

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

    const originalWidth =
      image.width();

    const originalHeight =
      image.height();

    console.log(
      "Decoded width:",
      originalWidth
    );

    console.log(
      "Decoded height:",
      originalHeight
    );

    let finalImage = image;

    if (
      originalWidth !== 224 ||
      originalHeight !== 224
    ) {
      console.log(
        "STEP 7: Resizing image to 224x224"
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

      const sourceRect =
        Skia.XYWHRect(
          0,
          0,
          originalWidth,
          originalHeight
        );

      const destinationRect =
        Skia.XYWHRect(
          0,
          0,
          224,
          224
        );

      canvas.drawImageRect(
        image,
        sourceRect,
        destinationRect,
        paint
      );

      finalImage =
        surface.makeImageSnapshot();

      surface.dispose();

      if (!finalImage) {
        throw new Error(
          "Image resize failed"
        );
      }

      console.log(
        "Image resized successfully"
      );
    } else {
      console.log(
        "STEP 7: Image already 224x224"
      );
    }

    console.log(
      "STEP 8: Reading pixels"
    );

    const imageInfo = {
      width: 224,
      height: 224,
      colorType: ColorType.RGBA_8888,
      alphaType: AlphaType.Opaque,
    };

    const pixels =
      finalImage.readPixels(
        0,
        0,
        imageInfo
      );

    if (!pixels) {
      throw new Error(
        "Skia failed to read pixels"
      );
    }

    console.log(
      "Pixel buffer length:",
      pixels.length
    );

    console.log(
      "STEP 9: Validating image"
    );

    const validLeaf =
      isLikelyMangoLeaf(pixels);

    if (!validLeaf) {
      return {
        valid: false,
        prediction: null,
        confidence: 0,
        inferenceTime: 0,
        topPredictions: [],
        error:
          "The selected image does not appear to contain a mango leaf.",
      };
    }

    console.log(
      "STEP 10: Creating Float32 input"
    );

    const input =
      new Float32Array(
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
      "Pixel 0 R:",
      input[0]
    );

    console.log(
      "Pixel 0 G:",
      input[1]
    );

    console.log(
      "Pixel 0 B:",
      input[2]
    );

    console.log(
      "Pixel 1 R:",
      input[3]
    );

    console.log(
      "Pixel 1 G:",
      input[4]
    );

    console.log(
      "Pixel 1 B:",
      input[5]
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
      "STEP 11: Running TFLite model"
    );

    const startTime =
      Date.now();

    const outputs =
      await model.run([
        input.buffer,
      ]);

    const inferenceTime =
      Date.now() - startTime;

    console.log(
      "STEP 12: Inference completed"
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
      new Float32Array(
        outputs[0]
      );

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
        .map(
          (value, index) => ({
            confidence:
              value * 100,
            index,
            label:
              LABELS[index],
          })
        )
        .sort(
          (a, b) =>
            b.confidence -
            a.confidence
        )
        .slice(0, 3);

    console.log(
      "STEP 13: Prediction:",
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
      valid: true,
      prediction,
      confidence,
      inferenceTime,
      topPredictions,
    };
  } catch (error) {
    console.log(
      "Prediction Error:",
      error
    );

    return {
      valid: false,
      prediction: null,
      confidence: 0,
      inferenceTime: 0,
      topPredictions: [],
      error:
        error?.message ||
        "Prediction failed.",
    };
  }
}