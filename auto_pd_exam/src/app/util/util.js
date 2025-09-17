const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19],
  [19, 20]
];

export const videoConstraints = {
  width: 1104,
  height: 621,
  facingMode: "user"
};

export const handleDownload = (recordedChunks, task, hand) => {
  if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      console.log(url);
      a.download = `${task.replaceAll(" ", "_") + "_" + hand}.mp4`
      a.click();
      window.URL.revokeObjectURL(url);
      console.log(blob);
      return blob;
    }
    return null;
  }
  
export function drawHandLandmarks(ctx, landmarks) {
  if (!landmarks) return;
  
  // Draw lines between connected landmarks
  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    ctx.beginPath();
    ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
    ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Draw individual points
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(
      landmark.x * ctx.canvas.width,
      landmark.y * ctx.canvas.height,
      5, // radius
      0, // start angle
      2 * Math.PI // end angle
    );
    ctx.fillStyle = "#FF0000";
    ctx.fill();
  }
}
  
export function drawFaceLandmarks(ctx, landmarks) {
  if (!landmarks || landmarks.length < 3) return;
  
  // Draw line between landmark 1 (nose tip) and landmark 2 (upper lip)
  const start = landmarks[0];
  const end = landmarks[1];
  
  ctx.beginPath();
  ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
  ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
  ctx.strokeStyle = "#00FF00"; // green line
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw points for landmark 1 and 2
  [start, end].forEach((landmark) => {
    ctx.beginPath();
    ctx.arc(
      landmark.x * ctx.canvas.width,
      landmark.y * ctx.canvas.height,
      5, // radius of circle
      0, // start angle
      2 * Math.PI // end angle
    );
    ctx.fillStyle = "#FF0000"; // red dots
    ctx.fill();
  });
}