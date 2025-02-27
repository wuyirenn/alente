"use client";

import { handleSignOut, supabase, useAuth } from '@/lib';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { session, loading } = useAuth()

  // Landing page if unAuth
  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
          <h1 className="text-5xl font-bold mb-4">[title]</h1>
          <p className="text-lg mb-8 text-center px-4">
            [text]
          </p>
          <Link href="/auth" className="outline text-white px-6 py-2 hover:bg-white hover:text-black transition">
            Sign In
          </Link>
        </div>
      </main>
    );
  }
  // Home page if Auth
  return (
    <div className="bg-black min-h-screen">
      <NavBar />
      <main className="p-6">
        <h1 className="text-4xl font-bold mb-4">[more text]</h1>
        <p className="text-lg mb-4">
          [even more text]]
        </p>
      </main>
    </div>
  );
}

function NavBar () {
  const router = useRouter();

  return (
    <div className="bg-black shadow-md py-4">
      <div className="container flex justify-stretch items-center px-6 space-x-6">
        <Link href="/" className="text-2xl font-bold text-white">[title]</Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/dashboard" className="text-white">Dashboard</Link>
          </li>
          <li>
            <button
              onClick={() => handleSignOut(router)}
              className="text-white"
            >Sign out</button>
          </li>
        </ul>
      </div>
    </div>
  )
}