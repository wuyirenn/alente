"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib"; 
import OnboardingForm from "@/components/OnboardingForm";
import { Eye, EyeOff } from "lucide-react";

export default function SignupEmail() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    

    // Validate password
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (password.length < minLength) return "Password must be at least 8 characters long.";
        if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
        if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
        if (!hasNumbers) return "Password must contain at least one number.";
        if (!hasSpecialChar) return "Password must contain at least one special character.";
        return null;
    };
            
    // Finalize signup
    const handleNext = async (e) => {
        e.preventDefault();
        setError("");

        // Validate password requirements
        const validationError = validatePassword(password);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const email = localStorage.getItem("signupEmail");
            const name = localStorage.getItem("signupName");
            const username = localStorage.getItem("signupUsername");
            console.log(email, name, username);

            const { data, error: signupError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        username: username
                    }
                }
            });

            if (signupError) throw signupError;

            // Ensure user data is returned
            if (!data?.user) {
                throw new Error("No user data returned from signup");
            }

            // Create a new profile in the database
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert([
                    {
                        user_id: data.user.id,
                        email: email,
                        name: name,
                        username: username
                    }
                ]);

            if (profileError) throw profileError;

            // Clear session storage
            localStorage.removeItem("signupEmail");
            localStorage.removeItem("signupName");
            localStorage.removeItem("signupUsername");

            // Redirect to the home page
            router.push("/signup/verify-email");
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again.");
            }
    };

    const handleBack = () => {
        router.push("/signup/username");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle password change
    const handlePasswordChange = (value) => {
        setPassword(value);
        const validationError = validatePassword(value);
        if (validationError) {
            setError(validationError);
        } else {
            setError("");
        }
    };

    // Render the component
    return (
        <main className="bg-light">
            <OnboardingForm
                question={validatePassword(password) === null ? "Confirm your password" : "Create a secure password"}
                description={validatePassword(password) === null ? 
                    "Please re-enter your password to confirm." :
                    "Must be 8+ characters long and include an uppercase, lowercase, number, and special character."
                }
                currentStep={4}
                totalSteps={4}
                fields={[
                    {
                        question: validatePassword(password) === null ? "Confirm your password." : "Create a secure password.",
                        description: validatePassword(password) === null ? 
                            "Please re-enter your password to confirm." :
                            "Must be 8+ characters long and include an uppercase, lowercase, number, and special character.",
                        type: showPassword ? "text" : "password",
                        value: password,
                        onChange: handlePasswordChange,
                        placeholder: "Enter your password...",
                        rightElement: (
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
                        )
                    },
                    ...(validatePassword(password) === null ? [{
                        question: "Confirm your password.",
                        description: "Please re-enter your password to confirm.",
                        type: showPassword ? "text" : "password", 
                        value: confirmPassword,
                        onChange: (value) => setConfirmPassword(value),
                        placeholder: "Confirm your password...",
                        rightElement: (
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
                        )
                    }] : [])
                ]}
                onSubmit={handleNext}
                onBack={handleBack}
                error={error}
            />
        </main>
    );
}