'use client';

import {useCallback, useState} from "react";

export default function Translate() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const translate = useCallback(async () => {
        if (!text.trim()) return;
        const data = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text.trim() }),
        });
        const res = await data.json();
        setResult(res.response);
    }, [text]);

    return (
        <details className="shadow p-4 rounded border border-gray-300">
            <summary className="font-semibold text-xl">Translate:</summary>
            <div className="flex flex-col gap-4 items-start mt-6">
                <input value={text} onChange={(e) => setText(e.target.value)} className="border rounded px-4 py-2 text-lg"/>
                <button onClick={translate} className="px-4 py-2 bg-gray-700 text-white rounded">Submit</button>
                <div>Yoruba: <strong>{result}</strong></div>
            </div>
        </details>
    )
}