(() => {
  const size = 320; // Square viewport size
  let streaming = false;

  let video = null;
  let canvas = null;
  let startButton = null;
  let photoRow = null;

  // Array to store image URLs
  const gallery = [];

  function clearPhoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

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

      context.drawImage(
        video,
        sx, sy, sWidth, sHeight, // source rectangle
        0, 0, size, size         // destination rectangle
      );

      const data = canvas.toDataURL("image/png");
      gallery.push(data);
      renderGallery();
    } else {
      clearPhoto();
    }
  }

  function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    startButton = document.getElementById("start-button");
    photoRow = document.getElementById("photo-row");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

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

  window.addEventListener("load", startup, false);
})();