// src/app/answer/page.js
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';


export default function AnswerPage() {
    const [query, setQuery] = useState("What makes some LLMs so much better than others?");
    const [model, setModel] = useState("exa");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [includeText, setIncludeText] = useState(false);
    const [outputSchema, setOutputSchema] = useState("");
    const [streamingText, setStreamingText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [envCopied, setEnvCopied] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [citations, setCitations] = useState([]);
    const [isComplete, setIsComplete] = useState(false);

    const handleAnswer = async () => {
        setLoading(true);
        setError(null);
        setStreamingText("");
        setCitations([]);
        setIsComplete(false);

        try {
            // Prepare the request options
            const options = {
                model,
                query,
            };

            if (systemPrompt) {
                options.systemPrompt = systemPrompt;
            }

            if (includeText) {
                options.includeText = true;
            }

            if (outputSchema) {
                try {
                    options.outputSchema = JSON.parse(outputSchema);
                } catch (e) {
                    throw new Error('Invalid output schema JSON');
                }
            }

            // Stream mode
            const response = await fetch('/api/answer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options),
            });

            if (!response.ok) {
                throw new Error('Answer generation failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let done = false;
            let responseText = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                if (value) {
                    const chunk = decoder.decode(value);
                    try {
                        // Try to parse JSON from the chunk (for citations)
                        if (chunk.startsWith('{') && chunk.includes('citations')) {
                            const data = JSON.parse(chunk);
                            if (data.citations) {
                                setCitations(data.citations);
                            }
                        } else {
                            // Regular text chunk
                            responseText += chunk;
                            setStreamingText(responseText);
                        }
                    } catch (e) {
                        // If not valid JSON, treat as text
                        responseText += chunk;
                        setStreamingText(responseText);
                    }
                }
            }

            setIsComplete(true);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const codeExample = `import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "https://api.exa.ai",
  apiKey: process.env.EXA_API_KEY,
});

const completion = await client.chat.completions.create({
  model: "${model}",
  messages: [
    {
      "role": "user",
      "content": "${query}"
    }
  ],
  stream: true${systemPrompt ? `,
  system: "${systemPrompt}"` : ''}${includeText ? `,
  includeText: true` : ''}${outputSchema ? `,
  outputSchema: ${outputSchema}` : ''}
});`;

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 md:py-28">
            <main className="flex flex-col gap-4 max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-5xl mb-2 font-[family-name:var(--font-newsreader)]">Exa AI <span className="text-[#3353F4]">Answer</span></h1>

                <div className="mb-2">
                    <p className="text-lg mb-2">
                        Get AI-generated answers to questions with citations backed by Exa's powerful search capabilities.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your question"
                            rows={3}
                            className="rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 
                            bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30 resize-none w-full"
                        />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 ">Model</label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full  hover:cursor-pointer rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2
                                    bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30"
                                >
                                    <option value="exa">exa</option>
                                    <option value="exa-pro">exa-pro (more comprehensive)</option>
                                </select>
                            </div>

                            <button
                                onClick={handleAnswer}
                                disabled={loading}
                                className="rounded-sm hover:cursor-pointer border border-solid border-transparent transition-colors 
                                flex items-center justify-center bg-foreground text-background gap-2 
                                hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base 
                                h-10 px-4 sm:px-5 sm:w-auto self-end"
                            >
                                {loading ? 'Generating...' : 'Generate Answer'}
                            </button>
                        </div>

                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-sm hover:cursor-pointer font-medium flex items-center gap-1 w-fit"
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                            >
                                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Advanced Options
                        </button>

                        {showAdvanced && (
                            <div className="grid grid-cols-1 gap-4 p-4 border border-black/[.08] dark:border-white/[.145] rounded-md">
                                <div>
                                    <label className="block text-sm font-medium mb-1">System Prompt</label>
                                    <textarea
                                        value={systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                        placeholder="Custom instructions that control how the LLM responds"
                                        rows={3}
                                        className="w-full rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2
                                        bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Output Schema (JSON)</label>
                                    <textarea
                                        value={outputSchema}
                                        onChange={(e) => setOutputSchema(e.target.value)}
                                        placeholder="JSON Schema that defines the structure of how the LLM responds"
                                        rows={3}
                                        className="w-full rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2
                                        bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30 resize-none font-[family-name:var(--font-geist-mono)]"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="includeText"
                                        checked={includeText}
                                        onChange={(e) => setIncludeText(e.target.checked)}
                                        className="rounded"
                                    />
                                    <label htmlFor="includeText" className="text-sm">Include webpage text for citations</label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-md overflow-auto relative">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(codeExample);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className="absolute top-2 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded p-1.5 opacity-80 hover:opacity-100 z-10 cursor-pointer transition-all"
                            aria-label="Copy code"
                        >
                            {copied ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.188 2.602C16.0018 2.41148 15.7793 2.26011 15.5338 2.15673C15.2882 2.05334 15.0244 2.00003 14.758 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                        <SyntaxHighlighter
                            language="javascript"
                            style={vscDarkPlus}
                            showLineNumbers={true}
                            customStyle={{
                                margin: 0,
                                backgroundColor: 'transparent',
                                fontSize: '1rem'
                            }}
                            codeTagProps={{
                                style: {
                                    fontSize: '16px',
                                }
                            }}
                        >
                            {codeExample}
                        </SyntaxHighlighter>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        This code example updates as you change your parameters.
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                {(streamingText || loading) && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Answer</h2>
                        </div>

                        {/* Answer Display */}
                        <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6 mb-4">
                            <div className="prose dark:prose-invert max-w-none leading-relaxed">
                                {loading ? (
                                    <>
                                        <ReactMarkdown>{streamingText}</ReactMarkdown>
                                        <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1"></span>
                                    </>
                                ) : (
                                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                                )}
                            </div>
                        </div>

                        {/* Citations */}
                        {citations && citations.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold mb-3">Citations</h3>
                                <div className="space-y-4">
                                    {citations.map((citation, index) => (
                                        <div key={index} className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 hover:border-black/[.15] dark:hover:border-white/[.25] transition-all">
                                            <div className="flex items-start mb-2">
                                                {citation.favicon && (
                                                    <img
                                                        src={citation.favicon}
                                                        alt="Favicon"
                                                        className="w-4 h-4 mr-2 mt-1"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                )}
                                                <h4 className="font-bold">{citation.title || 'Untitled Source'}</h4>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-2 text-sm">
                                                <a
                                                    href={citation.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    {citation.url}
                                                </a>
                                            </div>

                                            {citation.publishedDate && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    Published: {new Date(citation.publishedDate).toLocaleDateString()}
                                                </p>
                                            )}

                                            {citation.author && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    By: {citation.author}
                                                </p>
                                            )}

                                            {citation.snippet && (
                                                <div className="mt-2 bg-black/[.05] dark:bg-white/[.06] p-3 rounded-md text-sm">
                                                    <p>{citation.snippet}</p>
                                                </div>
                                            )}

                                            {/* Show full text if available and requested */}
                                            {includeText && citation.text && (
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-sm font-medium">
                                                        View Full Text
                                                    </summary>
                                                    <div className="mt-2 bg-black/[.05] dark:bg-white/[.06] p-3 rounded-md max-h-[200px] overflow-y-auto text-xs">
                                                        <pre className="whitespace-pre-wrap font-[family-name:var(--font-geist-mono)]">{citation.text}</pre>
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 p-6 border border-black/[.08] dark:border-white/[.145] rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Using the Answer API</h2>
                    <ol className="list-decimal list-inside space-y-3">
                        <li>
                            Set up your Exa API key in <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)]">.env.local</code>:
                            <div className="relative mt-2 ml-6">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText("EXA_API_KEY=your_api_key_here");
                                        setEnvCopied(true);
                                        setTimeout(() => setEnvCopied(false), 2000);
                                    }}
                                    className="absolute top-1 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded p-1.5 opacity-80 hover:opacity-100 z-10 cursor-pointer transition-all"
                                    aria-label="Copy API key code"
                                >
                                    {envCopied ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.188 2.602C16.0018 2.41148 15.7793 2.26011 15.5338 2.15673C15.2882 2.05334 15.0244 2.00003 14.758 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                                <pre className="bg-black/[.05] dark:bg-white/[.06] p-3 pr-10 rounded font-[family-name:var(--font-geist-mono)] text-sm">EXA_API_KEY=your_api_key_here</pre>
                            </div>
                        </li>
                        <li>
                            Edit the API route at <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)]">/api/answer/route.js</code>
                        </li>
                        <li>
                            The Answer API generates AI responses backed by Exa's powerful search technology
                        </li>
                        <li>
                            Use the advanced options to customize how the answer is generated with system prompts and output schemas
                        </li>
                        <li>
                            Responses are streamed in real-time for a better user experience
                        </li>
                    </ol>
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-start">
                            <span className="mr-2">⚠️</span>
                            <span>The Answer API uses an OpenAI-compatible interface. For production applications, consider implementing proper error handling and retry logic.</span>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="mt-16 text-center text-sm text-gray-500">
                <p>Built with Exa AI and Next.js</p>
                <p className="mt-2">
                    <Link
                        href="https://exa.ai/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        View Exa Documentation
                    </Link>
                </p>
            </footer>
        </div>
    );
}