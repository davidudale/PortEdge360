"use client";

import { FormEvent, useState } from "react";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { auth, db } from "../Auth/firebase";
import { getDashboardPathForRole, getUserRoleFromProfile } from "../Auth/roles";

type FieldErrors = {
  email?: string;
  password?: string;
};

type LoginMode = "sign-in" | "forgot-password";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email address or password.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Unable to complete the request. Please try again.";
  }
}

async function getUserDashboardPath(uid: string) {
  const profileSnap = await getDoc(doc(db, "users", uid));

  if (!profileSnap.exists()) {
    return null;
  }

  const profile = profileSnap.data();
  const role = getUserRoleFromProfile(profile);

  return role ? getDashboardPathForRole(role) : null;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields before signing in.");
    }

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSigningIn(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (!credential.user.emailVerified) {
        try {
          await sendEmailVerification(credential.user, {
            url: `${window.location.origin}/login`,
          });
        } catch {
          // Firebase rate-limits verification emails; login is still blocked.
        }
        await signOut(auth);
        toast.info(
          "Verify your email before signing in. Check your inbox for the verification link.",
        );
        return;
      }

      const dashboardPath = await getUserDashboardPath(credential.user.uid);

      if (!dashboardPath) {
        await signOut(auth);
        toast.error("Your account does not have an assigned dashboard role.");
        return;
      }

      toast.success("Signed in successfully.");
      router.push(dashboardPath);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleResendVerification() {
    if (!validateForm()) {
      return;
    }

    setIsResendingVerification(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (credential.user.emailVerified) {
        toast.info("This email address is already verified. You can sign in.");
        return;
      }

      await sendEmailVerification(credential.user, {
        url: `${window.location.origin}/login`,
      });
      toast.success("Verification email sent. Check your inbox.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      await signOut(auth).catch(() => {});
      setIsResendingVerification(false);
    }
  }

  function validateResetForm() {
    const nextErrors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Enter a valid email address to request a reset link.");
    }

    return Object.keys(nextErrors).length === 0;
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateResetForm()) {
      return;
    }

    setIsSendingReset(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success("If the account exists, a reset link will be sent.");
      setMode("sign-in");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSendingReset(false);
    }
  }

  function showForgotPassword() {
    setMode("forgot-password");
    setPassword("");
    setFieldErrors({});
  }

  function showSignIn() {
    setMode("sign-in");
    setFieldErrors({});
  }

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-8">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/port-authority-hero.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/70" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-slate-950 to-transparent" />

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10  lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
            PortView360
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            360° Port Operations Portal 
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-100/85">
            Unified Workflow, Records and Administration Platform
          </p>
        </div>

        <section className="rounded-lg border border-white/20 bg-white/12 p-6 shadow-2xl shadow-slate-950/35 backdrop-blur-xl sm:p-8">
          {mode === "sign-in" ? (
            <>
              <div className="mb-2">
                <h2 className="text-2xl font-semibold text-white">
                  Sign in to continue
                </h2>
                <p className="mt-2 text-sm text-slate-200/80">
                  Authorized access for registered operations staff.
                </p>
              </div>

              <form className="space-y-5" noValidate onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-medium text-slate-100">
                    Email address
                  </span>
                  <input
                    aria-describedby="email-error"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@organization.gov"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setFieldErrors((current) => ({ ...current, email: "" }));
                    }}
                  />
                  <span
                    className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                    id="email-error"
                  >
                    {fieldErrors.email}
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-100">
                    Password
                  </span>
                  <input
                    aria-describedby="password-error"
                    aria-invalid={Boolean(fieldErrors.password)}
                    className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setFieldErrors((current) => ({
                        ...current,
                        password: "",
                      }));
                    }}
                  />
                  <span
                    className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                    id="password-error"
                  >
                    {fieldErrors.password}
                  </span>
                </label>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium text-slate-300">
                    Authorized users only
                  </p>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <button
                      className="text-sm font-semibold text-cyan-200 transition hover:text-cyan-100 disabled:cursor-wait disabled:text-cyan-100/60"
                      disabled={isResendingVerification}
                      type="button"
                      onClick={handleResendVerification}
                    >
                      {isResendingVerification
                        ? "Sending verification..."
                        : "Resend verification email"}
                    </button>
                    <button
                      className="text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                      type="button"
                      onClick={showForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  className="w-full rounded-md bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-cyan-200 disabled:cursor-wait disabled:bg-cyan-100"
                  disabled={isSigningIn || isResendingVerification}
                  type="submit"
                >
                  {isSigningIn ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  className="mb-4 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                  type="button"
                  onClick={showSignIn}
                >
                  Back to sign in
                </button>
                <h2 className="text-2xl font-semibold text-white">
                  Reset your password
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-200/80">
                  Enter your official email address. If it matches an active
                  portal account, reset instructions will be sent to you.
                </p>
              </div>

              <form
                className="space-y-5"
                noValidate
                onSubmit={handlePasswordReset}
              >
                <label className="block">
                  <span className="text-sm font-medium text-slate-100">
                    Email address
                  </span>
                  <input
                    aria-describedby="reset-email-error"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                    name="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@organization.gov"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setFieldErrors((current) => ({ ...current, email: "" }));
                    }}
                  />
                  <span
                    className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                    id="reset-email-error"
                  >
                    {fieldErrors.email}
                  </span>
                </label>

                <button
                  className="w-full rounded-md bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-cyan-200 disabled:cursor-wait disabled:bg-cyan-100"
                  disabled={isSendingReset}
                  type="submit"
                >
                  {isSendingReset ? "Sending reset link..." : "Send reset link"}
                </button>
              </form>

              <p className="mt-5 rounded-md border border-white/15 bg-white/10 px-3 py-3 text-sm leading-6 text-slate-200/85">
                For locked or inactive accounts, contact your system
                administrator.
              </p>
            </>
          )}

          <p className="mt-5 border-t border-white/15 pt-5 text-sm leading-6 text-slate-200/85">
            Authorized users only. All access attempts are logged.
          </p>
        </section>
      </section>

      <footer className="mx-auto w-full max-w-6xl pb-2 text-sm text-slate-300/80">
        © Powered by Starwort and Kane Technologies
      </footer>
    </main>
  );
}
