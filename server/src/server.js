import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PLAY STILL ALIVE Backend Engine listening on http://localhost:${PORT}`);
});
