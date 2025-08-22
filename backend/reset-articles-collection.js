// Script pour supprimer complètement la collection articles et la recréer
const mongoose = require('mongoose');
require('dotenv').config();

async function resetArticlesCollection() {
  try {
    console.log('🔄 Réinitialisation complète de la collection articles...\n');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orchid');
    console.log('✅ Connecté à MongoDB');

    // Supprimer complètement la collection articles
    try {
      await mongoose.connection.db.collection('articles').drop();
      console.log('🗑️ Collection articles supprimée');
    } catch (error) {
      if (error.message.includes('ns not found')) {
        console.log('📭 Collection articles n\'existait pas');
      } else {
        throw error;
      }
    }

    // Définir le nouveau schéma
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
    console.log('📋 Nouveau schéma Article défini');

    // Créer des articles de test avec images
    const testArticles = [
      {
        title: "Guide Complet de l'Investissement Immobilier de Luxe 2024",
        excerpt: "Découvrez les stratégies d'investissement les plus efficaces pour le marché immobilier de luxe en 2024. Un guide complet pour maximiser vos rendements.",
        content: `
          <h2>Introduction</h2>
          <p>L'investissement immobilier de luxe représente une opportunité unique pour les investisseurs avisés. Ce guide vous présente les meilleures stratégies pour 2024.</p>
          
          <h2>Les Tendances du Marché 2024</h2>
          <p>Le marché immobilier de luxe connaît une transformation majeure avec l'émergence de nouvelles technologies et l'évolution des préférences des acheteurs.</p>
          
          <h3>1. Durabilité et Écologie</h3>
          <p>Les propriétés écologiques et durables sont de plus en plus recherchées par les acheteurs de luxe conscients de l'environnement.</p>
          
          <h3>2. Technologie Intelligente</h3>
          <p>L'intégration de technologies smart home devient un standard dans l'immobilier de luxe moderne.</p>
          
          <h2>Stratégies d'Investissement</h2>
          <p>Pour réussir dans l'immobilier de luxe, il faut adopter une approche méthodique et bien informée.</p>
          
          <h2>Conclusion</h2>
          <p>L'investissement immobilier de luxe offre des opportunités exceptionnelles pour ceux qui savent naviguer ce marché sophistiqué.</p>
        `,
        author: "Expert Immobilier",
        category: "Investment",
        status: "published",
        featured: true,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["investissement", "immobilier", "luxe", "2024", "guide"],
        views: 150,
        comments: 12
      },
      {
        title: "Architecture Moderne : Tendances 2024 dans l'Immobilier de Prestige",
        excerpt: "Explorez les dernières tendances architecturales qui définissent l'immobilier de prestige contemporain.",
        content: `
          <h2>L'Architecture Moderne de Luxe</h2>
          <p>L'architecture moderne redéfinit les standards du luxe immobilier avec des designs innovants et durables.</p>
          
          <h3>Matériaux Nobles</h3>
          <p>L'utilisation de matériaux premium comme le marbre, le verre et l'acier inoxydable crée des espaces exceptionnels.</p>
          
          <h3>Espaces Ouverts</h3>
          <p>Les concepts d'espaces ouverts maximisent la lumière naturelle et créent une sensation d'espace et de liberté.</p>
          
          <h3>Intégration Technologique</h3>
          <p>La domotique et les systèmes intelligents sont intégrés de manière invisible dans l'architecture.</p>
        `,
        author: "Architecte Designer",
        category: "Architecture",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["architecture", "design", "moderne", "luxe"],
        views: 89,
        comments: 7
      },
      {
        title: "Marché Immobilier Casablanca : Analyse et Opportunités 2024",
        excerpt: "Analyse détaillée du marché immobilier de Casablanca et des meilleures opportunités d'investissement pour 2024.",
        content: `
          <h2>Le Marché de Casablanca</h2>
          <p>Casablanca reste le centre économique du Maroc avec un marché immobilier en constante évolution.</p>
          
          <h3>Quartiers Prisés</h3>
          <p>Les quartiers de Ain Diab, Maarif et CIL offrent les meilleures opportunités d'investissement.</p>
          
          <h3>Prévisions 2024</h3>
          <p>Le marché devrait connaître une croissance soutenue de 8-12% en 2024, portée par les grands projets d'infrastructure.</p>
          
          <h3>Conseils d'Investissement</h3>
          <p>Privilégiez les propriétés bien situées avec un potentiel de plus-value à long terme.</p>
        `,
        author: "Analyste Marché",
        category: "Market Analysis",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["casablanca", "marché", "investissement", "analyse"],
        views: 203,
        comments: 15
      }
    ];

    // Créer les articles un par un
    let createdCount = 0;
    for (let i = 0; i < testArticles.length; i++) {
      try {
        const article = new Article(testArticles[i]);
        await article.save();
        createdCount++;
        console.log(`✅ ${i + 1}. Article créé: ${article.title}`);
        console.log(`   🆔 ID: ${article._id}`);
        console.log(`   🖼️ Image: ${article.image ? 'OUI' : 'NON'}`);
        console.log(`   ⭐ Featured: ${article.featured ? 'OUI' : 'NON'}`);
        console.log(`   👁️ Vues: ${article.views}`);
      } catch (error) {
        console.log(`❌ ${i + 1}. Erreur création: ${error.message}`);
      }
    }

    console.log(`\n🎉 Réinitialisation terminée ! ${createdCount}/${testArticles.length} articles créés`);
    console.log('\n🔗 URLs pour tester:');
    console.log('   👁️ Blog: http://localhost:8080/blog');
    console.log('   📝 Admin: http://localhost:8080/admin/articles');
    console.log('\n✅ Les images devraient maintenant s\'afficher correctement !');

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

resetArticlesCollection();
