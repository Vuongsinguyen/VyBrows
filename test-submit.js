// Test script for booking submit functionality
// Run this in browser console to test the submit feature

const testBookingData = {
  category: 'pmu',
  service: 'Micro Blading',
  option: 'Nano',
  date: '2025-01-15',
  time: '14:30',
  name: 'Test Customer',
  phone: '+84 123 456 789',
  email: 'test@example.com',
  notes: 'Test booking from console'
};

async function testSubmitBooking() {
  console.log('🧪 Testing booking submit...');
  console.log('📤 Sending data:', testBookingData);

  try {
    const response = await fetch('/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBookingData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Submit successful!');
      console.log('📧 Emails sent to admin and customer');
      if (result.sheetUpdated) {
        console.log('📊 Data saved to Google Sheets');
      } else {
        console.log('⚠️ Google Sheets not configured (data logged to console)');
      }
    } else {
      console.error('❌ Submit failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Auto-run test after 2 seconds
setTimeout(() => {
  testSubmitBooking();
}, 2000);

console.log('🚀 Booking submit test script loaded!');
console.log('💡 Test will run automatically in 2 seconds...');
console.log('💡 Or run testSubmitBooking() manually to test now');