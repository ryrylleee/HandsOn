const video = document.getElementById('webcam');

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
        });
        video.srcObject = stream;
        console.log("Webcam integrated successfully[cite: 1].");
    } catch (error) {
        console.error("Camera access denied: ", error);
        alert("HandsOn requires camera access to validate signs[cite: 1].");
    }
}

// Start camera when the dashboard loads[cite: 1]
if (video) {
    setupCamera();
}
const video = document.getElementById('webcam');

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
        });
        video.srcObject = stream;
        console.log("Webcam integrated successfully[cite: 1].");
    } catch (error) {
        console.error("Camera access denied: ", error);
        alert("HandsOn requires camera access to validate signs[cite: 1].");
    }
}

// Start camera when the dashboard loads[cite: 1]
if (video) {
    setupCamera();
}