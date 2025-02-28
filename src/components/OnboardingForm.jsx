"use client";

import { useEffect } from "react";

export default function OnboardingForm({
    question,
    description,
    currentStep,
    totalSteps,
    value,
    onChange,
    onSubmit,
    onBack,
    error,
    placeholder = "Type your answer here...",
    type = "text",
    rightElement,
}) {
    const progressPercentage = (currentStep / totalSteps) * 100;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
            }
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                if (onBack) onBack();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                onChange({ target: {value: '' } });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onSubmit, onBack, onChange]);

    return (
        <main className="flex flex-col items-center justify-center w-full h-[100vh] bg-light">
            <div className="fixed top-0 left-0 w-full">
                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center items-start h-1/2 w-3/5 max-w-2xl mx-auto px-8">
                <p className="relative h-2 text-secondary-normal text-sm -left-8 -mb-3">
                    {currentStep}/{totalSteps}
                </p>
                <h1 className="text-2xl font-medium text-dark">
                    {question}
                </h1>

                { description && (!error) && (
                    <div className="text-sm text-gray-500">
                        {description}
                    </div>
                )}

                {error && (
                     <div className="text-primary text-sm">{error}</div>
                )}

                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(e);
                }} className="w-full mt-4">
                    <div>
                        <div className="relative">
                            <input 
                                type={type}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                className="w-full text-xl text-dark bg-transparent border-b-2 border-gray-300
                                pb-1 mb-4 focus:border-dark focus:outline-none transition-colors ease-in placeholder-gray-300"
                                autoFocus
                                required
                            />
                            {rightElement && (
                                <div className="absolute right-0 top-1/3">
                                    {rightElement}
                                </div>
                            )}
                        </div>
                        
                        <div className="relative flex gap-2">
                            <button
                                onClick={onSubmit}
                                className="py-1 px-6 outline outline-dark bg-transparent text-dark hover:bg-dark hover:text-light transition-colors rounded-sm"
                            >
                                Next
                            </button>
                            <p className="m-2 text-sm text-dark">press Enter ↵</p>
                            {onBack && (
                                <div
                                    className="absolute m-2 right-0 text-sm text-dark"
                                >
                                    ← Shift + Tab to return
                                </div>
                            )}
                        </div>
                    </div>

                    
                </form>
            </div>
        </main>
    );
}