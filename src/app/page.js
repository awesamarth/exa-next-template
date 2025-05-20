"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [stepsCopied, setStepsCopied] = useState([false, false, false]);

  const copyStepCode = (code, index) => {
    navigator.clipboard.writeText(code);
    const newStepsCopied = [...stepsCopied];
    newStepsCopied[index] = true;
    setStepsCopied(newStepsCopied);
    setTimeout(() => {
      const resetStepsCopied = [...stepsCopied];
      resetStepsCopied[index] = false;
      setStepsCopied(resetStepsCopied);
    }, 2000);
  };

  const codeExample = `// In your backend (route.ts)
import { Exa } from 'exa-js'

// Initialize the Exa client
const exa = new Exa('YOUR_API_KEY')

// Search the web
const results = await exa.search('latest developments in ML', {
  category: 'papers',
  highlights: true
})`;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col items-center text-center">
            <h1 className="font-[family-name:var(--font-newsreader)] text-5xl md:text-7xl mb-8 tracking-tight leading-tight">
              The <span className="text-[#3353F4]">easiest way</span> to build with Exa AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mb-12">
              Everything you need to connect your product to web data. Start building AI applications with Exa's powerful search API and Next.js.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
              <Link
                href="/search"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#3353F4] text-white hover:bg-[#3353F4]/90 h-12 px-6 py-3 w-full"
              >
                Get Started
              </Link>
              <Link
                href="https://docs.exa.ai"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-6 py-3 w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mx-auto max-w-4xl bg-black dark:bg-slate-950 rounded-lg overflow-hidden shadow-xl">
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-white/70 text-sm font-[family-name:var(--font-geist-mono)]">
                  Exa AI + Next.js
                </div>
              </div>
              <div className="relative">
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
                    backgroundColor: '#000',
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
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="font-[family-name:var(--font-newsreader)] text-4xl md:text-5xl mb-16 text-center">
              Exa's core functionalities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "SEARCH",
                  description: "Find webpages using Exa's embeddings-based or Google-style keyword search.",
                  link: "/search",
                  icon: "🔍",
                },
                {
                  title: "CONTENTS",
                  description: "Obtain clean, up-to-date, parsed HTML from Exa search results.",
                  link: "/contents",
                  icon: "📄",
                },
                {
                  title: "FINDSIMILAR",
                  description: "Based on a link, find and return pages that are similar in meaning.",
                  link: "/findsimilar",
                  icon: "🔗",
                },
                {
                  title: "ANSWER",
                  description: "Get direct answers to questions using Exa's Answer API.",
                  link: "/answer",
                  icon: "💬",
                },
              ].map((feature, i) => (
                <Link
                  key={i}
                  href={feature.link}
                  className="group rounded-lg border border-border/60 bg-background dark:bg-[#333333] px-8 py-6 transition-all duration-300 hover:bg-background hover:border-border/80 shadow-sm hover:shadow-md"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="mb-3 text-xl font-bold uppercase tracking-wide">
                    {feature.title}{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      <ArrowRightIcon className="w-5 h-5" />
                    </span>
                  </h3>
                  <p className="m-0 max-w-[30ch] text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mx-auto max-w-4xl">
              <h2 className="font-[family-name:var(--font-newsreader)] text-4xl mb-12 text-center">
                Get started in minutes
              </h2>
              <div className="space-y-10">
                {[
                  {
                    step: 1,
                    title: "Create your project",
                    code: "npx create-exa-app my-exa-project",
                  },
                  {
                    step: 2,
                    title: "Add your API key",
                    code: "EXA_API_KEY=your_api_key_here",
                  },
                  {
                    step: 3,
                    title: "Start your development server",
                    code: "cd my-exa-project\nnpm run dev",
                  },
                ].map((item, index) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#3353F4] text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-xl mb-3">{item.title}</h3>
                      <div className="relative">
                        <button
                          onClick={() => copyStepCode(item.code, index)}
                          className="absolute top-2 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded p-1.5 opacity-80 hover:opacity-100 z-10 cursor-pointer transition-all"
                          aria-label={`Copy ${item.title} code`}
                        >
                          {stepsCopied[index] ? (
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
                          language="bash"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            backgroundColor: '#000'
                          }}
                          codeTagProps={{
                            style: {
                              fontSize: '16px',
                            }
                          }}
                          showLineNumbers={false}
                        >
                          {item.code}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/exa-logo.png"
              alt="Exa AI Logo"
              width={22}
              height={22}
            />
            <span className="text-base text-muted-foreground">
              © {new Date().getFullYear()} Exa Next.js Starter
            </span>
          </div>
          <div className="flex gap-8">
            <Link
              href="https://docs.exa.ai"
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/awesamarth/create-exa-app"
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href="https://exa.ai"
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Exa AI
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}