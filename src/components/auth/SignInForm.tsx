"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import validator from "validator";
const baseUrl = process.env.BASE_URL || '';
export default function SignInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      setErrorMsg("البريد الإلكتروني غير صالح.");
      return;
    }

    setLoading(true);

    try {
      // Call your custom login API directly
      const res = await fetch(`${baseUrl}/api/admin/signIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
       
        
        localStorage.setItem("admin-token", data.token);
        window.location.href = "/dashboard";
      } else {
        setErrorMsg(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen overflow-hidden">
      {/* Login Form */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              تسجيل الدخول
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              قم بادخال البريد الالكتروني وكلمة السر لتسجيل الدخول!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <Label htmlFor="email">
                البريد الالكتروني <span className="text-error-500">*</span>
              </Label>
              <Input
                id="email"
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               
              />
            </div>
            <div>
              <Label htmlFor="password">
                كلمة المرور <span className="text-error-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="ادخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
             
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-red-600 font-semibold">{errorMsg}</p>
            )}
            <Button className="w-full" size="sm" type="submit" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </div>
      </div>

      {/* Image */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          className="w-full h-full object-cover"
          src="/images/mada-cover.jpg"
          alt="Background"
        />
      </div>
    </div>
  );
}
