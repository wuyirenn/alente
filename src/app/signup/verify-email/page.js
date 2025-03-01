"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, useAuth } from "@/lib";

export default function SignupVerifyEmail() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { session, loading } = useAuth();

    // Redirect if already verified
    if (!loading && session?.user?.email_confirmed_at) {
        router.push("/");
        return null;
    }

    // Redirect if no session
    if (!loading && !session) {
        router.push("/signup");
        return null;
    }

    const handleResendEmail = async () => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: session.user.email,
            });

            if (error) throw error;

            setMessage("Verification email sent! Please check your inbox.");
            setError("");
        } catch (error) {
            console.error("Error resending verification email:", error);
            setError("Failed to resend verification email. Please try again.");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light">
            <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-2xl font-bold text-dark">Check your email</h1>
                <p className="text-sm text-gray-500">
                    We've sent a verification email to {session.user.email}.
                </p>

                {message && (
                    <div className="text-secondary-normal text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="text-primary text-sm">
                        {error}
                    </div>     
                )}

                <div className="pt-4">
                    <button
                        onClick={handleResendEmail}
                        className="text-gray-500 border-b-0 border-gray-500 hover:text-dark hover:border-dark transition-colors"
                    >
                        Didn't receive an email? Click here to resend.
                    </button>
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => router.push("/")}
                        className="text-gray-500 border-b-0 border-gray-500 hover:text-dark hover:border-dark transition-colors"
                    >
                        Back to sign in
                    </button>
                </div>
            </div>
        </main>
    );
}