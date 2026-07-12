"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FirebaseError, deleteApp, getApp, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Edit3, Plus, RefreshCw, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { db, firebaseConfig } from "../../../Auth/firebase";
import { roles } from "../../../Auth/roles";

type UserRecord = {
  id: string;
  createdAt?: unknown;
  department?: string;
  displayName?: string;
  email?: string;
  emailVerified?: boolean;
  requirePasswordChange?: boolean;
  role?: string;
  status?: string;
};

type UserFormState = {
  department: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  password: string;
  requirePasswordChange: boolean;
  role: string;
  status: string;
};

const emptyForm: UserFormState = {
  department: "",
  displayName: "",
  email: "",
  emailVerified: false,
  password: "",
  requirePasswordChange: true,
  role: "",
  status: "pending_email_verification",
};

const statusOptions = [
  "active",
  "pending_email_verification",
  "pending_review",
  "suspended",
  "disabled",
];

function generateTemporaryPassword() {
  const randomPart = crypto
    .getRandomValues(new Uint32Array(2))
    .join("")
    .slice(0, 10);

  return `Port@${randomPart}`;
}

function getSaveErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Unable to save user profile.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "A Firebase Auth account already exists for this email.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Temporary password must be at least 8 characters.";
    case "permission-denied":
      return "The profile was not saved. Check Firestore rules.";
    default:
      return "Unable to save user profile.";
  }
}

function formatDate(value: unknown) {
  if (!value) {
    return "Not recorded";
  }

  if (value instanceof Timestamp) {
    return value.toDate().toLocaleDateString();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toLocaleDateString();
  }

  return "Not recorded";
}

function getStatusLabel(user: UserRecord) {
  if (user.status) {
    return user.status.replaceAll("_", " ");
  }

  return user.emailVerified ? "active" : "pending email verification";
}

