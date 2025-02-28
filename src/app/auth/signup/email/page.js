"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupEmail() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    // Load the email from local storage if it exists
    useEffect(() => {
        const savedEmail = localStorage.getItem("signupEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleNext = async(e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const { data, error: searchError } = await supabase
                .from('profiles_with_email')
                .select('email')
                .eq('email', email)
                .limit(1);

            if (searchError) {
                console.error("Error checking email:", searchError);
                setError("An error occurred. Please try again.");
                return;
            }

            if (data && data.length > 0) {
                setError("This email is already registered. Please use a different email or sign in.");
                return;
            }

            localStorage.setItem("signupEmail", email);
            router.push("/auth/signup/name");
        } catch (error) {
            console.error("Error signing up:", error);
            setError("An error occurred. Please try again.");
        }
    };

    const handleBack = () => {
        router.push("/");
    };


    return (
        <main className="bg-light">
            <OnboardingForm
                question="What's your email address?"
                description="This is how you'll log in and stay updated -- promise we won't spam."
                currentStep={1}
                totalSteps={5}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onSubmit={handleNext}
                onBack={handleBack}
                error={error}
                type="email"
                placeholder="Type your email here..."
            />
        </main>
        
    );
}