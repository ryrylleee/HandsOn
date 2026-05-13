// src/js/main.js
import { initializeGestureEngine } from './gestureEngine.js';
import { startCamera } from './camera.js';
import { loadAndPrepareDataset, getSmoothedPrediction } from './validator.js';
import { setupUI, updateFeedbackBadge } from './ui.js';

let currentTargetSign = null;

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Initialize Dataset
    await loadAndPrepareDataset();

    // 2. Initialize UI and listen for button clicks
    setupUI((newLetter) => {
        currentTargetSign = newLetter;
        updateFeedbackBadge('WAITING'); // Reset badge when a new letter is clicked
    });

    // 3. Setup Camera & Engine
    const videoElement = document.querySelector('.input-video');
    const canvasElement = document.querySelector('.output-canvas');
    const canvasCtx = canvasElement.getContext('2d');

    const handsModel = initializeGestureEngine(canvasElement, canvasCtx, (liveLandmarks) => {
        // This is a custom callback we pass to the engine to handle the validation
        if (!currentTargetSign) return;

        const prediction = getSmoothedPrediction(liveLandmarks);

        if (prediction === currentTargetSign) {
            updateFeedbackBadge('CORRECT');
        } else {
            updateFeedbackBadge('INCORRECT');
        }
    });

    startCamera(videoElement, handsModel);
});