import {BaseMessage} from "@langchain/core/messages";
import {ChatOpenAI} from "@langchain/openai";

export async function streamAI(messages: BaseMessage[]) {
    const model = new ChatOpenAI({ model: "gpt-4" });
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