import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import EcoSathi from "./components/EcoSathi";
import Damage from "./components/Damage";
import Class from "./components/Class";
import Report from "./components/Report"
import Contact from './components/ContactSection'
import Loginaloo from './components/loginaloo'



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ecosathi" element={<EcoSathi />} />
          <Route path="/damage" element={<Damage />} />
          <Route path="/class" element={<Class />} />
          <Route path="/report" element={<Report />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loginaloo" element={<Loginaloo />} />





          <Route path="/signin" element={<SignIn />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
