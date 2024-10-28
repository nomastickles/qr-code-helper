import QrScanner from "qr-scanner";

const video = document.getElementById("qr-video");
const videoContainer = document.getElementById("video-container");
const camHasCamera = document.getElementById("cam-has-camera");
const camList = document.getElementById("cam-list");
const camHasFlash = document.getElementById("cam-has-flash");
const flashToggle = document.getElementById("flash-toggle");
const flashState = document.getElementById("flash-state");
const camQrResult = document.getElementById("cam-qr-result");
const camQrResultTimestamp = document.getElementById("cam-qr-result-timestamp");
const fileSelector = document.getElementById("file-selector");
const fileQrResult = document.getElementById("file-qr-result");

function setResult(label, result) {
  console.log(result.data);
  label.textContent = result.data;
  camQrResultTimestamp.textContent = new Date().toString();
  label.style.color = "teal";
  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
    () => (label.style.color = "inherit"),
    100
  );
}

// 0 or 1
const LOCAL_STORAGE_KEY_CAMERA_ENABLED_BOOL = "cameraEnabled";

// ####### Web Cam Scanning #######

const scanner = new QrScanner(
  video,
  (result) => setResult(camQrResult, result),
  {
    onDecodeError: (error) => {
      camQrResult.textContent = error;
      camQrResult.style.color = "inherit";
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
  }
);

const updateFlashAvailability = () => {
  scanner.hasFlash().then((hasFlash) => {
    camHasFlash.textContent = hasFlash;
    flashToggle.style.display = hasFlash ? "inline-block" : "none";
    // TODO: set from local storage
  });
};

QrScanner.listCameras(true)
  .then((cameras) =>
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.id;
      option.text = camera.label;
      camList.add(option);
    })
  )
  .finally(() => {
    switch (localStorage.getItem(LOCAL_STORAGE_KEY_CAMERA_ENABLED_BOOL)) {
      case "0":
        scanner.stop();
        break;
      case "1":
        scanner.start();
        break;
      default:
    }
  });

QrScanner.hasCamera().then(
  (hasCamera) => (camHasCamera.textContent = hasCamera)
);

// for debugging
window.scanner = scanner;

//

fileQrResult.addEventListener("onchange", (event) => {
  console.log("fileQrResult onchange event", event);
});

//

document
  .getElementById("scan-region-highlight-style-select")
  .addEventListener("change", (e) => {
    videoContainer.className = e.target.value;
    scanner._updateOverlay(); // reposition the highlight because style 2 sets position: relative
  });

document.getElementById("show-scan-region").addEventListener("change", (e) => {
  const input = e.target;
  const label = input.parentNode;
  label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
  scanner.$canvas.style.display = input.checked ? "none" : "block";
});

document
  .getElementById("inversion-mode-select")
  .addEventListener("change", (event) => {
    scanner.setInversionMode(event.target.value);
  });

camList.addEventListener("change", (event) => {
  scanner.setCamera(event.target.value).then(updateFlashAvailability);
});

flashToggle.addEventListener("click", () => {
  scanner
    .toggleFlash()
    .then(() => (flashState.textContent = scanner.isFlashOn() ? "on" : "off"));
});

document.getElementById("start-button").addEventListener("click", () => {
  scanner.start();
  localStorage.setItem(LOCAL_STORAGE_KEY_CAMERA_ENABLED_BOOL, "1");
});

document.getElementById("stop-button").addEventListener("click", () => {
  scanner.stop();
  localStorage.setItem(LOCAL_STORAGE_KEY_CAMERA_ENABLED_BOOL, "0");
  // window.location.reload();
});

// TODO: on startup check local storage for and flash settings

// ####### File Scanning #######

fileSelector.addEventListener("change", (event) => {
  const file = fileSelector.files[0];
  if (!file) {
    return;
  }
  document.getElementById("stop-button").dispatchEvent(new Event("click"));
  QrScanner.scanImage(file, { returnDetailedScanResult: true })
    .then((result) => setResult(fileQrResult, result))
    .catch((e) => setResult(fileQrResult, { data: e || "No QR code found." }));
});

//
// setTimeout(() => {}, 0);

function inactivityTimeout() {
  let timer;
  const IDLE_TIMEOUT = 60000; // In milliseconds (1 minute)

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.warn(
        "You have been inactive for too long. Please refresh the page."
      );
      scanner.stop();
    }, IDLE_TIMEOUT);
  };

  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onmousedown = resetTimer;
  document.onkeydown = resetTimer;
  document.onscroll = resetTimer;
}

// javascript immediately-invoked function expression (IIFE)

(function () {
  // Call the function to initiate
  inactivityTimeout();
  document
    .getElementById("show-scan-region")
    .dispatchEvent(new Event("change"));
})();
