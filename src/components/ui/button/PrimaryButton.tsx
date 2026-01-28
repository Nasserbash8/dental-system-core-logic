
import { motion } from "framer-motion";

export default function PrimaryButton({
  href,
  children,
  delay = 0.2,
}: {
  href: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-brand-900 text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-gray-800 transition inline-block text-center"
    >
      {children}
    </motion.a>
  );
}
