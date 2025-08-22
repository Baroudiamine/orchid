// Script de migration pour corriger le schéma des articles
const mongoose = require('mongoose');
require('dotenv').config();

// Ancien schéma (pour référence)
const oldArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  featuredImage: String,
}, { timestamps: true });

// Nouveau schéma
const newArticleSchema = new mongoose.Schema({
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

async function migrateArticles() {
  try {
    console.log('🔄 Début de la migration des articles...\n');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orchid');
    console.log('✅ Connecté à MongoDB');

    // Récupérer tous les articles existants
    const articles = await mongoose.connection.db.collection('articles').find({}).toArray();
    console.log(`📋 ${articles.length} article(s) trouvé(s) à migrer`);

    if (articles.length === 0) {
      console.log('📭 Aucun article à migrer');
      
      // Créer un article de test avec le nouveau schéma
      console.log('\n🧪 Création d\'un article de test avec le nouveau schéma...');
      
      const Article = mongoose.model('Article', newArticleSchema);
      const testArticle = new Article({
        title: "Article de Test avec Image - Nouveau Schéma",
        excerpt: "Test du nouveau schéma avec support des images",
        content: `
          <h2>Test du Nouveau Schéma</h2>
          <p>Cet article teste le nouveau schéma avec support complet des images.</p>
          <p>Les fonctionnalités incluent :</p>
          <ul>
            <li>Support du champ "image" au lieu de "featuredImage"</li>
            <li>Support du champ "featured" boolean</li>
            <li>Compteurs de vues et commentaires</li>
          </ul>
        `,
        author: "Migration Script",
        category: "Technology",
        status: "published",
        featured: true,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["test", "migration", "nouveau-schema"],
        views: 0,
        comments: 0
      });

      await testArticle.save();
      console.log('✅ Article de test créé avec succès !');
      console.log(`   🆔 ID: ${testArticle._id}`);
      console.log(`   🖼️ Image: ${testArticle.image}`);
      console.log(`   ⭐ Featured: ${testArticle.featured}`);
      
    } else {
      // Migrer les articles existants
      console.log('\n🔄 Migration des articles existants...');
      
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        console.log(`\n${i + 1}. Migration de "${article.title}"`);
        
        const updateData = {
          featured: false, // Par défaut
          image: article.featuredImage || "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=" + encodeURIComponent(article.title),
          views: 0,
          comments: 0
        };
        
        // Si l'article avait une featuredImage, la migrer vers image
        if (article.featuredImage) {
          updateData.image = article.featuredImage;
          console.log(`   🖼️ Migration image: ${article.featuredImage}`);
        }
        
        await mongoose.connection.db.collection('articles').updateOne(
          { _id: article._id },
          { 
            $set: updateData,
            $unset: { featuredImage: "" } // Supprimer l'ancien champ
          }
        );
        
        console.log(`   ✅ Article migré`);
      }
    }

    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n🔗 URLs pour tester:');
    console.log('   👁️ Blog: http://localhost:8080/blog');
    console.log('   📝 Admin: http://localhost:8080/admin/articles');
    console.log('\n💡 Les images devraient maintenant s\'afficher correctement !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

migrateArticles();
