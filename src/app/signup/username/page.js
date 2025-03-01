"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupUsername() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const savedUsername = localStorage.getItem("signupUsername");
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    const handleNext = async(e) => {
        e.preventDefault();

        const MIN_USERNAME_LENGTH = 4;
        const MAX_USERNAME_LENGTH = 20;
        const usernameRegex = /^[a-zA-Z0-9]+$/;

        if (!username.trim() || username.trim().length < MIN_USERNAME_LENGTH || username.trim().length > MAX_USERNAME_LENGTH) {
            setError(`Please enter a username between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`);
            return;
        }

        if (!usernameRegex.test(username)) {
            setError("Username can only contain letters, numbers, and underscores.");
            return;
        }

        try {
            const sanitizedUsername = username.trim().toLowerCase();

            const { data, error: searchError } = await supabase
                .from('profiles_with_email')
                .select('username')
                .eq('username', sanitizedUsername)
                .limit(1);
                
            if (searchError) {
                console.error("Error checking username:", searchError);
                setError("An error occurred. Please try again.");
                return;
            }

            if (data && data.length > 0) {
                setError("This username is already taken. Please choose another.");
                return;
            }
                    
            localStorage.setItem("signupUsername", sanitizedUsername);
            router.push("/signup/password");
        } catch (error) {
            console.error("Error signing up:", error);
            setError("An error occurred. Please try again.");
        }
    };

    const handleBack = () => {
        router.push("/signup/name");
    };

    return (
        <main className="bg-light">
            <OnboardingForm
                question="What would you like your username to be?"
                description="Choose something special! This will be your signature across the platform."
                currentStep={3}
                totalSteps={4}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onSubmit={handleNext}
                onBack={handleBack}
                error={error}
                type="text"
                placeholder="Type your username here..."
            />
        </main>
        
    );
}