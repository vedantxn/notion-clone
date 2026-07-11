"use client";

// LOCAL PREVIEW BYPASS — drop-in fake for `@clerk/clerk-react`.
// Provides a single hard-coded signed-in user so the UI works without any
// real authentication. Revert (re-point imports to `@clerk/clerk-react`) before deploy.

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

const FAKE_USER = {
    id: "local-preview-user",
    firstName: "Local",
    lastName: "Preview",
    fullName: "Local Preview",
    username: "local-preview",
    imageUrl: "/logo.svg",
    emailAddresses: [{ emailAddress: "preview@local.dev" }],
    primaryEmailAddress: { emailAddress: "preview@local.dev" },
};

export const useUser = () => ({
    isLoaded: true,
    isSignedIn: true,
    user: FAKE_USER,
});

export const useAuth = () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: FAKE_USER.id,
    sessionId: "local-preview-session",
    getToken: async () => null,
    signOut: async () => {},
});

export const ClerkProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

// Enters the app instead of opening a sign-in modal.
export const SignInButton = ({ children }: { children?: ReactNode; mode?: string }) => {
    const router = useRouter();
    return (
        <span role="button" onClick={() => router.push("/notion-library")}>
            {children}
        </span>
    );
};

export const SignOutButton = ({ children }: { children?: ReactNode }) => {
    const router = useRouter();
    return (
        <span role="button" onClick={() => router.push("/")}>
            {children}
        </span>
    );
};

// Minimal avatar stand-in for Clerk's <UserButton />.
export const UserButton = ({ afterSignOutUrl }: { afterSignOutUrl?: string }) => {
    const router = useRouter();
    return (
        <div
            role="button"
            onClick={() => router.push(afterSignOutUrl ?? "/")}
            className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium select-none"
            title={FAKE_USER.fullName}
        >
            {FAKE_USER.firstName.charAt(0)}
        </div>
    );
};
