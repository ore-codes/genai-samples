'use client';

import { ChangeEvent, useCallback, useState } from "react";

export default function PdfReader() {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isAsking, setIsAsking] = useState(false);

    const handleFileUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            alert('Please select a PDF file');
            return;
        }

        setFile(selectedFile);
        setIsUploading(true);
        setSummary('');

        try {
            const formData = new FormData();
            formData.append('pdf', selectedFile);

            const response = await fetch('/api/pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.body) throw new Error('No response body');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let summaryText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                summaryText += chunk;
                setSummary(summaryText);
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            setSummary('Error processing PDF. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, []);

    const askQuestion = useCallback(async () => {
        if (!question.trim() || !file) return;

        setIsAsking(true);
        setAnswer('');

        try {
            const response = await fetch('/api/pdf/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question.trim() }),
            });

            if (!response.body) throw new Error('No response body');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let answerText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                answerText += chunk;
                setAnswer(answerText);
            }
        } catch (error) {
            console.error('Error asking question:', error);
            setAnswer('Error processing question. Please try again.');
        } finally {
            setIsAsking(false);
        }
    }, [question, file]);

    return (
        <details className="p-4 rounded border border-gray-300">
            <summary className="font-semibold text-xl cursor-pointer">Read PDF:</summary>
            <div className="flex flex-col gap-4 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload PDF
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="border rounded px-4 py-2 text-lg w-full"
                        disabled={isUploading}
                    />
                    {file && (
                        <p className="text-sm text-gray-600 mt-2">
                            Uploaded: {file.name}
                        </p>
                    )}
                </div>
                {(summary || isUploading) && (
                    <div>
                        <h3 className="font-medium text-lg mb-2">Summary:</h3>
                        <pre className="font-mono whitespace-pre-line bg-gray-100 p-4 rounded min-h-[100px]">
                            {isUploading ? 'Processing PDF and generating summary...' : summary}
                        </pre>
                    </div>
                )}
                {file && summary && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ask a question about the PDF
                        </label>
                        <div className="flex gap-4">
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="border rounded px-4 py-2 text-lg"
                                placeholder="What would you like to know about this document?"
                                disabled={isAsking}
                            />
                            <button
                                onClick={askQuestion}
                                disabled={isAsking || !question.trim()}
                                className="px-4 py-2 bg-gray-700 text-white rounded disabled:bg-gray-400"
                            >
                                {isAsking ? 'Asking...' : 'Ask'}
                            </button>
                        </div>
                    </div>
                )}
                {(answer || isAsking) && (
                    <div>
                        <h3 className="font-medium text-lg mb-2">Answer:</h3>
                        <pre className="font-mono whitespace-pre-line bg-blue-50 p-4 rounded min-h-[100px]">
                            {isAsking ? 'Processing your question...' : answer}
                        </pre>
                    </div>
                )}
            </div>
        </details>
    );
}