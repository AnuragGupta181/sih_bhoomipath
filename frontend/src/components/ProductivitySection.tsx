import React, { Suspense, lazy } from "react";
import hero from "@/assets/hero.jpg";
import mountainBg from "@/assets/mountain-bg.jpg";
// import { World } from "./ui/globe";

const World = lazy(() => import("./ui/globe").then((m) => ({ default: m.World })));

const ProductivitySection = () => {


  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];


  const features = [
    "Scale through uploading supplier lists, product lists, or Bills of Materials",
    "Versatility through parameter-based LCA, to do LCAs of whole product lines",
    "Collaborative models that measure your product's whole life cycle (supply chain, manufacturing, logistics, usage, end of life, ...)",
    "Access to reputed LCA databases and methods",
    "Compare your products with industry benchmarks, each other, or even competitors",
    "Faster third-party verification inside the app"
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-primary text-lg font-semibold tracking-wider uppercase">
                FEATURES
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                BOOST YOUR PRODUCTIVITY WITH{" "}
                <span className="earthster-text-gradient">BHOOMIPATH</span>
              </h2>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visualization */}
     
          <div className="relative animate-scale-in">
            <div className="earthster-card rounded-2xl p-8 relative overflow-hidden">
              {/* Mock interface elements */}
              <img src={hero} alt="mining" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductivitySection;