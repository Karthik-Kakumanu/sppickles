import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Lock, Smartphone } from "lucide-react";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { brand } from "@/data/site";
import { useToast } from "@/hooks/use-toast";
import { confirmAdminPasswordResetOtp, requestAdminPasswordResetOtp } from "@/lib/api";

const AdminForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { isAdminAuthenticated, isAdminReady, logoutAdmin } = useStore();
  const isChangePasswordMode = searchParams.get("mode") === "change" || searchParams.get("from") === "dashboard";

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  if (!isAdminReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-6 py-16">
        <p className="text-sm font-semibold text-[#1e4f2e]">Preparing password reset...</p>
      </main>
    );
  }

  if (isAdminAuthenticated && !isChangePasswordMode) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const getLastTenDigits = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return "";
    }

    return digitsOnly.slice(-10);
  };

  const handleRequestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsRequestingOtp(true);

    const mobileLastTen = getLastTenDigits(mobile);

    if (!mobileLastTen) {
      setIsRequestingOtp(false);
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const response = await requestAdminPasswordResetOtp(mobileLastTen);
      setOtpRequested(true);
      setDevOtp(response.devOtp ?? "");

      toast({
        title: "OTP sent",
        description: "Enter the OTP and set your new password.",
      });
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to send OTP.";
      setError(message);
      toast({
        title: "OTP request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const mobileLastTen = getLastTenDigits(mobile);

    if (!otpRequested) {
      setError("Request OTP first.");
      return;
    }

    if (!mobileLastTen) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsResettingPassword(true);

    try {
      const response = await confirmAdminPasswordResetOtp(mobileLastTen, otp, newPassword);

      if (response.sessionsRevoked) {
        await logoutAdmin().catch(() => undefined);
      }

      toast({
        title: "Password changed",
        description: "Password updated successfully. All logged-in admin devices were signed out.",
      });

      navigate("/admin/login", { replace: true });
    } catch (resetError) {
      const message = resetError instanceof Error ? resetError.message : "Unable to reset password.";
      setError(message);
      toast({
        title: "Reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-4 py-10 sm:px-6">
      <Seo
        title="SP Traditional Pickles | Admin Forgot Password"
        description="Reset your SP Traditional Pickles admin password"
        noIndex
      />

      <section className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-[1.8rem] border border-[#d8e5d8] bg-white p-7 shadow-[0_20px_40px_rgba(30,79,46,0.08)] sm:p-8">
          <div className="mb-6 text-center">
            <img
              src={brand.logo}
              alt={brand.name}
              className="mx-auto h-16 w-16 rounded-full object-contain"
            />
            <h1 className="mt-4 font-heading text-3xl font-semibold text-theme-heading">
              {isChangePasswordMode ? "Change Password" : "Forgot Password"}
            </h1>
            <p className="mt-2 text-sm text-theme-body">
              {isChangePasswordMode ? "OTP password change for admin account" : "OTP reset for admin account"}
            </p>
          </div>

          <form onSubmit={handleRequestOtp} className="space-y-4">
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile Number
              </span>
              <input
                type="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                placeholder="Enter 10-digit mobile number"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={14}
                disabled={isRequestingOtp || otpRequested}
                className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43] focus:ring-2 focus:ring-[#2f7a43]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <button
              type="submit"
              disabled={isRequestingOtp || otpRequested || !mobile.trim()}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f7a43] px-5 text-sm font-semibold !text-white shadow-[0_16px_32px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              {isRequestingOtp ? "Sending OTP..." : otpRequested ? "OTP Sent" : "Send OTP"}
              {!isRequestingOtp ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>

          {otpRequested ? (
            <form onSubmit={handleResetPassword} className="mt-5 space-y-4 border-t border-[#e9efe9] pt-5">
              <label className="block space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">
                  <KeyRound className="h-3.5 w-3.5" />
                  OTP
                </span>
                <input
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  autoComplete="one-time-code"
                  disabled={isResettingPassword}
                  className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43] focus:ring-2 focus:ring-[#2f7a43]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="block space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">
                  <Lock className="h-3.5 w-3.5" />
                  New Password
                </span>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={isResettingPassword}
                    className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 pr-12 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43] focus:ring-2 focus:ring-[#2f7a43]/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-theme-body-soft transition hover:bg-[#edf5ee] hover:text-theme-heading"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="block space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">
                  <Lock className="h-3.5 w-3.5" />
                  Confirm Password
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={isResettingPassword}
                    className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 pr-12 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43] focus:ring-2 focus:ring-[#2f7a43]/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-theme-body-soft transition hover:bg-[#edf5ee] hover:text-theme-heading"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={isResettingPassword || otp.length !== 6 || !newPassword || !confirmPassword}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f7a43] px-5 text-sm font-semibold !text-white shadow-[0_16px_32px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              >
                {isResettingPassword ? "Updating..." : "Update Password"}
                {!isResettingPassword ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>
          ) : null}

          {devOtp ? (
            <p className="mt-4 rounded-xl border border-[#d8e5d8] bg-[#f5fbf6] px-3 py-2 text-xs text-[#1e4f2e]">
              Dev OTP: <strong>{devOtp}</strong>
            </p>
          ) : null}

          {error ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#d9644c]/30 bg-[#fff4f1] px-3 py-3 text-sm text-[#b84c39]">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="mt-6">
            <Link
              to={isChangePasswordMode ? "/admin/dashboard" : "/admin/login"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f7a43] transition hover:text-[#28683a]"
            >
              <ArrowLeft className="h-4 w-4" />
              {isChangePasswordMode ? "Back to dashboard" : "Back to login"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminForgotPasswordPage;
