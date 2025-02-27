"use client";

import { useEffect } from 'react';
import { supabase, useAuth } from '@/lib';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { minimal } from '@supabase/auth-ui-shared';


export default function AuthPage() {
    const router = useRouter();
    const { session, loading } = useAuth();

    useEffect(() => {
        if (!loading && session) {
            router.push('/');
        }
    }, [session, loading, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: minimal }}
                providers={[]}
            />
        </div>
    );
}