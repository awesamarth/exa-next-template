// src/app/api/similar/route.js
import { NextResponse } from 'next/server';
import Exa from 'exa-js';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url, options } = body;
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check for API key
    if (!process.env.EXA_API_KEY) {
      return NextResponse.json(
        { error: 'EXA_API_KEY is not configured in environment variables' }, 
        { status: 500 }
      );
    }

    // Initialize Exa client
    const exa = new Exa(process.env.EXA_API_KEY);
    
    // Call the findSimilar API with the provided URL and options
    const result = await exa.findSimilar(url, options);

    // Return the results
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error in Exa findSimilar API:', error);
    
    // Check if it's an API error with a response
    if (error.response) {
      return NextResponse.json(
        { 
          error: error.message || 'Failed to find similar websites',
          details: error.response.data
        }, 
        { status: error.response.status || 500 }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { error: error.message || 'Failed to find similar websites' }, 
      { status: 500 }
    );
  }
}