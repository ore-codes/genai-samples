"use client";
import { useEffect, useState } from "react";

export interface VoiceObject {
    available_for_tiers: string[];
    category: string;
    description: string;
    name: string;
    voice_id: string;
}

export default function Voice() {
    const [theText, setTheText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [arrayOfVoices, setArrayOfVoices] = useState< Array<VoiceObject> | undefined>();
    const [theVoiceId, setTheVoiceId] = useState<string | undefined>();
    const [theAudio, setTheAudio] = useState<string | undefined>();

    async function getGeneratedVoices() {
        const getResponse = await fetch("/api/voice", {
            method: "GET",
        });

        if (getResponse.ok) {
            const tempGenVoices = await getResponse.json();
            setArrayOfVoices(tempGenVoices.body);
        }
    }

    useEffect(() => {
        getGeneratedVoices();
    }, []);

    async function generateSpeech() {
        if (!theText || !theVoiceId) return;
        setIsLoading(true);

        try {
            const response = await fetch("/api/voice", {
                method: "POST",
                body: JSON.stringify({ text: theText, voiceId: theVoiceId }),
            });

            if (response.ok) {
                console.log("Speech generated successfully");

                const theResponse = await response.blob();
                setTheAudio(URL.createObjectURL(theResponse));
            } else {
                console.error("Failed to generate speech");
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }

        setIsLoading(false);
    }

    return (
        <details className="p-4 rounded border border-gray-300">
            <summary className="font-semibold text-xl cursor-pointer">Voice:</summary>
            <div className="mb-4">
                Uses the ElevenLabs API to convert your text into a
                speech dictated by a fake, AI-generated voice
            </div>
            <div className="space-y-2 mt-2">
                <div className="w-full">
                    <div>Choose a voice</div>
                    <div className="w-full              flex">
                        {arrayOfVoices ? (
                            <div className="flex gap-4">
                                {arrayOfVoices.map((e: VoiceObject) => (
                                    <button
                                        className={`border ${
                                            theVoiceId === e.voice_id ? "bg-gray-700 text-white" : ""
                                        }   px-2 my-2 rounded-sm  py-1`}
                                        onClick={() => setTheVoiceId(e.voice_id)}
                                        key={e.voice_id}
                                    >
                                        {e.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            "loading..."
                        )}
                    </div>
                </div>
                <textarea
                    className=" p-1 w-[40rem] text-black rounded-sm  border border-gray-600"
                    onChange={(event) => {
                        setTheText(event.target.value);
                    }}
                />
                <button
                    className="bg-gray-600 text-white px-5 mt-2 py-1 self-center h-max rounded-sm hover:bg-gray900 disabled:cursor-not-allowed disabled:bg-gray-900 transition-colors"
                    onClick={generateSpeech}
                    disabled={isLoading || !theText}
                >
                    {isLoading ? "Loading..." : "Go"}
                </button>
            </div>
            <div className="w-80 h-20 mt-12 relative placeholderdiv">
                {theAudio && (
                    <audio controls src={theAudio}>
                        Your browser does not support the audio tag
                    </audio>
                )}
            </div>
        </details>
    );
}