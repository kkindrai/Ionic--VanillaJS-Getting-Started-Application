// Code Sample Modified from Mozilla
// https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

// Global Variables
const gallery     = [];   // Array to store captured images
const size        = 320;  // Viewport Size
let   streaming   = false;
let   canvas      = null;
let   photoRow    = null;
let   startButton = null;
let   video       = null;

  
/**
 * Clears the canvas by filling it with a gray color.
 * This is used to reset the canvas before capturing a new image.
 */
function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Renders the gallery of captured images.
 * It creates a grid layout using ion-col elements for each image.
 */
function renderGallery() {
  photoRow.innerHTML = "";
  gallery.forEach((imgUrl) => {
    const ionCol = document.createElement("ion-col");
    ionCol.setAttribute("size", "4");

    const ionImg = document.createElement("ion-img");
    ionImg.setAttribute("src", imgUrl);
    ionImg.style.width = "100%";
    ionImg.style.height = "auto";
    ionImg.style.margin = "4px";

    ionCol.appendChild(ionImg);
    photoRow.appendChild(ionCol);
  });
}


/**
 * Captures a picture from the video stream and adds it to the gallery.
 * The picture is centered and cropped to a square based on the video aspect ratio.
 */
function takePicture() {
  const context = canvas.getContext("2d");
  if (size) {
    canvas.width = size;
    canvas.height = size;

    // Center-crop the video to a square
    const videoAspect = video.videoWidth / video.videoHeight;
    let sx, sy, sWidth, sHeight;

    if (videoAspect > 1) {
      // Video is wider than tall
      sHeight = video.videoHeight;
      sWidth = sHeight;
      sx = (video.videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      // Video is taller than wide or square
      sWidth = video.videoWidth;
      sHeight = sWidth;
      sx = 0;
      sy = (video.videoHeight - sHeight) / 2;
    }

    // Draw the video frame onto the canvas
    context.drawImage(
      video,
      sx, sy, sWidth, sHeight, // source rectangle
      0, 0, size, size         // destination rectangle
    );

    // Convert the canvas to a data URL and add it to the gallery
    const data = canvas.toDataURL("image/png");
    gallery.push(data);
    renderGallery();
  } else {
    clearPhoto();
  }
}

/**
 * Initializes the app by setting up the video stream and event listeners.
 */
function startup() {
  // Get references to the HTML elements
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  startButton = document.getElementById("start-button");
  photoRow = document.getElementById("photo-row");

  // Check if the browser supports the MediaDevices API
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });

  // Set up event listeners for the video element
  video.addEventListener(
    "canplay",
    () => {
      if (!streaming) {
        video.setAttribute("width", size);
        video.setAttribute("height", size);
        canvas.setAttribute("width", size);
        canvas.setAttribute("height", size);
        streaming = true;
      }
    },
    false,
  );

  // Set up the start button to capture a picture
  startButton.addEventListener(
    "click",
    (ev) => {
      takePicture();
      ev.preventDefault();
    },
    false,
  );
  clearPhoto();
}

// Initialize the app when the window loads
window.addEventListener("load", startup, false);