import { useQuery } from "@tanstack/react-query";
import { Gift, Home, Megaphone, ShoppingBag, XCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { getAds, getCoupons, type AdminAd, type AdminCoupon, useCouponRealtimeUpdates } from "@/lib/api";

type BottomNavItem = {
  label: string;
  to: string;
  icon: typeof Home;
  isActive: (pathname: string) => boolean;
};

const getItems = (isTelugu: boolean): BottomNavItem[] => [
  {
    label: isTelugu ? "హోమ్" : "Home",
    to: "/",
    icon: Home,
    isActive: (pathname) => pathname === "/",
  },
  {
    label: isTelugu ? "కూపన్లు" : "Coupons",
    to: "/coupons",
    icon: Gift,
    isActive: (pathname) => pathname.startsWith("/coupons"),
  },
  {
    label: isTelugu ? "ఆడ్స్" : "Ads",
    to: "/ads",
    icon: Megaphone,
    isActive: (pathname) => pathname.startsWith("/ads"),
  },
  {
    label: isTelugu ? "కార్ట్" : "Cart",
    to: "/cart",
    icon: ShoppingBag,
    isActive: (pathname) => pathname.startsWith("/cart") || pathname.startsWith("/checkout") || pathname.startsWith("/payment"),
  },
  {
    label: isTelugu ? "రద్దు" : "Cancel",
    to: "/cancel-order",
    icon: XCircle,
    isActive: (pathname) => pathname.startsWith("/cancel-order"),
  },
];

const isCouponActiveNow = (coupon: AdminCoupon) => {
  const now = Date.now();
  const startsAt = coupon.startsAt ? new Date(coupon.startsAt).getTime() : null;
  const endsAt = coupon.endsAt ? new Date(coupon.endsAt).getTime() : null;

  if (startsAt !== null && Number.isFinite(startsAt) && now < startsAt) {
    return false;
  }

  if (endsAt !== null && Number.isFinite(endsAt) && now > endsAt) {
    return false;
  }

  return coupon.isActive;
};

const isAdActiveNow = (ad: AdminAd) => {
  const now = Date.now();
  const startsAt = ad.startsAt ? new Date(ad.startsAt).getTime() : null;
  const endsAt = ad.endsAt ? new Date(ad.endsAt).getTime() : null;

  if (startsAt !== null && Number.isFinite(startsAt) && now < startsAt) {
    return false;
  }

  if (endsAt !== null && Number.isFinite(endsAt) && now > endsAt) {
    return false;
  }

  return ad.isActive;
};

export default function FloatingBottomNav() {
  const location = useLocation();
  const { cartCount } = useStore();
  const { language } = useLanguage();
  const isTelugu = language === "te";
  const items = getItems(isTelugu);
  useCouponRealtimeUpdates();
  const { data: coupons = [] } = useQuery({
    queryKey: ["storefront-coupons"],
    queryFn: getCoupons,
    staleTime: 0,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
  const { data: ads = [] } = useQuery({
    queryKey: ["bottom-nav-ads"],
    queryFn: getAds,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  const couponCount = coupons.filter(isCouponActiveNow).length;
  const adCount = ads.filter(isAdActiveNow).length;

  return (
    <div className="fixed bottom-3 left-1/2 z-50 w-[min(94vw,860px)] -translate-x-1/2 px-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)]">
      <nav className="grid grid-cols-5 items-center gap-1 rounded-[1.35rem] border border-[#d8e5d8] bg-white/95 p-1.5 shadow-[0_16px_38px_rgba(30,79,46,0.16)] backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(location.pathname);
          const showBadge =
            (item.to === "/cart" && cartCount > 0) ||
            (item.to === "/coupons" && couponCount > 0) ||
            (item.to === "/ads" && adCount > 0);
          const badgeValue =
            item.to === "/cart" ? cartCount : item.to === "/coupons" ? couponCount : adCount;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative inline-flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[10px] font-semibold transition md:text-xs ${
                active
                  ? "bg-[#2f7a43] !text-white shadow-[0_8px_20px_rgba(47,122,67,0.25)]"
                  : "text-[#486553] hover:bg-[#eff6ef]"
              } ${isTelugu ? "font-telugu" : ""}`}
              style={active ? { color: "#ffffff", WebkitTextFillColor: "#ffffff" } : undefined}
              aria-label={item.label}
            >
              <Icon className={`h-4 w-4 md:h-4.5 md:w-4.5 ${active ? "!text-white" : ""}`} />
              <span className={active ? "!text-white" : ""}>{item.label}</span>
              {showBadge ? (
                <span
                  className={`absolute right-2 top-1.5 inline-flex items-center justify-center p-0 text-[10px] font-black leading-none ${
                    active ? "text-white" : "text-[#486553]"
                  }`}
                >
                  {badgeValue > 99 ? "99+" : badgeValue}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
