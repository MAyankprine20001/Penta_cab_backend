const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
console.log(PORT);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
