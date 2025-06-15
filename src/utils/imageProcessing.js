export const applySharpen = (imageBitmap) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Sharpening kernel (unsharp mask)
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  const kernelSize = 3;
  const kernelRadius = Math.floor(kernelSize / 2);

  const outputPixels = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const px = x + kx - kernelRadius;
          const py = y + ky - kernelRadius;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const index = (py * width + px) * 4;
            const weight = kernel[ky][kx];

            r += pixels[index] * weight;
            g += pixels[index + 1] * weight;
            b += pixels[index + 2] * weight;
          }
        }
      }

      const outputIndex = (y * width + x) * 4;
      outputPixels[outputIndex] = Math.min(255, Math.max(0, r));
      outputPixels[outputIndex + 1] = Math.min(255, Math.max(0, g));
      outputPixels[outputIndex + 2] = Math.min(255, Math.max(0, b));
      outputPixels[outputIndex + 3] = pixels[outputIndex + 3]; // Alpha channel
    }
  }

  const outputImageData = new ImageData(outputPixels, width, height);
  ctx.putImageData(outputImageData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg'); // You might want to make this configurable
  });
};