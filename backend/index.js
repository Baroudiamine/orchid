// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const propertyController = require('./controllers/propertyController');
const articleController = require('./controllers/articleController');
const contactController = require('./controllers/contactController');

dotenv.config(); // charge les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Augmenter la limite pour les images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB using URL from .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Test simple route
app.get('/', (req, res) => {
    res.send('Hello World from Node.js backend!');
});

// CRUD routes for properties
// Assure-toi que chaque fonction est bien exportée dans propertyController.js
app.get('/properties', propertyController.getAllProperties);
app.get('/properties/:id', propertyController.getPropertyById);
app.post('/properties', propertyController.addProperty);
app.put('/properties/:id', propertyController.updateProperty);
app.delete('/properties/:id', propertyController.deleteProperty);

// CRUD routes for articles
app.get('/articles', articleController.getAllArticles);
app.get('/articles/:id', articleController.getArticleById);
app.post('/articles', articleController.addArticle);
app.put('/articles/:id', articleController.updateArticle);
app.delete('/articles/:id', articleController.deleteArticle);

// Contact routes
app.post('/contact', contactController.addContact);
app.get('/test-email', contactController.testEmail);


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
