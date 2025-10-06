import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import {streamAI} from "@/utils";

export async function POST(request: Request) {
        const { question } = await request.json();

        if (!question || !question.trim()) {
            return Response.json({ error: 'No question provided' }, {status: 400});
        }

        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
        });

        let relevantDocs;

        try {
            const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
                url: process.env.QDRANT_URL || "http://localhost:6333",
                collectionName: "pdf-documents",
            });

            relevantDocs = await vectorStore.similaritySearch(question, 4);
        } catch (qdrantError) {
            console.error('Qdrant connection failed:', qdrantError);
            return Response.json({ error: 'Vector database unavailable. Please ensure Qdrant is running or upload a PDF first.' }, {status: 503});
        }

        if (!relevantDocs || relevantDocs.length === 0) {
            return Response.json({ error: 'No PDF content available. Please upload a PDF first.' }, {status: 400});
        }

        const context = relevantDocs
            .map(doc => doc.pageContent)
            .join('\n\n');

        return streamAI([
            new SystemMessage(`You are a helpful assistant answering questions about uploaded PDF documents. Use only the information from the provided document context to answer questions. If the answer is not in the document context, say so clearly.

Context from PDF documents:
${context}`),
            new HumanMessage(question)
        ]);
}