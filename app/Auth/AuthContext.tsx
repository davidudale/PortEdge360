"use client";

import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, db } from "./firebase";
import {
  UserRole,
  getDashboardPathForRole,
  getUserRoleFromProfile,
} from "./roles";

type UserProfile = {
  uid: string;
  displayName?: string;
  email?: string;
  department?: string;
  requestedAccessLevel?: UserRole;
  role?: UserRole;
  status?: string;
  emailVerified?: boolean;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  dashboardPath: string | null;
  isLoading: boolean;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setProfile(null);

      if (!nextUser) {
        setIsLoading(false);
        return;
      }

      try {
        const profileRef = doc(db, "users", nextUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          const nextRole = getUserRoleFromProfile(data) ?? undefined;

          const nextProfile = {
            uid: nextUser.uid,
            ...data,
            role: nextRole,
            requestedAccessLevel: nextRole,
            emailVerified: nextUser.emailVerified,
          } as UserProfile;

          setProfile(nextProfile);

          if (nextUser.emailVerified && data.emailVerified !== true) {
            await setDoc(
              profileRef,
              {
                emailVerified: true,
                status:
                  data.status === "pending_email_verification"
                    ? "pending"
                    : data.status,
                updatedAt: serverTimestamp(),
              },
              { merge: true },
            );
          }
        } else {
          setProfile({
            uid: nextUser.uid,
            displayName: nextUser.displayName ?? undefined,
            email: nextUser.email ?? undefined,
            emailVerified: nextUser.emailVerified,
          });
        }
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const role = profile?.role ?? profile?.requestedAccessLevel ?? null;
  const dashboardPath = role ? getDashboardPathForRole(role) : null;

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      dashboardPath,
      isLoading,
      signOutUser: () => firebaseSignOut(auth),
    }),
    [dashboardPath, isLoading, profile, role, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
