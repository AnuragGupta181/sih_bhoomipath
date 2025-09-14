"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import a from "@/assets/1.png";
import b from "@/assets/2.png";
import c from "@/assets/3.png";

const steps = [
	{
		id: 1,
		title: "Step 1: Get Started",
		description:
			"Open the front page of BhoomiPath and click 'Get Started' to begin your Life Cycle Assessment journey.",
		img: a,
	},
	{
		id: 2,
		title: "Step 2: Login",
		description:
			"Sign in securely with your credentials to access your personalized dashboard and tools.",
		img: b,
	},
	{
		id: 3,
		title: "Step 3: Perform LCA with EcoSathi",
		description:
			"Use the EcoSathi chatbot to perform Life Cycle Assessment quickly, intuitively, and interactively.",
		img: c,
	},
];

const HowItWorks = () => {
	const [active, setActive] = useState<number>(0);

	return (
		<section className="py-20 bg-card/20 backdrop-blur-md">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-5xl font-bold mb-2">
						<span className="earthster-text-gradient">HOW IT WORKS</span>
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Follow these three simple steps to get started with BhoomiPath.
					</p>
				</div>

				<div className="max-w-4xl mx-auto">
					<motion.div className="relative w-full">
						<div className="flex w-full flex-col items-center justify-center gap-4">
							{steps.map((step, index) => (
								<motion.div
									key={step.id}
									className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg w-full"
									initial={{ height: "3.5rem" }}
									animate={{ height: active === index ? "22rem" : "3.5rem" }}
									transition={{ duration: 0.35, ease: "easeInOut" }}
									onClick={() => setActive(index)}
									onMouseEnter={() => setActive(index)}
									onMouseLeave={() => setActive(active)}
								>
									<AnimatePresence>
										{active === index && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
											/>
										)}
									</AnimatePresence>

									<div className="relative flex h-full w-full flex-col md:flex-row">
										<div className={`w-full md:w-1/2 p-3 md:p-6 h-44 md:h-auto flex items-center justify-center transition-all duration-300 ${active === index ? 'ring-4 ring-primary/25 rounded-xl' : 'rounded-lg'}`}>
											{/* padded inner bg to prevent image cropping */}
											<div className="w-full h-full bg-card/60 rounded-md overflow-hidden flex items-center justify-center p-1">
												<img
													src={step.img}
													alt={step.title}
													className="max-w-full max-h-full object-contain rounded-md"
												/>
											</div>
										</div>

										<div className="p-4 md:p-6 flex flex-col justify-between w-full md:w-1/2">
											<div>
												<span className="inline-block text-sm font-semibold text-green-700">
													STEP {step.id}
												</span>
												<h3 className="text-xl md:text-2xl font-bold mt-2 text-amber-900">
													{step.title}
												</h3>
												<p className="text-muted-foreground mt-2">
													{step.description}
												</p>
											</div>

											<div className="mt-4 md:mt-8">
												<button className="earthster-btn-glow px-5 py-2 rounded-full text-sm font-semibold text-orange-100">
													{step.id === 1
														? "Open Front Page"
														: step.id === 2
														? "Login"
														: "Start LCA with EcoSathi"}
												</button>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
