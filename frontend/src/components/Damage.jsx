import { useState } from "react";
import { Upload, Send, CheckCircle } from "lucide-react";
import Header from '@/components/Header';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // remove prefix
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setIsSubmitting(true);
    setResponseData(null);

    try {
      const base64Image = await toBase64(selectedImage);

      const response = await fetch("http://127.0.0.1:5000/damage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("POST Response:", result);
        setResponseData(result);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 mt-20">
        <header className="bg-green-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-white">Image Uploader</h1>
            <p className="text-green-100 mt-2">
              Upload an image and see the backend response
            </p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload or capture image
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG</p>
              </label>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Image
                </h3>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedImage && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Upload Image
                  </>
                )}
              </button>
            )}

            {/* Response Output */}
            {responseData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">Server Response:</p>
                </div>
                <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(responseData.predicted_class, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
