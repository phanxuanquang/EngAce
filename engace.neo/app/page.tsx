"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LocalStorageService } from "@/services/local-storage";
import { RegistrationFormComponent } from "@/components/registration/registration-form";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowForm, setShouldShowForm] = useState(false);

  useEffect(() => {
    // Check if user data exists
    const userData = LocalStorageService.getItem("formData", "registration");
    if (userData) {
      // User is already registered, redirect to home
      router.push("/home");
    } else {
      // No registration found, show the form
      setShouldShowForm(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {shouldShowForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          
          <RegistrationFormComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
