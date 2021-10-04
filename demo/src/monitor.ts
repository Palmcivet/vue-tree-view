export default function Monitor(canvas: HTMLCanvasElement, { interval } = { interval: 30 }) {
  canvas.style.position = "fixed";
  canvas.style.right = "8px";
  canvas.style.bottom = "8px";
  canvas.width = 100;
  canvas.height = 50;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.info("浏览器不支持canvas");
  } else {
    let lastTime = 0;
    let count = 0; // fps 监听间隔计数
    let fps = 0; // fps 值

    const getFps = () => {
      count++;
      let nowTime = performance.now();
      if (count >= interval) {
        fps = Math.round((1000 * count) / (nowTime - lastTime));
        lastTime = nowTime;
        count = 0;
      }
      return fps;
    };

    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const startDraw = () => {
      clearCanvas();
      ctx.font = "28px serif";
      ctx.fillStyle = "#558abb";
      ctx.fillText(getFps() + " fps", 10, 20);
      window.requestAnimationFrame(startDraw);
    };

    startDraw();
  }
}
