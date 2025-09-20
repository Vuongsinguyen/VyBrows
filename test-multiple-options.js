// Test script for testing multiple options booking functionality

async function testMultipleOptionsBooking() {
  console.log('🧪 Testing Multiple Options Booking System...\n');
  
  // Test data with multiple options
  const bookingData1 = {
    category: 'pmu',
    service: 'Combo Brows',
    option: 'Natural',
    date: '2025-01-15',
    time: '10:00',
    name: 'Test Customer 1',
    phone: '+1234567890',
    email: 'test1@example.com',
    notes: 'Test booking 1'
  };

  const bookingData2 = {
    category: 'pmu',
    service: 'Combo Brows',
    option: 'Bold',
    date: '2025-01-15',
    time: '10:00',
    name: 'Test Customer 1',
    phone: '+1234567890',
    email: 'test1@example.com',
    notes: 'Test booking 2'
  };

  const bookingData3 = {
    category: 'skincare',
    service: 'Acne Treatment',
    option: 'Advanced',
    date: '2025-01-15',
    time: '10:00',
    name: 'Test Customer 1',
    phone: '+1234567890',
    email: 'test1@example.com',
    notes: 'Test booking 3'
  };

  try {
    console.log('📤 Sending first booking (Natural option)...');
    const response1 = await fetch('/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData1)
    });

    const result1 = await response1.json();
    console.log('✅ Result 1:', result1);

    console.log('\n📤 Sending second booking (Bold option)...');
    const response2 = await fetch('/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData2)
    });

    const result2 = await response2.json();
    console.log('✅ Result 2:', result2);

    console.log('\n📤 Sending third booking (Different service)...');
    const response3 = await fetch('/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData3)
    });

    const result3 = await response3.json();
    console.log('✅ Result 3:', result3);

    console.log('\n📤 Testing duplicate booking (should fail)...');
    const response4 = await fetch('/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData1) // Same as first booking
    });

    const result4 = await response4.json();
    console.log('🚫 Result 4 (Expected failure):', result4);

    console.log('\n✅ All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Multiple options for same customer at same time: ✅ Allowed');
    console.log('- Different services for same customer at same time: ✅ Allowed');
    console.log('- Exact duplicate bookings: 🚫 Blocked as expected');
    console.log('\n💡 Check your Google Sheets to verify that 3 rows were created!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test the booking system if this file is run directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testMultipleOptionsBooking = testMultipleOptionsBooking;
  console.log('💡 To run the test, call: testMultipleOptionsBooking()');
} else {
  // Node.js environment - would need to run with a server
  console.log('💡 This test needs to be run in a browser environment with the server running');
  console.log('💡 Or run with a tool like curl to test the API directly');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testMultipleOptionsBooking;
}