const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const mediaRoutes = require('./routes/media');
const categoryRoutes = require('./routes/categories');

app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);

app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});