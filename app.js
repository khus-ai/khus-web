const output = document.getElementById("output");

// 🎤 Voice
function startListening() {
  const rec = new webkitSpeechRecognition();
  rec.lang = "en-US";
  rec.start();

  rec.onresult = async e => {
    const text = e.results[0][0].transcript.toLowerCase();
    output.innerText = text;

    if (text.includes("hey khus")) {
      speak("Yes, how can I help?");
    } else {
      defenceCheck(text);
      const reply = await chatGPT(text);
      speak(reply);
    }
  };
}

function speak(text) {
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// 🧠 ChatGPT Brain
async function chatGPT(msg) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are KHUS, a protective AI assistant." },
        { role: "user", content: msg }
      ]
    })
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

// 🛡️ Defence Learning
function defenceCheck(text) {
  if (text.includes("download apk") || text.includes("unknown link")) {
    speak("Warning. Unknown downloads may be unsafe.");
  }
}

// 🔐 Face Detection
async function startFaceLock() {
  const video = document.getElementById("video");
  navigator.mediaDevices.getUserMedia({ video: true }).then(s => video.srcObject = s);

  await faceapi.nets.tinyFaceDetector.loadFromUri(
    "https://justadudewhohacks.github.io/face-api.js/models"
  );

  setInterval(async () => {
    const face = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
    if (face) {
      document.getElementById("lock").hidden = true;
      document.getElementById("app").hidden = false;
      speak("Identity confirmed. KHUS online.");
    }
  }, 1500);
}

startFaceLock();
