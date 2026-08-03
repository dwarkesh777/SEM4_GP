import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// --- Lazy-loaded pages (code splitting) ---
// Each page is bundled into its own JS chunk, downloaded only when navigated to.
const Index             = lazy(() => import("./pages/Index"));
const HostelDetail      = lazy(() => import("./pages/HostelDetail"));
const AboutUs           = lazy(() => import("./pages/AboutUs"));
const HelpCenter        = lazy(() => import("./pages/HelpCenter"));
const SafetyInfo        = lazy(() => import("./pages/SafetyInfo"));
const CancellationPolicy= lazy(() => import("./pages/CancellationPolicy"));
const TermsOfService    = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy     = lazy(() => import("./pages/PrivacyPolicy"));
const Login             = lazy(() => import("./pages/Login"));
const Signup            = lazy(() => import("./pages/Signup"));
const StudentLogin      = lazy(() => import("./pages/StudentLogin"));
const StudentSignup     = lazy(() => import("./pages/StudentSignup"));
const OwnerLogin        = lazy(() => import("./pages/OwnerLogin"));
const OwnerSignup       = lazy(() => import("./pages/OwnerSignup"));
const UserDashboard     = lazy(() => import("./pages/UserDashboard"));
const BookingSuccess    = lazy(() => import("./pages/BookingSuccess"));
const SupportPage       = lazy(() => import("./pages/SupportPage"));
const NotFound          = lazy(() => import("./pages/NotFound"));
const AddProperty       = lazy(() => import("./pages/AddProperty"));
const EditProperty      = lazy(() => import("./pages/EditProperty"));
const CollegeSearch     = lazy(() => import("./pages/CollegeSearch"));
const DeveloperPage     = lazy(() => import("./pages/DeveloperPage"));
const DeveloperLogin    = lazy(() => import("./pages/DeveloperLogin"));
const DeveloperSignup   = lazy(() => import("./pages/DeveloperSignup"));
const DeveloperDashboard= lazy(() => import("./pages/DeveloperDashboard"));
const UserSignupPage    = lazy(() => import("./pages/UserSignupPage"));
const OwnerSignupPage   = lazy(() => import("./pages/OwnerSignupPage"));
const AdminLogin        = lazy(() => import("./pages/AdminLogin"));
const AdminSignup       = lazy(() => import("./pages/AdminSignup"));
const AdminDashboard    = lazy(() => import("./pages/AdminDashboard"));
const AdminPropertyDetail = lazy(() => import("./pages/AdminPropertyDetail"));

// --- Query client with caching tuned for a property-listings app ---
// staleTime: data fetched once is served from cache for 3 min — no re-fetch on navigation.
// gcTime: unused cache entries are kept for 10 min before GC.
// retry: 1 — fail fast instead of the default 3 retries.
// refetchOnWindowFocus: false — avoids surprise re-fetches when switching tabs.
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Minimal full-screen spinner shown while a lazy page chunk is loading.
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
);

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <AuthProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/hostel/:id" element={<HostelDetail />} />
                            <Route path="/college-search" element={<CollegeSearch />} />
                            <Route path="/developer" element={<DeveloperPage />} />
                            <Route path="/developer/login" element={<DeveloperLogin />} />
                            <Route path="/developer/signup" element={<DeveloperSignup />} />
                            <Route path="/developer/dashboard" element={<DeveloperDashboard />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/signup/user" element={<UserSignupPage />} />
                            <Route path="/signup/owner" element={<OwnerSignupPage />} />
                            <Route path="/student/login" element={<StudentLogin />} />
                            <Route path="/student/signup" element={<StudentSignup />} />
                            <Route path="/owner/login" element={<OwnerLogin />} />
                            <Route path="/owner/signup" element={<OwnerSignup />} />

                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/signup" element={<AdminSignup />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/property/:id" element={<AdminPropertyDetail />} />

                            <Route path="/add-property" element={<AddProperty />} />
                            <Route path="/edit-property/:id" element={<EditProperty />} />

                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/help" element={<HelpCenter />} />
                            <Route path="/support" element={<SupportPage />} />
                            <Route path="/safety" element={<SafetyInfo />} />
                            <Route path="/cancellation" element={<CancellationPolicy />} />
                            <Route path="/terms" element={<TermsOfService />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/dashboard" element={<UserDashboard />} />
                            <Route path="/booking-success" element={<BookingSuccess />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;

