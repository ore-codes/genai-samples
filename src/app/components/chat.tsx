'use client';

import {useCallback, useState} from "react";

export default function Chat() {
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState('');

    const send = useCallback(async () => {
        if (!prompt.trim()) return;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: prompt.trim() }),
        });

        if (!response.body) throw new Error('No response body');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            setOutput(str => str + chunk);
        }
    }, [prompt]);

    return (
        <details className="shadow p-4 rounded border border-gray-300">
            <summary className="font-semibold text-xl">Storyline:</summary>
            <div className="flex flex-col gap-4 items-start mt-6">
                <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what the story should be about" className="border rounded px-4 py-2 text-lg"/>
                <button onClick={send} className="px-4 py-2 bg-gray-700 text-white rounded">Submit</button>
                <div className="p-4 bg-[#ddd] rounded">
                    <pre className="font-mono whitespace-pre-line">{output}</pre>
                </div>
            </div>
        </details>
    );
}