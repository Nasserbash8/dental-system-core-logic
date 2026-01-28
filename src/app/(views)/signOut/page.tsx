'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutPage() {
  useEffect(() => {
    // Sign the user out and redirect to login
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">سيتم تسجيل خروجك.....</h2>
        <p className="text-gray-600">الرجاء الانتظار للحظات وسيتم تحويلك الى صفحة تسجيل الدخول</p>
      </div>
    </div>
  );
}
