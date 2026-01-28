import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
return (

    <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="relative w-15 h-15">
              {/* Spinning ring */}
              <div className="absolute inset-0 animate-spin rounded-full border-1 border-brand-900 border-t-transparent" />
                 <div className="absolute inset-0 flex items-center justify-center">
                 <Image height={80} width={80}  src='/images/mada_icon.svg' alt="Logo" className="w-8 h-8" /> 
              </div>
            </div>
          </div>
  );
}