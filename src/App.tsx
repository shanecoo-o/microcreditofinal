import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./app/auth/AuthContext";
import { RequireAuth, RequireRole } from "./app/auth/guards";
import { AppThemeProvider } from "./app/components/ThemeProvider";
import AppLayout from "./app/layout/AppLayout";

const Login = lazy(() => import("./app/pages/Login"));
const Register = lazy(() => import("./app/pages/Register"));
const ForgotPassword = lazy(() => import("./app/pages/ForgotPassword"));
const UserDashboard = lazy(() => import("./app/pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./app/pages/AdminDashboard"));
const Users = lazy(() => import("./app/pages/Users"));
const Roles = lazy(() => import("./app/pages/Roles"));
const Permissions = lazy(() => import("./app/pages/Permissions"));
const Transactions = lazy(() => import("./app/pages/Transactions"));
const Wallet = lazy(() => import("./app/pages/Wallet"));
const Notifications = lazy(() => import("./app/pages/Notifications"));
const Audit = lazy(() => import("./app/pages/Audit"));
const Reports = lazy(() => import("./app/pages/Reports"));
const Settings = lazy(() => import("./app/pages/Settings"));
const Profile = lazy(() => import("./app/pages/Profile"));
const LoanRequests = lazy(() => import("./app/pages/LoanRequests"));
const LoanRequestDetail = lazy(() => import("./app/pages/LoanRequestDetail"));
const Loans = lazy(() => import("./app/pages/Loans"));
const LoanDetail = lazy(() => import("./app/pages/LoanDetail"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

const Fallback = () => <div className="p-6 text-muted-foreground">A carregar...</div>;

const App = () => (
  <HelmetProvider>
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<Fallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />

                  <Route path="/app/login" element={<Login />} />
                  <Route path="/app/register" element={<Register />} />
                  <Route path="/app/forgot-password" element={<ForgotPassword />} />
                  <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

                  <Route element={<RequireAuth />}>
                    <Route path="/app" element={<AppLayout />}>
                      <Route path="dashboard" element={<UserDashboard />} />
                      <Route path="wallet" element={<Wallet />} />
                      <Route path="transactions" element={<Transactions />} />
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="loans" element={<Loans />} />
                      <Route path="loans/:processo" element={<LoanDetail />} />

                      <Route element={<RequireRole roles={["ADMIN", "MANAGER"]} />}>
                        <Route path="admin/dashboard" element={<AdminDashboard />} />
                        <Route path="admin/loan-requests" element={<LoanRequests />} />
                        <Route path="admin/loan-requests/:processo" element={<LoanRequestDetail />} />
                        <Route path="admin/reports" element={<Reports />} />
                        <Route path="admin/audit" element={<Audit />} />
                      </Route>
                      <Route element={<RequireRole roles={["ADMIN", "MANAGER", "SUPPORT"]} />}>
                        <Route path="admin/users" element={<Users />} />
                      </Route>
                      <Route element={<RequireRole roles={["ADMIN"]} />}>
                        <Route path="admin/roles" element={<Roles />} />
                        <Route path="admin/permissions" element={<Permissions />} />
                        <Route path="admin/settings" element={<Settings />} />
                      </Route>
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  </HelmetProvider>
);

export default App;
