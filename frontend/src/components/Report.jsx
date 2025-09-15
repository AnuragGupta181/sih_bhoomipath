import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';


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

  return (<>
  
    <Header/>
    <div className="p-6 max-w-6xl mx-auto space-y-8 mt-20">
      <div ref={reportRef} className="space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          🌍 Life Cycle Assessment Report
        </h1>

        {/* Grid of Key Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Process Type</p>
            <p className="text-lg text-blue-700">{data.data.Process_Type}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Metal</p>
            <p className="text-lg text-blue-700">{data.data.Metal}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Quantity</p>
            <p className="text-lg text-blue-700">{data.data.Quantity_kg} kg</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Energy / kg</p>
            <p className="text-lg text-blue-700">{data.data.Energy_MJ_per_kg} MJ</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Total Energy</p>
            <p className="text-lg text-blue-700">{data.data.Energy_MJ_total} MJ</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Transport</p>
            <p className="text-lg text-blue-700">
              {data.data.Transport_km} km ({data.data.Transport_Mode})
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Transport Emissions</p>
            <p className="text-lg text-red-600">
              {data.data.Transport_emissions_kgCO2} kgCO₂
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Process Emissions</p>
            <p className="text-lg text-red-600">
              {data.data.Process_emissions_kgCO2} kgCO₂
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Total Emissions</p>
            <p className="text-lg text-red-600">
              {data.data.Total_emissions_kgCO2} kgCO₂
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Water Use</p>
            <p className="text-lg text-blue-700">
              {data.data.Water_use_m3_per_ton} m³/ton
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">Circularity</p>
            <p className="text-lg text-green-600">{data.data.Circularity_option}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow text-center">
            <p className="font-semibold text-gray-600">End of Life</p>
            <p className="text-lg text-green-600">{data.data.End_of_Life}</p>
          </div>
        </div>

        {/* Chart Images in grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">📊 Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.charts &&
              data.charts.map((chart, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl shadow text-center"
                >
                  <img
                    src={`data:image/png;base64,${chart}`}
                    alt={`Chart ${idx + 1}`}
                    className="mx-auto rounded-lg"
                  />
                  <p className="mt-2 text-sm text-gray-600">
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
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
        >
          📥 Download PDF
        </button>
      </div>
    </div>
  </>
  );
}
