const User = require('./models/User');
const mongoose = require('mongoose');

// Test the User model validation
async function testUserValidation() {
  try {
    // Test 1: Valid user data (should work)
    const validUser = new User({
      name: 'Test User',
      username: 'testuser123',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await validUser.validate();
    console.log('✅ Valid user data passes validation');
    
    // Test 2: User with empty website (should work now)
    const userWithEmptyWebsite = new User({
      name: 'Test User 2',
      username: 'testuser456',
      email: 'test2@example.com',
      password: 'password123',
      website: '' // This should not cause validation error anymore
    });
    
    await userWithEmptyWebsite.validate();
    console.log('✅ User with empty website passes validation');
    
    // Test 3: User with valid website (should work)
    const userWithValidWebsite = new User({
      name: 'Test User 3',
      username: 'testuser789',
      email: 'test3@example.com',
      password: 'password123',
      website: 'https://example.com' // This should work
    });
    
    await userWithValidWebsite.validate();
    console.log('✅ User with valid website passes validation');
    
    console.log('🎉 All validation tests passed!');
    
  } catch (error) {
    console.error('❌ Validation test failed:', error.message);
  }
}

// Run the test
testUserValidation(); 