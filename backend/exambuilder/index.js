// Entry point for backend

require('dotenv').config();
const connectDB = require('./src/db/connectDB');
const app = require('./src/app');

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});