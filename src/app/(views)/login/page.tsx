"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GlobalLoader from "@/components/ui/GlobalLoader";

export default function SignIn() {
const [errorMsg, setErrorMsg] = useState<string>("");
  const [code, setPatientCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      code,
      redirect: false,
    });

    if (res?.ok) {
      const session = await getSession();
      if (session?.user?.id) {
        setIsRedirecting(true); // 👈 تفعيل اللودر الشامل فوراً
        router.push(`/profile/${session.user.id}`);
        return;
      }
    } else {
      setErrorMsg("الكود الذي ادخلته غير صحيح");
      setLoading(false);
    }
  };
  return (

    <div>
      {isRedirecting && <GlobalLoader />}
        <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* القسم الأيسر */}
      <div className="md:px-10 h-full px-4 flex flex-col justify-center flex-1 w-full">
        <div className="text-center mb-8">
          <Image
            src="/images/mada_icon.svg"
            alt="mada"
            width={150}
            height={150}
            className="mx-auto"
            sizes="(max-width: 768px) 100px, 150px"
          />
          <h1 className="mt-2 font-semibold text-gray-800 text-xl dark:text-white/90 lg:text-4xl md:text-3xl">
            مرحبا بك في عيادة مدى السنية
          </h1>
        </div>

        <div>
          <div className="mb-5 sm:mb-8 lg:px-7">
            <h1 className="mb-2 font-semibold text-brand-800 dark:text-white/90 text-lg">
              تسجيل الدخول
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              يمكنك الآن متابعة بيانات علاجك كاملة
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              قم بإدخال الكود الخاص بك (سيقوم الطبيب بتزويدك بالكود)
            </p>
          </div>

          <form className="space-y-6 lg:px-8" onSubmit={handleSubmit}>
            <div>
              <Label>
                الكود <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                name="code"
                placeholder="ادخل الكود الخاص بك"
                value={code}
                onChange={(e) => setPatientCode(e.target.value)}
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600 font-semibold">
                {errorMsg}
              </p>
            )}

            <Button className="w-full" size="sm" type="submit" disabled={loading}>
              {loading ? "جاري التحقق..." : "تسجيل الدخول"}
            </Button>
          </form>
        </div>
      </div>

      {/* صورة الخلفية */}
      <div className="hidden md:block md:w-1/2 h-full relative">
        <Image
          fill
          className="object-cover object-left"
          src="/images/hero.webp"
          alt="Background"
        />
      </div>
    </div>
    </div>
  
  );
}
