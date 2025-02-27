"use client";

import { useEffect } from 'react';
import { handleSignOut, supabase, useAuth } from '@/lib';
import { useRouter } from 'next/navigation';

export default function Dashboard() { 
    const router = useRouter();
    const { session, loading } = useAuth();

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !session) {
            router.push('/auth');
        }
    }, [session, loading, router]);

    if (!session) return null;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">{session.user.email}</h1>
            <button
                onClick={() => handleSignOut(router)}
                className="mt-4 p-2 text-white outline hover:bg-white hover:text-black transition"
            >
                Sign Out
            </button>
        </div>
    );
}