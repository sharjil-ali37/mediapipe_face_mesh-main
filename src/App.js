import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;
  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#30FF30",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#30FF30",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }
    }
    canvasCtx.restore();
  }
  // }

  // setInterval(())
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    // async function fetchEmotions() {
    //   const landmarks = onResults.multiFaceLandmarks[0];
    //   const eyeAspectRatio = (landmarks[263].x - landmarks[373].x) / (landmarks[362].y - landmarks[263].y);
    //   const mouthDistance = Math.sqrt((landmarks[308].x - landmarks[317].x)**2 + (landmarks[308].y - landmarks[317].y)**2);
    //   const eyebrowAngle = Math.atan((landmarks[296].y - landmarks[398].y) / (landmarks[296].x - landmarks[398].x));
    //   const emotion = await model.predict([eyeAspectRatio, mouthDistance, eyebrowAngle]);
    //   return emotion;
    // }
    
    // // Use a callback function
    // function fetchEmotions(callback) {
    //   const landmarks = onResults.multiFaceLandmarks[0];
    //   const eyeAspectRatio = (landmarks[263].x - landmarks[373].x) / (landmarks[362].y - landmarks[263].y);
    //   const mouthDistance = Math.sqrt((landmarks[308].x - landmarks[317].x)**2 + (landmarks[308].y - landmarks[317].y)**2);
    //   const eyebrowAngle = Math.atan((landmarks[296].y - landmarks[398].y) / (landmarks[296].x - landmarks[398].x));
    //   model.predict([eyeAspectRatio, mouthDistance, eyebrowAngle], (emotion) => {
    //     callback(emotion);
    //   });
    // }
    
    // // Use a promise chain
    // function fetchEmotions() {
    //   return new Promise((resolve, reject) => {
    //     const landmarks = onResults.multiFaceLandmarks[0];
    //     const eyeAspectRatio = (landmarks[263].x - landmarks[373].x) / (landmarks[362].y - landmarks[263].y);
    //     const mouthDistance = Math.sqrt((landmarks[308].x - landmarks[317].x)**2 + (landmarks[308].y - landmarks[317].y)**2);
    //     const eyebrowAngle = Math.atan((landmarks[296].y - landmarks[398].y) / (landmarks[296].x - landmarks[398].x));
    //     model.predict([eyeAspectRatio, mouthDistance, eyebrowAngle], (emotion) => {
    //       resolve(emotion);
    //     }, reject);
    //   });
    // }




    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);
  return (
    <center>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
      </div>
    </center>
  );
}

export default App;
