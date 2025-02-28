"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm";

export default function SignupEmail() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const savedName = localStorage.getItem("signupName");
        if (savedName) {
            setName(savedName);
        }
    }, []);

    const handleNext = async(e) => {
        e.preventDefault();

        const MIN_NAME_LENGTH = 2;
        if (!name.trim() || name.trim().length < MIN_NAME_LENGTH) {
            setError(`Please enter a name with at least ${MIN_NAME_LENGTH} characters.`);
            return;
        }

        try {
            localStorage.setItem("signupName", name);
            router.push("/auth/signup/username");
        } catch (error) {
            console.error("Error signing up:", error);
            setError("An error occurred. Please try again.");
        }
    };

    const handleBack = () => {
        router.push("/auth/signup/email");
    };

    return (
        <main className="bg-light">
            <OnboardingForm
                question="Great! What should we call you?"
                description="Full name, nickname, anything goes!"
                currentStep={2}
                totalSteps={5}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onSubmit={handleNext}
                onBack={handleBack}
                error={error}
                type="text"
                placeholder="Type your name here..."
            />
        </main>
        
    );
}