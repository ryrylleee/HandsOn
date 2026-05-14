import { initializeGestureEngine } from './gestureEngine.js';
import { startCamera } from './camera.js';
import { loadAndPrepareDataset, getSmoothedPrediction } from './validator.js';
import { setupUI, updateFeedbackBadge } from './ui.js';
let currentTargetSign = null;
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndPrepareDataset();
    setupUI((newLetter) => {
        currentTargetSign = newLetter;
        updateFeedbackBadge('WAITING');
    });
    const startCamBtn = document.getElementById('start-camera-btn');
    const videoElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('output_canvas');
    const practiceOverlay = document.getElementById('practice-overlay');
    const canvasCtx = canvasElement.getContext('2d');
    const handsModel = initializeGestureEngine(canvasElement, canvasCtx,
        (liveLandmarks) => {
            if (!currentTargetSign) return;
            const prediction = getSmoothedPrediction(liveLandmarks);
            if (!prediction) {
                updateFeedbackBadge('WAITING');
                return;
            }
            if (prediction === currentTargetSign) {
                updateFeedbackBadge('CORRECT');
            } else {
                updateFeedbackBadge('INCORRECT');
            }
        });
    startCamBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            videoElement.srcObject = stream;
            practiceOverlay.style.display = 'none';
            videoElement.style.display = 'block';
            canvasElement.style.display = 'block';
            videoElement.play();
            startCamera(videoElement, handsModel);
        } catch (err) {
            console.error(err);
            alert('Camera access denied.');
        }
    });
});