import { useState, useEffect } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import videoHeader from "@/assets/VideoHeader_1080p.mp4";

declare global {
  interface Window {
    google: any;
  }
}

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      alert("User already logged in!");
      navigate("/"); // redirect if already logged in
    }
  }, [navigate]);

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: "1042368150095-tnmfmm3avtsnqdemg2k1h61i2o84ls2d.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response: any) => {
    const userObject = JSON.parse(atob(response.credential.split('.')[1]));
    console.log("User Info:", userObject);

    // Save user's name and picture in localStorage
    localStorage.setItem("user", JSON.stringify({
      name: userObject.name,
      image: userObject.picture,
    }));

    navigate("/"); // redirect after login
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if already logged in
    if (localStorage.getItem("user")) {
      alert("User already logged in!");
      return;
    }

    if (!isLoaded) return;
    
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Save email in localStorage (optional)
        localStorage.setItem("user", JSON.stringify({
          email: formData.email,
          name: formData.email.split("@")[0],
          image: "", // default empty for manual login
        }));

        navigate("/ecosathi");
      } else {
        setError("Sign in failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />

      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoHeader} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="min-h-screen flex flex-col lg:flex-row pt-16 lg:pt-20 relative z-10">
        {/* Left Side - Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-8 lg:py-0">
          <div className="max-w-lg mx-auto lg:mx-0">
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              <p className="text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 lg:mb-4">
                LIFE CYCLE ASSESSMENT AT SCALE
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 lg:mb-8 leading-tight drop-shadow-lg">
                Understand and share footprints in minutes
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="text-center lg:text-left">
                <h3 className="text-primary font-semibold text-base lg:text-lg mb-2 lg:mb-4">CONNECTED</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed drop-shadow-md">
                  Real <strong>compatible data</strong> from your suppliers, and <strong>share your own</strong>.
                </p>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-primary font-semibold text-base lg:text-lg mb-2 lg:mb-4">ITERATIVE</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed drop-shadow-md">
                  See <strong>results</strong> as you input the data.
                </p>
              </div>

              <div className="text-center lg:text-left sm:col-span-2 lg:col-span-1">
                <h3 className="text-primary font-semibold text-base lg:text-lg mb-2 lg:mb-4">INTUITIVE</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed drop-shadow-md">
                  Build your model faster, get <strong>results 100x faster.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-full lg:max-w-md flex flex-col justify-center px-4 sm:px-6 lg:px-8 mx-4 sm:mx-6 lg:mx-8 mb-8 lg:mb-0 bg-card/60 backdrop-blur-md rounded-2xl border border-border/30 shadow-lg">
          <div className="w-full max-w-sm mx-auto py-6 lg:py-8">
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="earthster-input w-full"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="earthster-input w-full pr-12"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
                  Remember me
                </label>
              </div>

              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              <Button
                type="submit"
                disabled={isLoading}
                className="earthster-btn-glow w-full py-2 lg:py-3 text-base lg:text-lg font-semibold"
              >
                {isLoading ? "Signing In..." : "SIGN IN"}
              </Button>

              <div id="googleButton"></div>

              <div className="space-y-2 lg:space-y-3 text-center text-xs sm:text-sm">
                <p className="text-foreground">
                  Don't have an account? <a href="/register" className="text-primary hover:underline">Register instead</a>
                </p>
                <p>
                  <a href="/forgot-password" className="text-foreground hover:text-primary">Forgot your password?</a>
                </p>
                <p>
                  <a href="/confirmation-instructions" className="text-foreground hover:text-primary">Didn't receive confirmation instructions?</a>
                </p>
                <p>
                  <a href="/unlock-instructions" className="text-foreground hover:text-primary">Didn't receive unlock instructions?</a>
                </p>
                <p>
                  <a href="/" className="text-foreground hover:text-primary">← Back to start</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
