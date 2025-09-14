import { Youtube, Linkedin, Mail } from "lucide-react";
import fullLogo from "@/assets/fulllogo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img 
                src={fullLogo} 
                alt="BhoomiPath" 
                className="h-8 w-auto"
              />
            </div>
            
            <p className="text-muted-foreground max-w-md">
              BhoomiPath is a tech company specializing in LCA technologies, 
              databases and projects, founded by Environmental scientists
            </p>
          </div>

          {/* Right Column - Navigation and Social */}
          <div className="space-y-8">
            {/* Navigation Links */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <a href="/" className="block text-foreground hover:text-primary transition-colors">
                  Home
                </a>
                <a href="#blog" className="block text-foreground hover:text-primary transition-colors">
                  Blog
                </a>
                <a href="/ecosathi" className="block text-foreground hover:text-primary transition-colors">
                  Services
                </a>
              </div>
              
              <div className="space-y-4">
                <a href="#terms" className="block text-foreground hover:text-primary transition-colors">
                  Terms and conditions
                </a>
                <a href="#privacy" className="block text-foreground hover:text-primary transition-colors">
                  Privacy policy
                </a>
                <a 
                  href="/#contact" 
                  className="block text-foreground hover:text-primary transition-colors"
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-primary-foreground" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-primary-foreground" />
              </a>
              <a 
                href="mailto:anuraggupta11421@gmail.com" 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;