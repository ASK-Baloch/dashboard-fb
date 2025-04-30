'use client';
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={() => signIn('facebook')} className="px-4 py-2 bg-blue-600 text-white rounded">
        Login with Facebook
      </button>
    </div>
  );
}