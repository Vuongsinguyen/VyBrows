async function testBookingAPI() {
  const testData = {
    services: ["full-face-waxing"],
    options: {"full-face-waxing": "Full Face Waxing"},
    serviceNames: {"full-face-waxing": "Full Face Waxing"},
    date: "2025-09-21",
    time: "14:00",
    name: "Test User",
    phone: "0938222787",
    email: "test@test.com",
    notes: "Test multiple options",
    category: "featured"
  };

  try {
    console.log('Testing booking API...');
    console.log('Data to send:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:8888/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Error:', error);
  }
}

testBookingAPI();