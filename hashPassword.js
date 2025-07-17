const bcrypt = require('bcrypt');
const { UserModel } = require('./EatUpModel');

(async () => {
  const password = await bcrypt.hash('123456', 10);
  await UserModel.create({
    name: 'Demo User',
    email: 'demo@gmail.com',
    phone: '0123456789',
    password_hash: password,
  });
  console.log('✅ Created demo user');
})();
