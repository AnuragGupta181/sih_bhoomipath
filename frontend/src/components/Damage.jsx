import { useState } from "react";
import { Upload, Send, CheckCircle } from "lucide-react";
import Header from '@/components/Header';
import FloatingChatButton from "@/components/FloatingChatButton";

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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/damage`, {
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

      <div className="min-h-screen bhoomi-hero-bg mt-20 animate-fade-in">
        <header className="bhoomi-card shadow-glow mb-8 animate-float">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold bhoomi-text-gradient mb-2 tracking-tight">Damage Identifier</h1>
            <p className="text-lg text-bhoomi-chocolate">Upload an image to detect surface damage</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bhoomi-card p-8 space-y-8 animate-fade-in">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-accent rounded-xl p-8 text-center hover:border-primary transition-colors animate-fade-in">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-14 h-14 text-bhoomi-avocado mb-4 animate-float" />
                <span className="text-xl font-semibold bhoomi-text-gradient mb-1">Click to upload or capture image</span>
                <span className="text-sm text-bhoomi-chocolate">PNG, JPG, JPEG</span>
              </label>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-6 animate-fade-in">
                <h3 className="text-base font-semibold text-bhoomi-chocolate mb-2">Selected Image</h3>
                <div className="aspect-square bg-bhoomi-vanilla-light rounded-xl overflow-hidden flex items-center justify-center shadow-glow">
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
                className="bhoomi-btn-glow w-full py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bhoomi-card border border-accent rounded-xl p-4 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-bhoomi-avocado" />
                  <span className="text-bhoomi-chocolate font-semibold">Server Response:</span>
                </div>
                <pre className="text-base text-bhoomi-chocolate bg-bhoomi-vanilla-light p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(responseData.predicted_class, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
      <FloatingChatButton />
    </>
  );
}

export default App;
