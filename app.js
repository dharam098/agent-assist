const startButton = document.getElementById("start-button");
let audioContext, recorder;

startButton.addEventListener("click", () => {
    startRecording();
});

async function startRecording() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const input = audioContext.createMediaStreamSource(stream);
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = async (e) => {
        const audioBlob = e.data;
        // Send the audioBlob to your API
        const responseAudio = await sendAudioToAPI(audioBlob);
        playResponseAudio(responseAudio);
    };

    recorder.start();

    // Detect silence (for simplicity, we just stop recording after 5 seconds)
    setTimeout(() => {
        recorder.stop();
    }, 5000);  // Replace this with actual silence detection if needed
}

async function sendAudioToAPI(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const response = await fetch('https://your-api-url.com/endpoint', {
        method: 'POST',
        body: formData
    });
    return await response.blob();
}

function playResponseAudio(audioBlob) {
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();
}
