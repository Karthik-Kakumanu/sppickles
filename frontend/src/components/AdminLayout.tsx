/**
 * Admin Layout Component
 * Header layout for admin pages
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  MonitorSmartphone,
  Package,
  ShoppingCart,
  TicketPercent,
  X,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { getAdminSessions, getOrders } from "@/lib/api";

const ADMIN_ORDER_SOUND_UNLOCK_EVENT = "pointerdown";
const ADMIN_ORDER_SOUND_STORAGE_KEY = "sp-admin-order-sound-enabled";
const ADMIN_NEW_ORDER_EVENT = "sp-admin-new-order";
const ADMIN_ORDER_RING_COUNT = 1;
const ADMIN_ORDER_RING_GAP_SECONDS = 0.24;
const ADMIN_ORDER_ALERT_REPEAT_COUNT = 3;
const ADMIN_ORDER_ALERT_REPEAT_GAP_SECONDS = 0.35;

const showBrowserOrderNotification = (count: number) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const notificationTitle = count > 1 ? `${count} new orders` : "New order received";
  const notificationBody = count > 1
    ? "New orders were placed. Open admin dashboard to review them."
    : "A new order was placed. Open admin dashboard to review it.";

  try {
    const notification = new Notification(notificationTitle, {
      body: notificationBody,
      tag: "sp-admin-new-order",
      silent: false,
    });

    setTimeout(() => {
      notification.close();
    }, 7000);
  } catch {
    // Ignore notification API failures.
  }
};

const playRingOnce = (audioContext: AudioContext, startTime: number) => {
  const oscillatorOne = audioContext.createOscillator();
  const oscillatorTwo = audioContext.createOscillator();
  const oscillatorThree = audioContext.createOscillator();
  const mixGain = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  const gainNode = audioContext.createGain();

  oscillatorOne.type = "triangle";
  oscillatorTwo.type = "sawtooth";
  oscillatorThree.type = "sine";

  oscillatorOne.frequency.value = 987.77;
  oscillatorTwo.frequency.value = 1318.51;
  oscillatorThree.frequency.value = 659.25;

  mixGain.gain.value = 0.72;
  compressor.threshold.value = -24;
  compressor.knee.value = 22;
  compressor.ratio.value = 13;
  compressor.attack.value = 0.002;
  compressor.release.value = 0.18;

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.34, startTime + 0.018);
  gainNode.gain.exponentialRampToValueAtTime(0.18, startTime + 0.22);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.62);

  oscillatorOne.connect(mixGain);
  oscillatorTwo.connect(mixGain);
  oscillatorThree.connect(mixGain);
  mixGain.connect(gainNode);
  gainNode.connect(compressor);
  compressor.connect(audioContext.destination);

  oscillatorOne.start(startTime);
  oscillatorTwo.start(startTime);
  oscillatorThree.start(startTime);
  oscillatorOne.stop(startTime + 0.62);
  oscillatorTwo.stop(startTime + 0.62);
  oscillatorThree.stop(startTime + 0.62);

  const cleanupDelayMs = Math.max(0, (startTime - audioContext.currentTime + 0.9) * 1000);

  setTimeout(() => {
    oscillatorOne.disconnect();
    oscillatorTwo.disconnect();
    oscillatorThree.disconnect();
    mixGain.disconnect();
    compressor.disconnect();
    gainNode.disconnect();
  }, cleanupDelayMs);
};

const playNewOrderTone = (audioContext: AudioContext, baseTime = audioContext.currentTime + 0.02) => {

  for (let ringIndex = 0; ringIndex < ADMIN_ORDER_RING_COUNT; ringIndex += 1) {
    playRingOnce(audioContext, baseTime + ringIndex * ADMIN_ORDER_RING_GAP_SECONDS);
  }
};

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Ads", href: "/admin/ads", icon: Megaphone },
  { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
];

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin, isAdminAuthenticated } = useStore();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const deviceMenuRef = useRef<HTMLDivElement | null>(null);
  const orderIdsRef = useRef<Set<string>>(new Set());
  const hasSeededOrdersRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const orderSoundUnlockedRef = useRef(false);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ensureAudioContextReady = useCallback(async () => {
    const AudioEngine =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioEngine) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioEngine();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const { data: deviceResponse, refetch: refetchAdminSessions } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: getAdminSessions,
    enabled: isAdminAuthenticated,
    staleTime: 10_000,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const { data: orderResponse, isSuccess: areOrdersReady } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: isAdminAuthenticated,
    staleTime: 0,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const sessions = deviceResponse?.sessions ?? [];
  const adminOrders = orderResponse ?? [];

  const triggerOrderAlert = useCallback((newOrderCount: number) => {
    showBrowserOrderNotification(newOrderCount);

    const isStoredEnabled = window.localStorage.getItem(ADMIN_ORDER_SOUND_STORAGE_KEY) === "true";

    if (
      !orderSoundUnlockedRef.current &&
      !isStoredEnabled
    ) {
      return;
    }

    void ensureAudioContextReady()
      .then((audioContext) => {
        if (audioContext) {
          const initialStartTime = audioContext.currentTime + 0.02;

          for (let repeatIndex = 0; repeatIndex < ADMIN_ORDER_ALERT_REPEAT_COUNT; repeatIndex += 1) {
            playNewOrderTone(
              audioContext,
              initialStartTime + repeatIndex * ADMIN_ORDER_ALERT_REPEAT_GAP_SECONDS,
            );
          }
        }
      })
      .catch(() => {
        // Ignore autoplay / audio initialization errors.
      });
  }, [ensureAudioContextReady]);

  const formatSessionTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  useEffect(() => {
    if (!isDeviceMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (deviceMenuRef.current && !deviceMenuRef.current.contains(event.target as Node)) {
        setIsDeviceMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDeviceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeviceMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDeviceMenuOpen(false);

    const contentNode = contentRef.current;
    if (contentNode) {
      contentNode.scrollTop = 0;
      contentNode.scrollLeft = 0;
      contentNode.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isAdminAuthenticated || !areOrdersReady) {
      return;
    }

    const currentOrderIds = new Set(adminOrders.map((order) => order.id));

    if (!hasSeededOrdersRef.current) {
      hasSeededOrdersRef.current = true;
      orderIdsRef.current = currentOrderIds;
      return;
    }

    const newOrderCount = adminOrders.filter((order) => !orderIdsRef.current.has(order.id)).length;
    const hasNewOrder = newOrderCount > 0;

    if (hasNewOrder) {
      triggerOrderAlert(newOrderCount);
    }

    orderIdsRef.current = currentOrderIds;
  }, [adminOrders, areOrdersReady, isAdminAuthenticated, triggerOrderAlert]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      return;
    }

    const handleManualOrderAlert = (event: Event) => {
      const customEvent = event as CustomEvent<{ count?: number; orderId?: string }>;
      const manualOrderId = customEvent.detail?.orderId;

      if (manualOrderId) {
        orderIdsRef.current.add(manualOrderId);
      }

      triggerOrderAlert(customEvent.detail?.count ?? 1);
    };

    window.addEventListener(ADMIN_NEW_ORDER_EVENT, handleManualOrderAlert as EventListener);

    return () => {
      window.removeEventListener(ADMIN_NEW_ORDER_EVENT, handleManualOrderAlert as EventListener);
    };
  }, [isAdminAuthenticated, triggerOrderAlert]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      return;
    }

    const unlockSound = () => {
      orderSoundUnlockedRef.current = true;
      try {
        void ensureAudioContextReady();

        if ("Notification" in window && Notification.permission === "default") {
          void Notification.requestPermission();
        }

        window.localStorage.setItem(ADMIN_ORDER_SOUND_STORAGE_KEY, "true");
      } catch {
        // Ignore storage errors.
      }
    };

    window.addEventListener(ADMIN_ORDER_SOUND_UNLOCK_EVENT, unlockSound, { once: true });
    window.addEventListener("keydown", unlockSound, { once: true });

    return () => {
      window.removeEventListener(ADMIN_ORDER_SOUND_UNLOCK_EVENT, unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, [ensureAudioContextReady, isAdminAuthenticated]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  const handleDeviceMenuToggle = () => {
    setIsDeviceMenuOpen((current) => {
      const next = !current;

      if (next) {
        void refetchAdminSessions();
      }

      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] text-[#173324]">
      <main className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-[#d9d2c2] bg-[#faf6ed]/92 backdrop-blur-xl">
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-10">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#756f61]">
                  Admin Workspace
                </p>
                <h2 className="mt-1 text-xl font-bold text-theme-heading sm:text-2xl">{title}</h2>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-[#c78e2f] bg-[#c78e2f] text-white shadow-[0_10px_20px_rgba(199,142,47,0.24)]"
                        : "border-[#d9d2c2] bg-white/72 text-theme-body hover:border-[#c9b995] hover:bg-[#fff8e8] hover:text-theme-heading"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c2] bg-white/82 text-theme-body shadow-sm transition hover:border-[#c9b995] hover:bg-[#fff8e8] hover:text-theme-heading lg:hidden"
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden rounded-full border border-[#d9d2c2] bg-white/72 px-4 py-2 text-sm font-semibold text-theme-body lg:block">
                Desktop mode
              </div>
              <div ref={deviceMenuRef} className="relative">
                <button
                  type="button"
                  onClick={handleDeviceMenuToggle}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d9d2c2] bg-white/80 px-3 py-2 text-sm font-semibold text-theme-body shadow-sm transition hover:border-[#c9b995] hover:bg-[#fff8e8] hover:text-theme-heading sm:px-4"
                >
                  <MonitorSmartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Devices logged in</span>
                  <span
                    className="rounded-full bg-[#2f7a43] px-2 py-0.5 text-xs font-bold text-white"
                    style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                  >
                    {sessions.length}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDeviceMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[22rem] overflow-hidden rounded-[1.5rem] border border-[#d9d2c2] bg-[#f7f2e8] shadow-[0_24px_50px_rgba(71,55,27,0.18)]">
                    <div className="border-b border-[#e1d7c6] bg-[linear-gradient(180deg,#f5efe2_0%,#f7f2e8_100%)] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b7569]">
                        Active admin devices
                      </p>
                      <p className="mt-1 text-lg font-semibold text-theme-heading">
                        {sessions.length} device{sessions.length === 1 ? "" : "s"} logged in
                      </p>
                    </div>

                    <div className="max-h-80 overflow-auto p-3">
                      {sessions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#ded2bd] bg-white px-4 py-5 text-sm text-theme-body">
                          No active sessions found.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {sessions.map((session) => (
                            <div
                              key={session.id}
                              className="rounded-2xl border border-[#ddd1ba] bg-[#fcf8ef] px-4 py-3 shadow-[0_8px_18px_rgba(62,48,21,0.05)]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#2f7a43_0%,#1e5a31_100%)] text-white shadow-sm" style={{ color: "#ffffff" }}>
                                    <MonitorSmartphone className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-theme-heading">{session.deviceLabel}</p>
                                    <p className="text-xs text-theme-body">{session.adminEmail}</p>
                                    <p className="mt-1 text-xs text-theme-body">
                                      {session.ipAddress || "Unknown IP"}
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                                    session.isCurrent
                                      ? "bg-[#1f6a3b] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                                      : "bg-[#f4eddc] text-[#6c675d]"
                                  }`}
                                  style={
                                    session.isCurrent
                                      ? { color: "#ffffff", WebkitTextFillColor: "#ffffff" }
                                      : undefined
                                  }
                                >
                                  {session.isCurrent ? "Current" : "Active"}
                                </span>
                              </div>

                              <div className="mt-3 text-xs text-[#6f685a]">
                                <span>
                                  Last seen {session.lastSeenAt ? formatSessionTime.format(new Date(session.lastSeenAt)) : "just now"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 border-t border-[#dfd3bd] px-4 py-3">
                      <Link
                        to="/admin/forgot-password?mode=change"
                        onClick={() => setIsDeviceMenuOpen(false)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9d2c2] bg-white px-4 py-3 text-sm font-semibold text-theme-heading shadow-sm transition hover:border-[#c9b995] hover:bg-[#fff8e8]"
                      >
                        <KeyRound className="h-4 w-4" />
                        Change password
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8f2d24] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(143,45,36,0.25)] transition hover:bg-[#a83a2a] hover:shadow-[0_12px_24px_rgba(143,45,36,0.35)]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-3 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8 xl:p-10">
            {children}
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              aria-label="Close admin menu overlay"
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="absolute right-0 top-0 h-full w-[min(92vw,24rem)] border-l border-[#d9d2c2] bg-[linear-gradient(180deg,#faf6ed_0%,#f1e8d8_100%)] shadow-[0_24px_50px_rgba(71,55,27,0.28)]">
              <div className="flex items-center justify-between border-b border-[#dfd3bd] px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#71695d]">Admin menu</p>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d4c6aa] bg-white/85 text-theme-body"
                  aria-label="Close admin menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 px-4 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={`mobile-menu-${item.href}`}
                      to={item.href}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "border-[#c78e2f] bg-[#fff4d9] text-[#6e4a08]"
                          : "border-[#d9d2c2] bg-white/80 text-theme-body"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-[#dfd3bd] px-4 py-4">
                <Link
                  to="/admin/forgot-password?mode=change"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9d2c2] bg-white/85 px-4 py-3 text-sm font-semibold text-theme-heading shadow-sm"
                >
                  <KeyRound className="h-4 w-4" />
                  Change password
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8f2d24] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(143,45,36,0.25)]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#d9d2c2] bg-[#faf6ed]/98 px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={`mobile-tab-${item.href}`}
                  to={item.href}
                  className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                    isActive
                      ? "bg-[#2f7a43] !text-white shadow-[0_8px_16px_rgba(47,122,67,0.24)]"
                      : "text-[#4f4a3f]"
                  }`}
                  style={isActive ? { color: "#ffffff", WebkitTextFillColor: "#ffffff" } : undefined}
                >
                  <Icon className={`mb-1 h-4 w-4 ${isActive ? "text-white" : ""}`} style={isActive ? { color: "#ffffff" } : undefined} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}
