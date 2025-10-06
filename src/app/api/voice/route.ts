import {NextRequest, NextResponse} from "next/server";
import {VoiceObject} from "@/app/components/voice";

export async function GET() {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
            accept: "application/json",
            "xi-api-key": process.env.XI_API_KEY || "",
        },
        method: "GET",
    });

    const result = await response.json();

    const arrayOfGeneratedVoices = result.voices.filter(
        (element: VoiceObject) => element.category === "generated"
    );

    return NextResponse.json({ body: arrayOfGeneratedVoices });
}

export async function POST(req: NextRequest) {
    const request = await req.json();

    const theText = request.text;
    const theVoiceId = request.voiceId;

    const postData = {
        text: theText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0,
            use_speaker_boost: true,
        },
    };

    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${theVoiceId}`,
        {
            headers: {
                accept: "audio/mpeg",
                "xi-api-key": process.env.XI_API_KEY || "",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(postData),
        }
    );

    const result = await response.blob();
    return new NextResponse(result);
}