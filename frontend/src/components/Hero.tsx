import { Button } from "@/components/ui/button";
import earthHero from "@/assets/earth-hero.jpg";
import ColourfulText from "./ui/colourful-text";
import { VideoText } from "./magicui/video-text";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center earthster-hero-bg overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={earthHero} 
          alt="Earth from space" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
  {/* group that can wrap on small screens, but is non-wrapping on lg+ */}
  <span className="lg:whitespace-nowrap">
    <span className="block lg:inline">Calculate and</span>{" "}
    <span className="block lg:inline">Communicate</span>
  </span>{" "}
  {/* allow this to wrap naturally if needed, or add lg:whitespace-nowrap to pin it on lg+ */}
  <span className="earthster-text-gradient">Environmental Sustainability</span>{" "}
  <span className="whitespace-nowrap">of ALL your Products</span>
</h1>


          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The fastest, most scalable and most intuitive way to do Life Cycle Assessment
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="earthster-btn-glow text-lg px-8 py-6 rounded-full"
              asChild
            >
              <a href="/ecosathi">EcoSathi 🤖</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-primary/50 hover:bg-primary/10"
              asChild
            >
              <a href="/signin">Get Full Platform</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-primary/60 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-primary/80 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default Hero;