export default function SuperAdminUsersTable() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState<UserFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);

  async function fetchUsers() {
    setError("");
    setIsLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "users"));
      const nextUsers = snapshot.docs
        .map((userDoc): UserRecord => ({
          id: userDoc.id,
          ...userDoc.data(),
        }))
        .sort((firstUser, secondUser) =>
          (firstUser.displayName ?? firstUser.email ?? "").localeCompare(
            secondUser.displayName ?? secondUser.email ?? "",
          ),
        );

      setUsers(nextUsers);
    } catch (fetchError) {
      setError("Unable to fetch users from Firestore.");
      toast.error("Unable to fetch users from Firestore.");
      console.error(fetchError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function resetForm() {
    setEditingUserId(null);
    setFormState(emptyForm);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    resetForm();
  }

  function handleEdit(user: UserRecord) {
    setEditingUserId(user.id);
    setFormState({
      department: user.department ?? "",
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      emailVerified: Boolean(user.emailVerified),
      password: "",
      requirePasswordChange: Boolean(user.requirePasswordChange),
      role: user.role ?? "",
      status: user.status ?? (user.emailVerified ? "active" : "pending_review"),
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !formState.displayName.trim() ||
      !formState.email.trim() ||
      (!editingUserId && formState.password.length < 8)
    ) {
      toast.error(
        editingUserId
          ? "Name and email are required."
          : "Name, email, and an 8-character temporary password are required.",
      );
      return;
    }

    setIsSaving(true);

    const payload = {
      department: formState.department.trim(),
      displayName: formState.displayName.trim(),
      email: formState.email.trim().toLowerCase(),
      emailVerified: formState.emailVerified,
      requirePasswordChange: formState.requirePasswordChange,
      role: formState.role,
      requestedAccessLevel: formState.role,
      status: formState.status,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingUserId) {
        await updateDoc(doc(db, "users", editingUserId), payload);
        toast.success("User profile updated.");
      } else {
        const secondaryAppName = `super-admin-user-create-${Date.now()}`;
        const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        const secondaryAuth = getAuth(secondaryApp);
        const credential = await createUserWithEmailAndPassword(
          secondaryAuth,
          payload.email,
          formState.password,
        );

        await updateProfile(credential.user, {
          displayName: payload.displayName,
        });
        await setDoc(doc(db, "users", credential.user.uid), {
          ...payload,
          uid: credential.user.uid,
          createdAt: serverTimestamp(),
        });
        await sendEmailVerification(credential.user, {
          url: `${window.location.origin}/login`,
        });
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);
        getApp();
        toast.success(
          "Auth user created. Verification email sent to the user.",
        );
      }

      resetForm();
      setIsModalOpen(false);
      await fetchUsers();
    } catch (saveError) {
      toast.error(getSaveErrorMessage(saveError));
      console.error(saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(user: UserRecord) {
    const label = user.displayName || user.email || "this user";

    if (!window.confirm(`Delete the Firestore profile for ${label}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.id));
      toast.success("User profile deleted.");
      await fetchUsers();
      if (editingUserId === user.id) {
        resetForm();
      }
    } catch (deleteError) {
      toast.error("Unable to delete user profile.");
      console.error(deleteError);
    }
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [
        user.displayName,
        user.email,
        user.department,
        user.role,
        user.status,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch)),
    );
  }, [searchTerm, users]);

  return (
    <div className="space-y-5">
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-profile-modal-title"
        >
      <form
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-[#0f172a] p-4 shadow-2xl shadow-black/40"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3
              className="text-sm font-black uppercase tracking-[0.16em] text-white"
              id="user-profile-modal-title"
            >
              {editingUserId ? "Edit user profile" : "Create user profile"}
            </h3>
            
          </div>
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:text-white disabled:cursor-wait disabled:opacity-60"
            disabled={isSaving}
            title="Close"
            type="button"
            onClick={closeModal}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Full name
            </span>
            <input
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
              placeholder="Jane Doe"
              value={formState.displayName}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  displayName: event.target.value,
                }))
              }
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Email
            </span>
            <input
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
              placeholder="user@organization.gov"
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Department
            </span>
            <input
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
              placeholder="Operations"
              value={formState.department}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  department: event.target.value,
                }))
              }
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Role
            </span>
            <select
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-500/60"
              value={formState.role}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
            >
              <option value="">Unassigned</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Status
            </span>
            <select
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-500/60"
              value={formState.status}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>

          {!editingUserId && (
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Temporary password
              </span>
              <div className="mt-2 flex gap-2">
                <input
                  className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="Temporary password"
                  type="text"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                />
                <button
                  className="h-10 shrink-0 rounded-lg border border-white/10 px-3 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:text-white"
                  type="button"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      password: generateTemporaryPassword(),
                    }))
                  }
                >
                  Generate
                </button>
              </div>
            </label>
          )}

          <label className="flex h-10 items-center gap-3 self-end rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-slate-300">
            <input
              className="size-4 accent-orange-500"
              checked={formState.emailVerified}
              type="checkbox"
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  emailVerified: event.target.checked,
                }))
              }
            />
            Email verified
          </label>

          <label className="flex h-10 items-center gap-3 self-end rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-slate-300">
            <input
              className="size-4 accent-orange-500"
              checked={formState.requirePasswordChange}
              type="checkbox"
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  requirePasswordChange: event.target.checked,
                }))
              }
            />
            Force password change
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="mr-3 inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:text-white disabled:cursor-wait disabled:opacity-60"
            disabled={isSaving}
            type="button"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {editingUserId ? (
              <Save aria-hidden="true" className="size-4" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
            {isSaving
              ? "Saving..."
              : editingUserId
                ? "Save changes"
                : "Create profile"}
          </button>
        </div>
      </form>
        </div>
      )}

      {/*
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Total users
          </p>
          <p className="mt-2 text-2xl font-black text-white">{users.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Verified
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-300">
            {users.filter((user) => user.emailVerified).length}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-2xl font-black text-orange-300">
            {users.filter((user) => !user.emailVerified).length}
          </p>
        </div>
      </div>*/}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-80">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
          />
          <input
            className="h-10 w-full rounded-lg border border-white/10 bg-[#111827] pl-10 pr-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="Search users"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-400"
            type="button"
            onClick={openCreateModal}
          >
            <Plus aria-hidden="true" className="size-4" />
            Create profile
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300 disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            type="button"
            onClick={fetchUsers}
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={6}>
                    Loading users...
                  </td>
                </tr>
              )}

              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredUsers.map((user) => (
                  <tr className="transition hover:bg-white/[0.03]" key={user.id}>
                    <td className="px-4 py-4">
                      <p className="font-black text-white">
                        {user.displayName || "Unnamed user"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {user.email || "No email recorded"}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-300">
                      {user.role || "Unassigned"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-300">
                      {user.department || "Not recorded"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-xs font-black capitalize text-orange-200">
                        {getStatusLabel(user)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300"
                          title="Edit user"
                          type="button"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit3 aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 text-red-200 transition hover:bg-red-500/10"
                          title="Delete user"
                          type="button"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
