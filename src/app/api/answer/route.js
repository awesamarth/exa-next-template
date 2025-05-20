// src/app/api/answer/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { model, query, systemPrompt, includeText, outputSchema } = body;
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check for API key
    if (!process.env.EXA_API_KEY) {
      return NextResponse.json(
        { error: 'EXA_API_KEY is not configured in environment variables' }, 
        { status: 500 }
      );
    }

    // Initialize OpenAI client with Exa endpoint
    const client = new OpenAI({
      baseURL: "https://api.exa.ai",
      apiKey: process.env.EXA_API_KEY,
    });
    
    // Prepare the messages array
    const messages = [
      {
        role: "user",
        content: query
      }
    ];

    // Create completion options
    const completionOptions = {
      model: model || "exa",
      messages: messages,
      stream: true
    };

    // Add optional parameters if provided
    if (systemPrompt) {
      completionOptions.system = systemPrompt;
    }

    if (includeText) {
      completionOptions.includeText = true;
    }

    if (outputSchema) {
      completionOptions.outputSchema = outputSchema;
    }

    // Call the Exa API with streaming enabled
    const stream = await client.chat.completions.create(completionOptions);
    
    // Set up the response
    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        // Process the stream
        let collectedCitations = null;
        
        for await (const chunk of stream) {
          try {
            // Handle content chunks
            if (chunk.choices[0]?.delta?.content) {
              controller.enqueue(encoder.encode(chunk.choices[0].delta.content));
            }
            
            // Handle citations if they exist
            if (chunk.citations && !collectedCitations) {
              collectedCitations = chunk.citations;
            }
          } catch (error) {
            console.error("Error processing stream chunk:", error);
          }
        }
        
        // Send collected citations at the end if available
        if (collectedCitations) {
          controller.enqueue(encoder.encode('\n\n' + JSON.stringify({ citations: collectedCitations })));
        }
        
        // Close the stream
        controller.close();
      }
    });

    // Return the streaming response
    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in Exa answer API:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate answer' }, 
      { status: 500 }
    );
  }
}