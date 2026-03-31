import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
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
import { content } from "@/content/translations";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));

const queryClient = new QueryClient();



const RouteFallback = () => (
  <main className="bg-[#fffaf4]">
    <SectionWrapper disableAnimation className="min-h-[60vh]" contentClassName="space-y-10">
      <SectionTitle
        eyebrow="Loading"
        title="Preparing SP Traditional Pickles"
        subtitle="The page is on the way. Product sections and visuals are loading now."
      />
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </SectionWrapper>
  </main>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <StoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage initialFilter="all" />} />
                <Route path="/products/pickles" element={<ProductsPage initialFilter="pickles" />} />
                <Route path="/products/powders" element={<ProductsPage initialFilter="powders" />} />
                <Route path="/products/snacks" element={<ProductsPage initialFilter="snacks" />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>
              <Route path="/pickles" element={<Navigate to="/products/pickles" replace />} />
              <Route path="/powders" element={<Navigate to="/products/powders" replace />} />
              <Route path="/snacks" element={<Navigate to="/products/snacks" replace />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
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

export default App;
