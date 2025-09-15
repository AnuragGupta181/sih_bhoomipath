import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, MessageCircle, Wrench, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import fullLogo from "@/assets/nfulllogo.png";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; image: string } | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Navbar hide/show on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
            <img src={fullLogo} alt="BhoomiPath" className="h-11" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-foreground hover:text-primary font-bold transition-colors">
            Home
          </a>

          {/* Services Dropdown (click only) */}
          <div className="relative">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex items-center space-x-1 text-foreground hover:text-primary font-bold transition-colors"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  isServicesOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isServicesOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg py-2 z-50"
                onMouseLeave={() => setIsServicesOpen(false)} // optional: closes if you leave whole dropdown
              >
                <a
                  href="/ecosathi"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Chat Bot
                </a>
                <a
                  href="/damage"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition"
                >
                  <Wrench className="w-4 h-4 mr-2" /> Check Damage
                </a>
                <a
                  href="/class"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition"
                >
                  <Brain className="w-4 h-4 mr-2" /> Predict Class
                </a>
              </div>
            )}
          </div>

          <a href="/news" className="text-foreground hover:text-primary font-bold transition-colors">
            News
          </a>
          <a
            href="contact"
            className="text-foreground hover:text-primary font-bold transition-colors"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Contact
          </a>
        </nav>

        {/* User + Mobile Menu */}
        <div className="flex items-center space-x-4 relative">
          {!user ? (
            <>
              <Button variant="outline" className="hidden md:inline-flex" asChild>
                <a href="/signin">LOG IN</a>
              </Button>
              <Button className="earthster-btn-glow">
                <a href="/ecosathi">Get Started</a>
              </Button>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2 bg-card/60 backdrop-blur-md px-3 py-1 rounded-lg hover:bg-card/80 transition"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user.image || "https://via.placeholder.com/30"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-foreground hidden md:inline">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-foreground" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border px-6 py-4 flex flex-col space-y-4">
          <a href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </a>

          {/* Mobile Services Dropdown */}
          <div>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex items-center justify-between w-full text-left text-foreground hover:text-primary transition-colors"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  isServicesOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isServicesOpen && (
              <div className="mt-2 flex flex-col space-y-2 pl-4">
                <a href="/ecosathi" className="flex items-center text-sm text-foreground hover:text-primary">
                  <MessageCircle className="w-4 h-4 mr-2" /> Chat Bot
                </a>
                <a href="/damage" className="flex items-center text-sm text-foreground hover:text-primary">
                  <Wrench className="w-4 h-4 mr-2" /> Check Damage
                </a>
                <a href="/class" className="flex items-center text-sm text-foreground hover:text-primary">
                  <Brain className="w-4 h-4 mr-2" /> Predict Class
                </a>
              </div>
            )}
          </div>

          <a href="/news" className="text-foreground hover:text-primary transition-colors">
            News
          </a>
          <a
            href="contact"
            className="text-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Contact
          </a>

          {!user ? (
            <>
              <Button variant="outline" asChild>
                <a href="/signin">LOG IN</a>
              </Button>
              <Button className="earthster-btn-glow">
                <a href="/ecosathi">Get Started</a>
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <img
                  src={user.image || "https://via.placeholder.com/30"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-foreground">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
