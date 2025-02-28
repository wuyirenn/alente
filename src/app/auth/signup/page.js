"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const { session, loading } = useAuth();

    useEffect(() => {
        if (!loading) {  // Only redirect after auth state is determined
            if (session) {
                router.push('/'); // Redirect to home if user is logged in
            } else {
                router.push('/auth/signup/email'); // Redirect to email signup if not logged in
            }
        }
    }, [session, loading, router]);
 
}