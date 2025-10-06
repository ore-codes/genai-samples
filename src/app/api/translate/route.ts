import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
    const req = await request.json();

    const model = new ChatOpenAI({ model: "gpt-4" });
    const messages = [
        new SystemMessage('You are a translator, convert everything I say to Yoruba.'),
        new HumanMessage(req.text),
    ];

    const res = await model.invoke(messages);

    return Response.json({ response: res.content });
}