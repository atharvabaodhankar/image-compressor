import { useState } from "react";
import imageCompression from "browser-image-compression";

function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
    }
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(originalFile, options);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🗜️ Image Compressor</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {previewUrl && (
        <div className="mb-4 flex gap-8">
          <div>
            <h2 className="text-xl font-semibold">Original</h2>
            <img src={previewUrl} alt="original" className="w-64 mt-2 rounded" />
            <p className="text-sm text-gray-600 mt-1">
              {(originalFile.size / 1024).toFixed(2)} KB
            </p>
          </div>

          {compressedUrl && (
            <div>
              <h2 className="text-xl font-semibold">Compressed</h2>
              <img src={compressedUrl} alt="compressed" className="w-64 mt-2 rounded" />
              <p className="text-sm text-gray-600 mt-1">
                {(compressedFile.size / 1024).toFixed(2)} KB
              </p>
              <a
                href={compressedUrl}
                download="compressed.jpg"
                className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download
              </a>
            </div>
          )}
        </div>
      )}

      {originalFile && !compressedFile && (
        <button
          onClick={handleCompress}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Compress Image
        </button>
      )}
    </div>
  );
}

export default App;
  