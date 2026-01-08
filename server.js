const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/secret', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Secret Area"');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const base64Credentials = authHeader.split(' ')[1];
  
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    res.json({ 
      message: process.env.SECRET_MESSAGE,
      authenticated: true 
    });
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Secret Area"');
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});