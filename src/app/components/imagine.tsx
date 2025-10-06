'use client';

import {useState} from "react";

export default function Imagine() {
    const [thePrompt, setThePrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState("");

    const generateImage = async () => {
        if (!thePrompt) return;

        setIsLoading(true);

        try {
            const response = await fetch("/api/imagine", {
                method: "POST",
                body: JSON.stringify({ prompt: thePrompt }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setApiResponse(imageUrl);
            } else {
                console.error("Failed to generate image");
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }

        setIsLoading(false);
    };

    return (
        <details className="shadow p-4 rounded border border-gray-300">
            <summary className="font-semibold text-xl cursor-pointer">Imagine:</summary>
            <div className="mb-4">
                Uses Stable Diffusion to generate images from text prompts
            </div>
            <div>
                <input
                    type="text"
                    className="border p-1 text-black rounded-sm border-gray-600"
                    value={thePrompt}
                    onChange={(event) => {
                        setThePrompt(event.target.value);
                    }}
                />

                <button
                    className="bg-gray-600 px-5 py-1 ml-2 h-max rounded-sm disabled:cursor-not-allowed disabled:bg-gray-900 text-white transition-colors"
                    onClick={generateImage}
                    disabled={isLoading || !thePrompt}
                >
                    Go!{" "}
                </button>
            </div>
            <div className="w-80 h-80 relative">
                {apiResponse ? <img src={apiResponse} /> : ""}
            </div>
        </details>
    );
}