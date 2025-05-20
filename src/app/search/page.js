// src/app/search/page.js
"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SearchPage() {
    const [query, setQuery] = useState("blog post about AI");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [envCopied, setEnvCopied] = useState(false);
    const [expandedResult, setExpandedResult] = useState(null);
    const resultsRef = useRef(null);
    const [resultsCopied, setResultsCopied] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/search/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const codeExample = `import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

const result = await exa.searchAndContents(
  "${query}",
  {
    text: true
  }
)`;

    const copyResults = () => {
        if (results) {
            navigator.clipboard.writeText(JSON.stringify(results, null, 2));
            setResultsCopied(true);
            setTimeout(() => setResultsCopied(false), 2000);
        }
    };

    const formatUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return `${urlObj.hostname}${urlObj.pathname.length > 20 ? urlObj.pathname.substring(0, 20) + '...' : urlObj.pathname}`;
        } catch (e) {
            return url;
        }
    };

    return (
        <div className="min-h-screen p-8  pb-20 gap-16 sm:p-20 md:py-28 ">
            <main className="flex flex-col gap-4 max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-5xl mb-2 font-[family-name:var(--font-newsreader)]">Exa AI <span className="text-[#3353F4]">Search</span></h1>

                <div className="mb-2">
                    <p className="text-lg mb-2">
                        This demo shows how to integrate Exa's semantic search capabilities with Next.js.
                        Enter a search query below to see real results from the Exa API.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter search query"
                            className="rounded-md border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 flex-grow 
                        bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-foreground/30"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="rounded-sm hover:cursor-pointer border border-solid border-transparent transition-colors 
                        flex items-center justify-center bg-foreground text-background gap-2 
                        hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base 
                        h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    <div className="bg-[#131313] p-4 rounded-md overflow-auto relative">
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
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                backgroundColor: '#131313'
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
                        This code example updates in real-time based on your search query.
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
                            <h2 className="text-xl font-bold">Search Results</h2>
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

                        <div className="space-y-4 mb-4">
                            {results.results && results.results.map((result, index) => (
                                <div key={index} className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 hover:border-black/[.15] dark:hover:border-white/[.25] transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{result.title || 'Untitled'}</h3>
                                        <span className="text-sm opacity-60">{result.score ? `Score: ${result.score.toFixed(2)}` : ''}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-2 text-sm">
                                        {result.url && (
                                            <a
                                                href={result.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {formatUrl(result.url)}
                                            </a>
                                        )}
                                        {result.publishedDate && (
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {new Date(result.publishedDate).toLocaleDateString()}
                                            </span>
                                        )}
                                        {result.author && (
                                            <span className="text-gray-600 dark:text-gray-400">
                                                By: {result.author}
                                            </span>
                                        )}
                                    </div>

                                    {result.text && (
                                        <>
                                            <p className="text-sm line-clamp-3 mb-2">
                                                {result.text.substring(0, 200)}...
                                            </p>
                                            <button
                                                onClick={() => setExpandedResult(expandedResult === index ? null : index)}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                {expandedResult === index ? 'Show Less' : 'Show More'}
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`transition-transform ${expandedResult === index ? 'rotate-180' : ''}`}
                                                >
                                                    <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>

                                            {expandedResult === index && (
                                                <div className="mt-3 bg-black/[.05] dark:bg-white/[.06] p-3 rounded-md max-h-[300px] overflow-y-auto font-[family-name:var(--font-geist-mono)] text-sm">
                                                    {result.text}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <details className="mt-4">
                            <summary className="cursor-pointer p-2 bg-black/[.05] dark:bg-white/[.06] rounded-md mb-2 font-medium">
                                View Raw JSON Response
                            </summary>
                            <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-md overflow-auto max-h-[400px]" ref={resultsRef}>
                                <pre className="text-sm font-[family-name:var(--font-geist-mono)] whitespace-pre-wrap">
                                    {JSON.stringify(results, null, 2)}
                                </pre>
                            </div>
                        </details>
                    </div>
                )}

                <div className="mt-8 p-6 border border-black/[.08] dark:border-white/[.145] rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Using This Template</h2>
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
                            Edit the API route at <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)]">/api/search/route.js</code>
                        </li>
                        <li>
                            Customize search parameters in the API route to adjust result count, format, or search type
                        </li>
                        <li>
                            Modify the UI as needed to display specific data from the search results
                        </li>
                    </ol>
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-start">
                            <span className="mr-2">⚠️</span>
                            <span>Remember to keep your API key secure by using server-side API routes instead of exposing it in client-side code.</span>
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