"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import validator from "validator";

/**
 * @Engineering_Notes:
 * This component manages the Administrative login flow.
 * Focus: Client-side validation using 'validator' library, 
 * asynchronous state handling (loading/error), and secure token persistence.
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

export default function SignInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    /**
     * @Validation_Strategy:
     * Pre-submit validation reduces unnecessary API hits and improves UX 
     * by providing immediate feedback on email formatting.
     */
    if (!validator.isEmail(email)) {
      setErrorMsg("البريد الإلكتروني غير صالح.");
      return;
    }

    setLoading(true);

    try {
      // Direct API integration for administrative authentication
      const res = await fetch(`${baseUrl}/api/admin/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        /**
         * @Session_Persistence:
         * On successful auth, we store the JWT in localStorage for non-sensitive UI persistence.
         * Note: Sensitive authentication is simultaneously handled via HttpOnly cookies by the API.
         */
        localStorage.setItem("admin-token", data.token);
        window.location.href = "/dashboard";
      } else {
        setErrorMsg(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      }
    } catch (err) {
      console.error("UX_LOGIN_ERROR:", err);
      setErrorMsg("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen overflow-hidden">
      {/* Login Form Container */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            تسجيل الدخول
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            الرجاء إدخال بيانات الاعتماد للوصول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <Label htmlFor="email">البريد الالكتروني <span className="text-error-500">*</span></Label>
            <Input
              id="email"
              placeholder="info@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">كلمة المرور <span className="text-error-500">*</span></Label>
            <Input
              id="password"
              type="password"
              placeholder="ادخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {errorMsg && (
            <p role="alert" className="text-sm text-red-600 font-semibold animate-pulse">
              {errorMsg}
            </p>
          )}

          <Button className="w-full" size="sm" type="submit" disabled={loading}>
            {loading ? "جاري التحقق..." : "دخول النظام"}
          </Button>
        </form>
      </div>

      {/* Hero Image Section - Branding */}
      <div className="hidden md:block md:w-1/2 h-screen border-l border-gray-100 dark:border-white/10">
        <img
          className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
          src="/images/mada-cover.jpg"
          alt="Dental Clinic Management Branding"
        />
      </div>
    </div>
  );
}