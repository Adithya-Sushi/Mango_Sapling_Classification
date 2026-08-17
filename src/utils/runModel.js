export async function predictMango(imageUri) {

  console.log("Image received:", imageUri);

  return {
    prediction: "Prediction coming next",
    confidence: 0,
    top3: []
  };

}