import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import SkeletonCard from "@/components/SkeletonCard";
import SiteLayout from "@/components/SiteLayout";
import { StoreProvider } from "@/components/StoreProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/LanguageProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/content/translations";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminAdsPage = lazy(() => import("./pages/AdminAdsPage"));
const AdminCouponsPage = lazy(() => import("./pages/AdminCouponsPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CouponsPage = lazy(() => import("./pages/CouponsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const AdsPage = lazy(() => import("./pages/AdsPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

const queryClient = new QueryClient();

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (id: number) => void;
};



const RouteFallback = () => {
  const { language } = useLanguage();
  const isTelugu = language === "te";

  return (
    <main className="bg-[var(--color-bg-primary)]">
      <SectionWrapper disableAnimation className="min-h-[60vh]" contentClassName="space-y-10">
        <SectionTitle
          eyebrow={isTelugu ? "లోడ్ అవుతోంది" : "Loading"}
          title={isTelugu ? "SP Traditional Pickles పేజీ సిద్ధమవుతోంది" : "Preparing SP Traditional Pickles"}
          subtitle={
            isTelugu
              ? "పేజీ త్వరలో కనిపిస్తుంది. ఉత్పత్తుల విభాగాలు మరియు చిత్రాలు లోడ్ అవుతున్నాయి."
              : "The page is on the way. Product sections and visuals are loading now."
          }
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </SectionWrapper>
    </main>
  );
};

const App = () => {
  useEffect(() => {
    const idleWindow = window as IdleWindow;
    const warmRoutes = () => {
      // Warm critical route chunks so navigation feels instant after first load.
      void Promise.all([
        import("./pages/ProductsPage"),
        import("./pages/CartPage"),
        import("./pages/CheckoutPage"),
        import("./pages/PaymentPage"),
        import("./pages/OrderSuccessPage"),
      ]);
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(warmRoutes);
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(warmRoutes, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StoreProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage initialFilter="all" />} />
                <Route path="/products/pickles" element={<ProductsPage initialFilter="pickles" />} />
                <Route
                  path="/products/pickles/salted"
                  element={<ProductsPage initialFilter="salted-pickles" />}
                />
                <Route
                  path="/products/pickles/tempered"
                  element={<ProductsPage initialFilter="tempered-pickles" />}
                />
                <Route path="/products/podulu" element={<ProductsPage initialFilter="powders" />} />
                <Route path="/products/fryums" element={<ProductsPage initialFilter="fryums" />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/coupons" element={<CouponsPage />} />
                <Route path="/ads" element={<AdsPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/refund" element={<RefundPolicyPage />} />
              </Route>
              <Route path="/pickles" element={<Navigate to="/products/pickles" replace />} />
              <Route path="/powders" element={<Navigate to="/products/podulu" replace />} />
              <Route path="/podulu" element={<Navigate to="/products/podulu" replace />} />
              <Route path="/snacks" element={<Navigate to="/products/fryums" replace />} />
              <Route path="/fryums" element={<Navigate to="/products/fryums" replace />} />
              <Route path="/special" element={<Navigate to="/products" replace />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/ads" element={<AdminAdsPage />} />
              <Route path="/admin/coupons" element={<AdminCouponsPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </StoreProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
