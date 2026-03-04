import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello ESM World');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/health', (req, res) => {
  res.send('All good')
})