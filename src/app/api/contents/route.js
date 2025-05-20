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
    
    // Prepare options for the API call
    const contentOptions = {};
    
    // Configure text options
    if (options?.text) {
      if (typeof options.text === 'boolean' && options.text) {
        contentOptions.text = true;
      } else if (typeof options.text === 'object') {
        contentOptions.text = options.text;
      }
    }
    
    // Configure highlights option
    if (options?.highlights) {
      contentOptions.highlights = true;
    }
    
    // Configure summary option
    if (options?.summary) {
      contentOptions.summary = true;
    }
    
    // Make the API call to fetch content
    const result = await exa.getContents(
      [url], // API expects an array of URLs
      contentOptions
    );

    // Return the results
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error in Exa contents API:', error);
    
    // Check if it's an API error with a response
    if (error.response) {
      return NextResponse.json(
        { 
          error: error.message || 'Failed to fetch content',
          details: error.response.data
        }, 
        { status: error.response.status || 500 }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' }, 
      { status: 500 }
    );
  }
}