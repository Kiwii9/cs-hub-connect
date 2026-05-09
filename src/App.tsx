import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import MajorPage from "./pages/MajorPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import UploadPage from "./pages/UploadPage";
import MyUploadsPage from "./pages/MyUploadsPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import RoadmapPage from "./pages/RoadmapPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/course/:id" element={<CoursePage />} />
              <Route path="/major/:college/:major" element={<MajorPage />} />
              <Route path="/resource/:id" element={<ResourceDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/my-uploads" element={<MyUploadsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
