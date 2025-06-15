import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { removeBackground } from "@imgly/background-removal";
import { applySharpen } from "./utils/imageProcessing";
import ImageCompareSlider from "./component/ImageCompareSlider";


function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressionPercentage, setCompressionPercentage] = useState(0); // 0% compression initially
  const [bgRemovedUrl, setBgRemovedUrl] = useState(null);
  const [loading, setLoading] = useState(false);



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
      setBgRemovedUrl(null);
    }
  };

  const handleCompress = async () => {
    if (!originalFile) return;
    setLoading(true);
    try {
      const originalSizeMB = originalFile.size / (1024 * 1024);
      const minTargetSizeMB = 0.01; // Smallest possible target size for max compression

      // Calculate target maxSizeMB based on compressionPercentage
      // 0% compression -> originalSizeMB
      // 100% compression -> minTargetSizeMB
      const calculatedMaxSizeMB = originalSizeMB - (originalSizeMB - minTargetSizeMB) * (compressionPercentage / 100);

      const options = {
        maxSizeMB: Math.max(calculatedMaxSizeMB, minTargetSizeMB), // Ensure it doesn't go below minTargetSizeMB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressed = await imageCompression(originalFile, options);

      // Apply sharpening
      const imageBitmap = await createImageBitmap(compressed);
      const sharpenedBlob = await applySharpen(imageBitmap);
      const sharpenedFile = new File([sharpenedBlob], compressed.name, { type: sharpenedBlob.type });

      setCompressedFile(sharpenedFile);
      setCompressedUrl(URL.createObjectURL(sharpenedFile));
    } catch (error) {
      console.error("Compression error:", error);
    }
    setLoading(false);
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;
    setLoading(true);
  
    try {
      const outputBlob = await removeBackground(originalFile); // just one function
      setBgRemovedUrl(URL.createObjectURL(outputBlob));
    } catch (error) {
      console.error("Background removal error:", error);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">🖼️ Image Compressor & Background Remover</h1>

      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <div>
          <label className="block mb-1 font-medium">Compression Level: {compressionPercentage}%</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={compressionPercentage}
            onChange={(e) => setCompressionPercentage(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {originalFile && (
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleCompress}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Compress
            </button>
            <button
              onClick={handleRemoveBackground}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Remove BG
            </button>
          </div>
        )}
      </div>

      {loading && <p className="mt-6 text-blue-600 font-medium">Processing...</p>}

      <div className="mt-10 flex flex-wrap gap-8 justify-center">
        {previewUrl && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Original</h2>
            <img src={previewUrl} className="w-64 rounded shadow" />
            <p className="text-sm mt-1">{(originalFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {compressedUrl && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Compressed</h2>
            <img src={compressedUrl} className="w-64 rounded shadow" />
            <p className="text-sm mt-1">{(compressedFile.size / 1024).toFixed(2)} KB</p>
            <a
              href={compressedUrl}
              download="compressed.jpg"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download
            </a>
          </div>
        )}

        {bgRemovedUrl && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Background</h2>
            <img src={bgRemovedUrl} className="w-64 rounded shadow" />
            <a
              href={bgRemovedUrl}
              download="no-background.png"
              className="mt-2 inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Download PNG
            </a>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-8 justify-center w-full">
        {compressedUrl && previewUrl && (
          <div className="text-center w-full mx-auto flex justify-center flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Compressed Comparison</h2>
            <ImageCompareSlider originalImageUrl={previewUrl} modifiedImageUrl={compressedUrl} />
          </div>
        )}

        {bgRemovedUrl && previewUrl && (
          <div className="text-center w-full mx-auto flex justify-center flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Background Removal Comparison</h2>
            <ImageCompareSlider originalImageUrl={previewUrl} modifiedImageUrl={bgRemovedUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
