// src/js/validator.js

let normalizedDataset = {};
const predictionHistory = [];
const HISTORY_LENGTH = 15; // The buffer size

// 1. Math magic to make hand position and size irrelevant
function normalizeLandmarks(landmarks) {
    const wrist = landmarks[0];
    
    // Shift everything so the wrist is at (0,0,0)
    let shifted = landmarks.map(lm => ({
        x: lm.x - wrist.x,
        y: lm.y - wrist.y,
        z: lm.z - wrist.z
    }));

    // Find the furthest point to calculate scale
    let maxDistance = 0;
    for (let lm of shifted) {
        let distance = Math.sqrt(lm.x**2 + lm.y**2 + lm.z**2);
        if (distance > maxDistance) {
            maxDistance = distance;
        }
    }

    // Scale all points down
    if (maxDistance > 0) {
        return shifted.map(lm => ({
            x: lm.x / maxDistance,
            y: lm.y / maxDistance,
            z: lm.z / maxDistance
        }));
    }
    return shifted;
}

// 2. Load the JSON and normalize the benchmark data ONCE so it doesn't lag the browser
export async function loadAndPrepareDataset() {
    console.log("Fetching benchmark dataset...");
    const response = await fetch('./data/benchmark_dataset.json');
    const rawData = await response.json();

    for (const [letter, samples] of Object.entries(rawData)) {
        normalizedDataset[letter] = samples.map(sample => normalizeLandmarks(sample));
    }
    console.log("Dataset loaded and normalized successfully!");
}

// 3. The Comparison Engine
export function predictSign(liveLandmarks) {
    if (Object.keys(normalizedDataset).length === 0) return null;

    const liveNorm = normalizeLandmarks(liveLandmarks);
    
    let bestMatch = null;
    let minDistance = Infinity;

    // Compare live hand to every sample in our dataset
    for (const [letter, samples] of Object.entries(normalizedDataset)) {
        for (const sample of samples) {
            let totalDistance = 0;
            
            // Calculate Euclidean distance between all 21 points
            for (let i = 0; i < 21; i++) {
                totalDistance += Math.sqrt(
                    Math.pow(liveNorm[i].x - sample[i].x, 2) +
                    Math.pow(liveNorm[i].y - sample[i].y, 2) +
                    Math.pow(liveNorm[i].z - sample[i].z, 2)
                );
            }

            if (totalDistance < minDistance) {
                minDistance = totalDistance;
                bestMatch = letter;
            }
        }
    }

    return bestMatch; // Returns the predicted letter (e.g., "A", "B")
}

export function getSmoothedPrediction(liveLandmarks) {
    const rawPrediction = predictSign(liveLandmarks); // Your existing KNN function
    if (!rawPrediction) return null;

    // Add to history and keep it at the max length
    predictionHistory.push(rawPrediction);
    if (predictionHistory.length > HISTORY_LENGTH) {
        predictionHistory.shift(); 
    }

    // Find the most frequent letter in our recent history
    const counts = {};
    let maxLetter = null;
    let maxCount = 0;

    for (const letter of predictionHistory) {
        counts[letter] = (counts[letter] || 0) + 1;
        if (counts[letter] > maxCount) {
            maxCount = counts[letter];
            maxLetter = letter;
        }
    }

    // Only return a prediction if the engine is highly confident (e.g., 10 out of 15 frames agree)
    if (maxCount >= 10) {
        return maxLetter;
    }
    return null; // Not confident enough yet
}