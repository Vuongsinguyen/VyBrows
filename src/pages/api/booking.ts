// API route for development testing
export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();
    
    // Log booking data for development
    console.log('=== BOOKING SUBMISSION (DEV MODE) ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('======================================');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response with mock data
    return new Response(JSON.stringify({
      success: true,
      message: 'Booking submitted successfully (development mode)',
      sheetUpdated: false, // In dev mode, no actual sheet update
      data: data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Booking API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}