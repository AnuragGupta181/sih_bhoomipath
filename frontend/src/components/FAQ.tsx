import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Can I automate LCAs with BhoomiPath?",
    answer: "Yes, BhoomiPath allows you to automate many aspects of LCA calculations through our advanced parameter-based system and integration capabilities."
  },
  {
    question: "What standards do you comply with?",
    answer: "BhoomiPath complies with ISO 14040/14044 standards and integrates with major LCA databases and methodologies used internationally."
  },
  {
    question: "What background data do you include?",
    answer: "We provide access to comprehensive environmental databases including ecoinvent, GaBi, and other reputed LCA databases with regular updates."
  },
  {
    question: "Do I need a separate Ecoinvent license?",
    answer: "No, BhoomiPath includes access to necessary background databases as part of our service, eliminating the need for separate licensing."
  },
  {
    question: "Can you use other data?",
    answer: "Yes, you can import your own data, supplier data, and integrate with various data sources to customize your LCA calculations."
  },
  {
    question: "Can I model logistics / product use / supply chains?",
    answer: "Absolutely. BhoomiPath supports comprehensive life cycle modeling including supply chain, logistics, product use phase, and end-of-life scenarios."
  },
  {
    question: "What impact categories do you include?",
    answer: "We include all major impact categories such as climate change, acidification, eutrophication, toxicity, land use, water use, and more."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto my-10 px-7 max-w-4xl">
        <div>       
           <h2 className="text-3xl text-center  md:text-5xl font-bold mb-2">
						<span className="earthster-text-gradient">FAQ's</span>
					</h2>
        <div className="space-y-4">
          </div>

          
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="earthster-card rounded-xl overflow-hidden animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-foreground">{faq.question}</span>
                <div className="text-primary">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 animate-fade-in">
                  <div className="border-t border-border pt-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;