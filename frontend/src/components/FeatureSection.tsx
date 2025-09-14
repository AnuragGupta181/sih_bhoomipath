import { Zap, Users, Leaf } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-16 h-16 text-primary mb-6" />,
    title: "Life Cycle Assessment made",
    highlight: "cost-efficient",
    subtitle: "and",
    highlightEnd: "intuitive"
  },
  {
    icon: <Users className="w-16 h-16 text-primary mb-6" />,
    title: "Connected to any",
    highlight: "department and IT systems"
  },
  {
    icon: <Leaf className="w-16 h-16 text-primary mb-6" />,
    title: "Collaborate with",
    highlight: "customers",
    subtitle: "to deliver greener products"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center animate-fade-in earthster-card rounded-2xl p-8 hover:scale-105 transition-transform duration-300"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                {feature.title} <span className="earthster-text-gradient">{feature.highlight}</span>
                {feature.subtitle && (
                  <>
                    {" "}{feature.subtitle}
                    {feature.highlightEnd && <span className="earthster-text-gradient"> {feature.highlightEnd}</span>}
                  </>
                )}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;