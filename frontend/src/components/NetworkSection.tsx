import earthHero from "@/assets/earth-hero.jpg";
import networkBg from "@/assets/network-bg.jpg";
import hero from "@/assets/lca.png";

const NetworkSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={networkBg} 
          alt="Network visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Cost Reduction Highlight */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Bring the cost per LCA <span className="earthster-text-gradient">down to 10$/LCA</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              *based on customer case study, exact amount may vary
            </p>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="earthster-card rounded-2xl p-8 relative overflow-hidden flex justify-center items-center w-max mx-auto my-11">
          {/* Mock interface elements */}
          <img src={hero} alt="mining" className="w-80 h-64 rounded-md object-cover" />
        </div>

        {/* Description Text */}
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <p className="text-lg md:text-xl text-primary mb-6 font-semibold">
            With Earthster's approach to scale you can have LCA results for all your 
            products in the time it takes you to do one LCA in other software.
          </p>
          <p className="text-muted-foreground">
            And all in a celebrated UX that helps users answer important questions, 
            regardless of their background.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;