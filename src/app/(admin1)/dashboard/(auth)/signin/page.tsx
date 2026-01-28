'use client'
import dynamic from 'next/dynamic';

const SignInForm = dynamic(() => import('@/components/auth/SignInForm'));

export default function SignIn() {
  return <SignInForm />;
}
