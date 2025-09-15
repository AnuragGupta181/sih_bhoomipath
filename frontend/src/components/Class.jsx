import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import confetti from "canvas-confetti";
import Header from '@/components/Header';
import FloatingChatButton from "@/components/FloatingChatButton";

export default function SpectroscopyForm() {
  const [values, setValues] = useState({
    R_10: "",
    R_8: "",
    R_6: "",
    G_10: "",
    G_8: "",
    G_6: "",
    B_10: "",
    B_8: "",
    B_6: "",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict_spectroscopy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({ specta: values })
,
      });

      const data = await res.json();
      setResponse(data);

      // Confetti animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <Header/>
    <div className="min-h-screen flex items-center justify-center bhoomi-hero-bg p-6">
      <motion.div
        className="bhoomi-card glass w-full max-w-lg p-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 bhoomi-text-gradient">
          Spectroscopy Prediction
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          {Object.keys(values).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{key}</label>
              <Input
                type="number"
                name={key}
                value={values[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                required
                className="bhoomi-input"
              />
            </div>
          ))}

          <div className="col-span-3 mt-6 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bhoomi-btn-glow px-8 py-3 text-lg font-semibold"
            >
              {loading ? "Predicting..." : "Submit"}
            </Button>
          </div>
        </form>

        {response && (
          <motion.div
            className="mt-8 p-4 rounded-lg bg-green-100 text-green-800 text-center animate-fade-in"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-lg font-bold mb-2 bhoomi-text-gradient">🎉 Prediction Result 🎉</h2>
            <pre className="text-sm text-left overflow-x-auto">
              {JSON.stringify(response.class, null, 2)}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </div>
    <FloatingChatButton />  
  </>
  );
}
