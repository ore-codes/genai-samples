import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
    const req = await request.json();

    const model = new ChatOpenAI({ model: "gpt-4" });
    const messages = [
        new SystemMessage('You are an award winning novelist. On request, generate stories of less than 2000 words based on my request.'),
        new HumanMessage(req.text),
    ];

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                const response = await model.stream(messages);

                for await (const chunk of response) {
                    controller.enqueue(encoder.encode(chunk.content as string));
                }

                controller.close();
            } catch (error) {
                controller.error(error);
            }
        },
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}