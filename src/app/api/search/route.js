import { NextResponse } from 'next/server';
import Exa from 'exa-js';

export async function POST(request) {
  try {
    // Parse the request body
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Initialize Exa with API key from environment variables
    const exa = new Exa(process.env.EXA_API_KEY);
    
    if (!process.env.EXA_API_KEY) {
      return NextResponse.json(
        { error: 'EXA_API_KEY is not configured in environment variables' }, 
        { status: 500 }
      );
    }

    // Perform the search using Exa's API
    const results = await exa.searchAndContents(
      query,
      {
        text: true, // Include the full text content
        highlights: true, // Include highlighted sections of text
        numResults: 10, // Number of results to return
      }
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in Exa search API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform search' }, 
      { status: 500 }
    );
  }
}