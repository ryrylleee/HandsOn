export function startCamera(videoElement, handsModel) {
    const camera = new window.Camera(videoElement, {
        onFrame: async () => {
            await handsModel.send({
                image: videoElement
            });
        },
        width: 640,
        height: 480
    });
    camera.start();
}