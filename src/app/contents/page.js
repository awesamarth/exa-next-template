// src/app/contents/page.js
"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ContentsPage() {
    const [url, setUrl] = useState("https://exa.ai");
    const [maxCharacters, setMaxCharacters] = useState(500);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [envCopied, setEnvCopied] = useState(false);
    const [resultsCopied, setResultsCopied] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [highlightsEnabled, setHighlightsEnabled] = useState(false);
    const [summaryEnabled, setSummaryEnabled] = useState(false);

    const handleFetch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/contents/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    url,
                    options: {
                        text: { maxCharacters: parseInt(maxCharacters) },
                        highlights: highlightsEnabled,
                        summary: summaryEnabled
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const copyResults = () => {
        if (results) {
            navigator.clipboard.writeText(JSON.stringify(results, null, 2));
            setResultsCopied(true);
            setTimeout(() => setResultsCopied(false), 2000);
        }
    };

    const codeExample = `import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

const result = await exa.getContents(
  ["${url}"],
  {
    text: {
      maxCharacters: ${maxCharacters}
    }${highlightsEnabled ? ',\n    highlights: true' : ''}${summaryEnabled ? ',\n    summary: true' : ''}
  }
)`;

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 md:py-28">
            <main className="flex flex-col gap-4 max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-5xl mb-2 font-[family-name:var(--font-newsreader)]">Exa AI <span className="text-[#3353F4]">Contents</span></h1>

                <div className="mb-2">
                    <p className="text-lg mb-2">
                        Retrieve full page contents, summaries, and metadata for any URL using Exa's content fetching capabilities.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL to fetch"
                            className="rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 flex-grow 
                            bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30"
                        />
                        <button
                            onClick={handleFetch}
                            disabled={loading}
                            className="rounded-sm hover:cursor-pointer border border-solid border-transparent transition-colors 
                            flex items-center justify-center bg-foreground text-background gap-2 
                            hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base 
                            h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        >
                            {loading ? 'Fetching...' : 'Fetch Content'}
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-sm font-medium flex items-center gap-1 w-fit"
                    >
                        <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        >
                            <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Advanced Options
                    </button>

                    {showAdvanced && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-black/[.08] dark:border-white/[.145] rounded-md">
                            <div>
                                <label className="block text-sm font-medium mb-1">Max Characters</label>
                                <input
                                    type="number"
                                    value={maxCharacters}
                                    onChange={(e) => setMaxCharacters(e.target.value)}
                                    className="w-full rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2
                                    bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="highlights"
                                        checked={highlightsEnabled}
                                        onChange={(e) => setHighlightsEnabled(e.target.checked)}
                                        className="rounded"
                                    />
                                    <label htmlFor="highlights" className="text-sm">Enable Highlights</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="summary"
                                        checked={summaryEnabled}
                                        onChange={(e) => setSummaryEnabled(e.target.checked)}
                                        className="rounded"
                                    />
                                    <label htmlFor="summary" className="text-sm">Enable Summary</label>
                                </div>
                            </div>
                        </div>
                    )}

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

                {results && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Content Results</h2>
                            <button
                                onClick={copyResults}
                                className="bg-gray-700 hover:cursor-pointer hover:bg-gray-600 text-white rounded px-3 py-1.5 text-sm opacity-80 hover:opacity-100 transition-all flex items-center gap-1"
                                aria-label="Copy results"
                            >
                                {resultsCopied ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.188 2.602C16.0018 2.41148 15.7793 2.26011 15.5338 2.15673C15.2882 2.05334 15.0244 2.00003 14.758 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Copy JSON
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Content Display */}
                        {results.data?.results?.map((result, index) => (
                            <div key={index} className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    {result.favicon && (
                                        <img 
                                            src={result.favicon} 
                                            alt="Favicon" 
                                            className="w-6 h-6 rounded"
                                            onError={(e) => e.target.style.display = 'none'} 
                                        />
                                    )}
                                    <h3 className="font-bold text-lg">{result.title || 'Untitled'}</h3>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                                    {result.url && (
                                        <a 
                                            href={result.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            {result.url}
                                        </a>
                                    )}
                                    {result.publishedDate && (
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Published: {new Date(result.publishedDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    {result.author && (
                                        <span className="text-gray-600 dark:text-gray-400">
                                            By: {result.author}
                                        </span>
                                    )}
                                </div>

                                {result.image && (
                                    <div className="mb-3">
                                        <img 
                                            src={result.image} 
                                            alt={result.title || "Page image"} 
                                            className="max-h-40 rounded object-contain bg-gray-100 dark:bg-gray-800"
                                            onError={(e) => e.target.style.display = 'none'} 
                                        />
                                    </div>
                                )}

                                {/* Content Sections */}
                                <div className="space-y-4">
                                    {/* Text Content */}
                                    {result.text && (
                                        <div>
                                            <h4 className="font-semibold text-base mb-2">Text Content</h4>
                                            <div className="bg-black/[.05] dark:bg-white/[.06] p-3 rounded-md max-h-[300px] overflow-y-auto text-sm">
                                                <pre className="whitespace-pre-wrap font-[family-name:var(--font-geist-mono)]">{result.text}</pre>
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary if available */}
                                    {result.summary && (
                                        <div>
                                            <h4 className="font-semibold text-base mb-2">Summary</h4>
                                            <div className="bg-black/[.05] dark:bg-white/[.06] p-3 rounded-md text-sm">
                                                <p>{result.summary}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Highlights if available */}
                                    {result.highlights && result.highlights.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-base mb-2">Highlights</h4>
                                            <div className="space-y-2">
                                                {result.highlights.map((highlight, i) => (
                                                    <div key={i} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-sm border border-yellow-200 dark:border-yellow-800">
                                                        <p>{highlight}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Cost Information */}
                        {results.data?.costDollars && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-md">
                                <p className="text-sm flex items-start">
                                    <span className="mr-2">💰</span>
                                    <span>API Cost: ${results.data.costDollars.total}</span>
                                </p>
                            </div>
                        )}
                        
                        {/* Raw JSON view */}
                        <details className="mt-4">
                            <summary className="cursor-pointer p-2 bg-black/[.05] dark:bg-white/[.06] rounded-md mb-2 font-medium">
                                View Raw JSON Response
                            </summary>
                            <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-md overflow-auto max-h-[400px]">
                                <pre className="text-sm font-[family-name:var(--font-geist-mono)] whitespace-pre-wrap">
                                    {JSON.stringify(results, null, 2)}
                                </pre>
                            </div>
                        </details>
                    </div>
                )}

                <div className="mt-8 p-6 border border-black/[.08] dark:border-white/[.145] rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Using the Contents API</h2>
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
                            Edit the API route at <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)]">/api/contents/route.js</code>
                        </li>
                        <li>
                            The Contents API allows you to fetch full page content, summaries, and highlights from any URL
                        </li>
                        <li>
                            Use the advanced options to enable summaries, highlights, or adjust the amount of text returned
                        </li>
                    </ol>
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-start">
                            <span className="mr-2">⚠️</span>
                            <span>The contents API is great for retrieving the full text of web pages, but be mindful of rate limits and costs when fetching large amounts of content.</span>
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