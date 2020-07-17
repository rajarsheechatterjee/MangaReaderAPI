const express = require('express');

const app = express();

app.use(express.json({
    extended: false
}));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/manga', require('./routes/api/manga'));
app.use('/api/manga', require('./routes/api/page'));
app.use('/api/manga', require('./routes/api/search'));
app.use('/api/manga', require('./routes/api/chapter'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))