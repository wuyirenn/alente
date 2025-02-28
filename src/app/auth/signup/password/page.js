"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye, EyeOff } from "lucide-react";

export default function SignupEmail() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (password.length < minLength) {
            return "Password must be at least 8 characters long.";
        }

        if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!hasLowerCase) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!hasNumbers) {
            return "Password must contain at least one number.";
        }

        if (!hasSpecialChar) {
            return "Password must contain at least one special character.";
        }
        return null;
    };
            
    const handleNext = async(e) => {
        e.preventDefault();
        setError("");

        const validationError = validatePassword(password);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            sessionStorage.setItem("tempPassword", password);
            router.push("/auth/signup/verify-password");
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again.");
        }
    };

    const handleBack = () => {
        router.push("/auth/signup/username");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <main className="bg-light">
            <OnboardingForm
                question="Create a secure password."
                description="Must be 8+ characters long and include uppercase, lowercase, number, and special character."
                currentStep={4}
                totalSteps={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onSubmit={handleNext}
                onBack={handleBack}
                error={error}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password..."
                rightElement={
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                }
            />
        </main>
    );
}