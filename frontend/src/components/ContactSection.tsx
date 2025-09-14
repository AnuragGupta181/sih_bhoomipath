import { useState } from "react";
import { Button } from "@/components/ui/button";
import mountainBg from "@/assets/mountain-bg.jpg";
import Header from "./Header";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
    businessEmail: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <>
    <Header/>
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={mountainBg} 
          alt="Mountain landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="earthster-card rounded-2xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Start Your Journey Towards{" "}
                <span className="earthster-text-gradient">Sustainable Innovation</span> Today
              </h2>
              <p className="text-primary text-lg font-medium">
                Book a meeting now in the form below!
              </p>
            </div>

            <form 
            
            action="mailto:anuraggupta11421@gmail.com"
              method="POST"
              encType="text/plain"
              // onSubmit={handleSubmit} 
              className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="earthster-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="earthster-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  className="earthster-input"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="earthster-input"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  required
                  className="earthster-input"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                />
              </div>

              <Button 
                type="submit" 
                className="earthster-btn-glow w-full py-4 text-lg font-semibold"
              >
                Submit
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <span className="text-red-500">🧡</span>{" "}
                <span className="text-red-500 underline cursor-pointer">
                  Create your own free forms
                </span>{" "}
                to generate leads from your website.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
    
  );
};

export default ContactSection;