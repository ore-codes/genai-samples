import {NextRequest, NextResponse} from "next/server";

export async function POST(req:NextRequest) {
    const request = await req.json()
    const prompt = request.prompt as string;

    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_APIKEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({inputs: prompt}),
        }
    );

    const result = await response.blob();
    return new NextResponse(result)
}
