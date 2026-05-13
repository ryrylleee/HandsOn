/**
 * Starts the webcam and pipes the feed into the gesture engine.
 * @param {HTMLVideoElement} videoElement - The hidden video element.
 * @param {Hands} handsModel - The initialized MediaPipe model.
 */
export function startCamera(videoElement, handsModel) {
    const camera = new window.Camera(videoElement, {
        onFrame: async () => {
            await handsModel.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });

    camera.start();
}