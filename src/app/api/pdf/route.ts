import {OpenAIEmbeddings} from "@langchain/openai";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {QdrantVectorStore} from "@langchain/qdrant";
import {streamAI} from "@/utils";

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
        return Response.json({error: 'No PDF file uploaded'}, {status: 400});
    }

    if (file.type !== "application/pdf") {
        return Response.json({error: "Invalid file type"}, {status: 400});
    }

    const pdfLoader = new PDFLoader(file);
    const docs = await pdfLoader.load();

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    const qdrantConfig: any = {
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: "pdf-documents",
    };

    if (process.env.QDRANT_API_KEY) {
        qdrantConfig.apiKey = process.env.QDRANT_API_KEY;
    }

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, qdrantConfig);

    await vectorStore.addDocuments(docs);

    const fullText = docs.map(doc => doc.pageContent).join('\n\n');

    return streamAI([
        new SystemMessage('You are a helpful assistant that creates concise summaries of documents. Provide a clear, structured summary that captures the main points and key information.'),
        new HumanMessage(`Please summarize this PDF document:\n\n${fullText.slice(0, 8000)}`)
    ]);
}