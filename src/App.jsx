import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import HostelDetail from "./pages/HostelDetail";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import SafetyInfo from "./pages/SafetyInfo";
import CancellationPolicy from "./pages/CancellationPolicy";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerSignup from "./pages/OwnerSignup";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import AddProperty from "./pages/AddProperty";
import CollegeSearch from "./pages/CollegeSearch";


const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <AuthProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/hostel/:id" element={<HostelDetail />} />
                        <Route path="/college-search" element={<CollegeSearch />} />


                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/student/login" element={<StudentLogin />} />
                        <Route path="/student/signup" element={<StudentSignup />} />
                        <Route path="/owner/login" element={<OwnerLogin />} />
                        <Route path="/owner/signup" element={<OwnerSignup />} />

                        <Route path="/add-property" element={<AddProperty />} />

                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/safety" element={<SafetyInfo />} />
                        <Route path="/cancellation" element={<CancellationPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
