import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const theImage = formData.get("theImage");

    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
        {
            headers: { Authorization: `Bearer ${process.env.HF_APIKEY}` },
            method: "POST",
            body: theImage,
        }
    );

    const result = await response.json();

    return NextResponse.json({ body: result });
}
