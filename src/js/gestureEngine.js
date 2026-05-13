// src/js/gestureEngine.js

// Notice the new 3rd parameter here!
export function initializeGestureEngine(canvasElement, canvasCtx, onLandmarksDetected) {
    
    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                
                // --- THE CRITICAL FIX ---
                // We send the live coordinates back to main.js so the UI can update!
                if (onLandmarksDetected) {
                    onLandmarksDetected(landmarks);
                }
                // ------------------------

                // Draw the skeleton
                // window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
                // window.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
            }
        }
        canvasCtx.restore();
    }

    const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);
    return hands;
}