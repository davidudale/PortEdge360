"use client";

import { FormEvent, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { auth, db } from "../Auth/firebase";
import { roles } from "../Auth/roles";

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  accessLevel?: string;
  password?: string;
  confirmPassword?: string;
  authorized?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRegistrationErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Unable to submit registration. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";
    case "auth/invalid-email":
      return "Enter a valid official email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "permission-denied":
      return "Registration was created, but the profile could not be saved. Check Firestore rules.";
    default:
      return "Unable to submit registration. Please try again.";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Official email address is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid official email address.";
    }

    if (!department.trim()) {
      nextErrors.department = "Department or unit is required.";
    }

    if (!accessLevel) {
      nextErrors.accessLevel = "Select a requested access level.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!authorized) {
      nextErrors.authorized = "Confirm this is an official access request.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields before submitting.");
    }

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await updateProfile(credential.user, { displayName });
      await sendEmailVerification(credential.user, {
        url: `${window.location.origin}/login`,
      });

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName,
        email: email.trim().toLowerCase(),
        department: department.trim(),
        role: accessLevel,
        requestedAccessLevel: accessLevel,
        emailVerified: false,
        status: "pending_email_verification",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await signOut(auth);
      toast.success(
        "Registration submitted. Check your email to verify your account.",
      );
      router.push("/login");
    } catch (error) {
      toast.error(getRegistrationErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-8">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/port-authority-hero.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/75" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-slate-950 to-transparent" />

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_520px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
            PortView360
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Request portal access
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-100/85">
            Create an official account request for workflow, records,
            compliance, and port administration access.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-200/85 sm:grid-cols-2">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold text-white">Verified personnel</p>
              <p className="mt-1 leading-6">
                Registration is reviewed before portal access is activated.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold text-white">Audit controlled</p>
              <p className="mt-1 leading-6">
                All access requests are logged for administrative review.
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-lg border border-white/20 bg-white/12 p-6 shadow-2xl shadow-slate-950/35 backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              User registration
            </h2>
            <p className="mt-2 text-sm text-slate-200/80">
              Complete the details below to request an account.
            </p>
          </div>

          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-100">
                  First name
                </span>
                <input
                  aria-describedby="first-name-error"
                  aria-invalid={Boolean(fieldErrors.firstName)}
                  className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                  name="firstName"
                  placeholder="First name"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    clearFieldError("firstName");
                  }}
                />
                <span
                  className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                  id="first-name-error"
                >
                  {fieldErrors.firstName}
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-100">
                  Last name
                </span>
                <input
                  aria-describedby="last-name-error"
                  aria-invalid={Boolean(fieldErrors.lastName)}
                  className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                  name="lastName"
                  placeholder="Last name"
                  type="text"
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                    clearFieldError("lastName");
                  }}
                />
                <span
                  className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                  id="last-name-error"
                >
                  {fieldErrors.lastName}
                </span>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-100">
                Official email address
              </span>
              <input
                aria-describedby="register-email-error"
                aria-invalid={Boolean(fieldErrors.email)}
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                name="email"
                placeholder="name@organization.gov"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearFieldError("email");
                }}
              />
              <span
                className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                id="register-email-error"
              >
                {fieldErrors.email}
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-100">
                Department or unit
              </span>
              <input
                aria-describedby="department-error"
                aria-invalid={Boolean(fieldErrors.department)}
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                name="department"
                placeholder="Operations, Records, Compliance"
                type="text"
                value={department}
                onChange={(event) => {
                  setDepartment(event.target.value);
                  clearFieldError("department");
                }}
              />
              <span
                className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                id="department-error"
              >
                {fieldErrors.department}
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-100">
                Requested access level
              </span>
              <select
                aria-describedby="access-level-error"
                aria-invalid={Boolean(fieldErrors.accessLevel)}
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                name="accessLevel"
                value={accessLevel}
                onChange={(event) => {
                  setAccessLevel(event.target.value);
                  clearFieldError("accessLevel");
                }}
              >
                <option value="" disabled>
                  Select access level
                </option>
                {roles.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <span
                className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                id="access-level-error"
              >
                {fieldErrors.accessLevel}
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-100">
                  Password
                </span>
                <input
                  aria-describedby="register-password-error"
                  aria-invalid={Boolean(fieldErrors.password)}
                  className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                  name="password"
                  placeholder="Create password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearFieldError("password");
                  }}
                />
                <span
                  className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                  id="register-password-error"
                >
                  {fieldErrors.password}
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-100">
                  Confirm password
                </span>
                <input
                  aria-describedby="confirm-password-error"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/25 aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-200/25"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    clearFieldError("confirmPassword");
                  }}
                />
                <span
                  className="mt-2 block min-h-5 text-sm font-medium text-red-200"
                  id="confirm-password-error"
                >
                  {fieldErrors.confirmPassword}
                </span>
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-md border border-white/15 bg-white/10 p-3 text-sm leading-6 text-slate-200/85">
              <input
                aria-describedby="authorized-error"
                className="mt-1 size-4 accent-cyan-300"
                checked={authorized}
                name="authorized"
                type="checkbox"
                onChange={(event) => {
                  setAuthorized(event.target.checked);
                  clearFieldError("authorized");
                }}
              />
              <span>
                I confirm this request is for official port authority duties and
                may be reviewed by system administrators.
              </span>
            </label>
            <span
              className="block min-h-5 text-sm font-medium text-red-200"
              id="authorized-error"
            >
              {fieldErrors.authorized}
            </span>

            <button
              className="w-full rounded-md bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-cyan-200 disabled:cursor-wait disabled:bg-cyan-100"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting request..." : "Submit access request"}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-2 border-t border-white/15 pt-5 text-sm text-slate-200/85 sm:flex-row sm:items-center sm:justify-between">
            <p>Already have an account?</p>
            <Link
              className="font-semibold text-cyan-200 transition hover:text-cyan-100"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </section>
      </section>

      <footer className="mx-auto w-full max-w-6xl pb-2 text-sm text-slate-300/80">
        Powered by Starwort and Kane Technologies
      </footer>
    </main>
  );
}
