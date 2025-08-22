// Script pour nettoyer complètement la base de données et recréer avec le bon schéma
const mongoose = require('mongoose');
require('dotenv').config();

async function resetDatabase() {
  try {
    console.log('🔄 Nettoyage complet de la base de données...\n');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orchid');
    console.log('✅ Connecté à MongoDB');

    // Supprimer complètement la base de données
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️ Base de données supprimée complètement');

    // Redéfinir le modèle Article avec le nouveau schéma
    const articleSchema = new mongoose.Schema({
      title: { type: String, required: true },
      excerpt: { type: String, required: true },
      content: { type: String, required: true },
      author: { type: String, required: true },
      category: { type: String, required: true },
      tags: [String],
      status: { type: String, enum: ['draft', 'published'], default: 'draft' },
      featured: { type: Boolean, default: false },
      image: String,
      views: { type: Number, default: 0 },
      comments: { type: Number, default: 0 }
    }, { timestamps: true });

    const Article = mongoose.model('Article', articleSchema);
    console.log('📋 Nouveau modèle Article créé');

    // Créer des articles de test avec images
    const testArticles = [
      {
        title: "Guide Complet de l'Investissement Immobilier de Luxe 2024",
        excerpt: "Découvrez les stratégies d'investissement les plus efficaces pour le marché immobilier de luxe en 2024.",
        content: `<h2>Introduction</h2><p>L'investissement immobilier de luxe représente une opportunité unique pour les investisseurs avisés.</p><h2>Stratégies</h2><p>Pour réussir, il faut adopter une approche méthodique.</p>`,
        author: "Expert Immobilier",
        category: "Investment",
        status: "published",
        featured: true,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["investissement", "immobilier", "luxe", "2024"],
        views: 150,
        comments: 12
      },
      {
        title: "Architecture Moderne dans l'Immobilier de Prestige",
        excerpt: "Explorez les dernières tendances architecturales qui définissent l'immobilier de prestige.",
        content: `<h2>Architecture Moderne</h2><p>L'architecture moderne redéfinit les standards du luxe immobilier.</p><h3>Matériaux Nobles</h3><p>Utilisation de matériaux premium.</p>`,
        author: "Architecte Designer",
        category: "Architecture",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["architecture", "design", "moderne"],
        views: 89,
        comments: 7
      },
      {
        title: "Marché Immobilier Casablanca 2024",
        excerpt: "Analyse détaillée du marché immobilier de Casablanca et des opportunités d'investissement.",
        content: `<h2>Le Marché de Casablanca</h2><p>Casablanca reste le centre économique du Maroc.</p><h3>Quartiers Prisés</h3><p>Ain Diab, Maarif et CIL offrent les meilleures opportunités.</p>`,
        author: "Analyste Marché",
        category: "Market Analysis",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["casablanca", "marché", "investissement"],
        views: 203,
        comments: 15
      }
    ];

    // Créer les articles
    console.log('\n🏗️ Création des articles de test...');
    for (let i = 0; i < testArticles.length; i++) {
      const article = new Article(testArticles[i]);
      await article.save();
      console.log(`✅ ${i + 1}. ${article.title}`);
      console.log(`   🖼️ Image: ${article.image ? 'OUI' : 'NON'}`);
      console.log(`   ⭐ Featured: ${article.featured ? 'OUI' : 'NON'}`);
      console.log(`   👁️ Vues: ${article.views}`);
    }

    console.log('\n🎉 Base de données réinitialisée avec succès !');
    console.log('\n🔗 URLs pour tester:');
    console.log('   👁️ Blog: http://localhost:8080/blog');
    console.log('   📝 Admin: http://localhost:8080/admin/articles');
    console.log('   ➕ Ajouter: http://localhost:8080/admin/articles/add');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion fermée');
  }
}

resetDatabase();
