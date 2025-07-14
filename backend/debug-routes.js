require('dotenv').config();

console.log('Testing route imports...');

try {
  console.log('Testing auth routes...');
  require('./routes/auth');
  console.log('✅ Auth routes OK');
} catch (error) {
  console.log('❌ Auth routes error:', error.message);
}

try {
  console.log('Testing post routes...');
  require('./routes/posts');
  console.log('✅ Post routes OK');
} catch (error) {
  console.log('❌ Post routes error:', error.message);
}

try {
  console.log('Testing comment routes...');
  require('./routes/comments');
  console.log('✅ Comment routes OK');
} catch (error) {
  console.log('❌ Comment routes error:', error.message);
}

try {
  console.log('Testing user routes...');
  require('./routes/users');
  console.log('✅ User routes OK');
} catch (error) {
  console.log('❌ User routes error:', error.message);
}

try {
  console.log('Testing message routes...');
  require('./routes/messages');
  console.log('✅ Message routes OK');
} catch (error) {
  console.log('❌ Message routes error:', error.message);
}

try {
  console.log('Testing notification routes...');
  require('./routes/notifications');
  console.log('✅ Notification routes OK');
} catch (error) {
  console.log('❌ Notification routes error:', error.message);
}

console.log('Route testing complete!'); 