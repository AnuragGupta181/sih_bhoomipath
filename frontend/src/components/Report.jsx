import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';
import FloatingChatButton from "@/components/FloatingChatButton";

export default function LCAReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();
  const location = useLocation();
  const { results, answers, sample_row } = location.state || {};
 

useEffect(() => {
  // fallback data
  const sampleData = {
    "Process_Type": "Primary",
    "Metal": "Aluminium",
    "Energy_MJ_per_kg": 210.5,
    "Quantity_kg": 1200,
    "Energy_MJ_total": 252600.0,
    "Transport_km": 150.0,
    "Transport_Mode": "Truck",
    "Transport_emissions_kgCO2": 45.7,
    "Water_use_m3_per_ton": 6.8,
    "End_of_Life": "Recycle",
    "Circularity_option": "Closed-loop",
    "Process_emissions_kgCO2": 520.3,
    "Total_emissions_kgCO2": 566.0,
    "Emission_factor_kgCO2_per_MJ": 0.0021
  };

  // 👇 agar sample_row mila hai to wahi bhejna, warna fallback
  const payload = sample_row || sampleData;

  fetch(`${import.meta.env.VITE_API_URL}/graphs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(resData => setData(resData))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, [sample_row]);



  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("LCA_Report.pdf");
  };

  if (loading) {
    return <p className="text-center text-xl">Loading report...</p>;
  }

  if (!data) {
    return <p className="text-center text-red-500">No data received</p>;
  }

  return (
  <>
    <Header />
    <div className="p-6 max-w-6xl mx-auto space-y-8 mt-20">
      <div ref={reportRef} className="space-y-8">
        <h1 className="text-4xl font-bold text-center bhoomi-text-gradient">
          🌍 Life Cycle Assessment Report
        </h1>

        {/* Grid of Key Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              label: "Process Type",
              value: data.data.Process_Type
            },
            {
              label: "Metal",
              value: data.data.Metal
            },
            {
              label: "Quantity",
              value: `${data.data.Quantity_kg} kg`
            },
            {
              label: "Energy / kg",
              value: `${data.data.Energy_MJ_per_kg} MJ`
            },
            {
              label: "Total Energy",
              value: `${data.data.Energy_MJ_total} MJ`
            },
            {
              label: "Transport",
              value: `${data.data.Transport_km} km (${data.data.Transport_Mode})`
            },
            {
              label: "Transport Emissions",
              value: `${data.data.Transport_emissions_kgCO2} kgCO₂`,
              valueClass: "text-red-600"
            },
            {
              label: "Process Emissions",
              value: `${data.data.Process_emissions_kgCO2} kgCO₂`,
              valueClass: "text-red-600"
            },
            {
              label: "Total Emissions",
              value: `${data.data.Total_emissions_kgCO2} kgCO₂`,
              valueClass: "text-red-600"
            },
            {
              label: "Water Use",
              value: `${data.data.Water_use_m3_per_ton} m³/ton`
            },
            {
              label: "Circularity",
              value: data.data.Circularity_option,
              valueClass: "text-green-600"
            },
            {
              label: "End of Life",
              value: data.data.End_of_Life,
              valueClass: "text-green-600"
            }
          ].map((item, idx) => (
            <div key={idx} className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg text-center">
              <p className="font-semibold text-muted-foreground">{item.label}</p>
              <p className={`text-lg font-bold ${item.valueClass || "text-primary"}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Images in grid */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-center bhoomi-text-gradient">📊 Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.charts &&
              data.charts.map((chart, idx) => (
                <div
                  key={idx}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg text-center"
                >
                  <img
                    src={`data:image/png;base64,${chart}`}
                    alt={`Chart ${idx + 1}`}
                    className="mx-auto rounded-lg"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Chart {idx + 1}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Download PDF Button */}
      <div className="text-center">
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bhoomi-btn-glow text-white rounded-xl shadow-lg transition"
        >
          📥 Download PDF
        </button>
      </div>
      <FloatingChatButton />
    </div>
  </>
  );
}
