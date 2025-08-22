// Script pour nettoyer et recréer les articles avec le bon schéma
const http = require('http');

function testRoute(path, method = 'GET', data = null, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      callback(null, { status: res.statusCode, data: responseData });
    });
  });

  req.on('error', (err) => {
    callback(err, null);
  });

  if (data) {
    req.write(JSON.stringify(data));
  }
  req.end();
}

console.log('🧹 Nettoyage et recréation des articles avec images...\n');

// Récupérer tous les articles existants
testRoute('/articles', 'GET', null, (err, result) => {
  if (err) {
    console.log('❌ Erreur récupération articles:', err.message);
    return;
  }
  
  if (result.status === 200) {
    const articles = JSON.parse(result.data);
    console.log(`📋 ${articles.length} article(s) existant(s) trouvé(s)`);
    
    // Supprimer tous les articles existants
    let deletedCount = 0;
    const deletePromises = articles.map(article => {
      return new Promise((resolve) => {
        testRoute(`/articles/${article._id}`, 'DELETE', null, (err, result) => {
          if (!err && result.status === 200) {
            deletedCount++;
            console.log(`🗑️ Article supprimé: ${article.title}`);
          }
          resolve();
        });
      });
    });
    
    Promise.all(deletePromises).then(() => {
      console.log(`\n✅ ${deletedCount} article(s) supprimé(s)`);
      
      // Créer de nouveaux articles avec images
      console.log('\n🏗️ Création de nouveaux articles avec images...\n');
      
      const newArticles = [
        {
          title: "Guide Complet de l'Investissement Immobilier de Luxe 2024",
          excerpt: "Découvrez les stratégies d'investissement les plus efficaces pour le marché immobilier de luxe en 2024.",
          content: `
            <h2>Introduction</h2>
            <p>L'investissement immobilier de luxe représente une opportunité unique pour les investisseurs avisés.</p>
            
            <h2>Les Tendances du Marché 2024</h2>
            <p>Le marché immobilier de luxe connaît une transformation majeure avec l'émergence de nouvelles technologies.</p>
            
            <h3>1. Durabilité et Écologie</h3>
            <p>Les propriétés écologiques sont de plus en plus recherchées par les acheteurs de luxe.</p>
            
            <h3>2. Technologie Intelligente</h3>
            <p>L'intégration de technologies smart home devient un standard dans l'immobilier de luxe moderne.</p>
            
            <h2>Conclusion</h2>
            <p>L'investissement immobilier de luxe offre des opportunités exceptionnelles pour ceux qui savent naviguer ce marché.</p>
          `,
          author: "Expert Immobilier",
          category: "Investment",
          status: "published",
          featured: true,
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          tags: ["investissement", "immobilier", "luxe", "2024"]
        },
        {
          title: "Tendances Architecture Moderne dans l'Immobilier de Prestige",
          excerpt: "Explorez les dernières tendances architecturales qui définissent l'immobilier de prestige contemporain.",
          content: `
            <h2>L'Architecture Moderne de Luxe</h2>
            <p>L'architecture moderne redéfinit les standards du luxe immobilier avec des designs innovants.</p>
            
            <h3>Matériaux Nobles</h3>
            <p>L'utilisation de matériaux premium comme le marbre, le verre et l'acier inoxydable.</p>
            
            <h3>Espaces Ouverts</h3>
            <p>Les concepts d'espaces ouverts maximisent la lumière naturelle et créent une sensation d'espace.</p>
          `,
          author: "Architecte Designer",
          category: "Architecture",
          status: "published",
          featured: false,
          image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          tags: ["architecture", "design", "moderne", "luxe"]
        },
        {
          title: "Marché Immobilier Casablanca : Opportunités 2024",
          excerpt: "Analyse détaillée du marché immobilier de Casablanca et des opportunités d'investissement pour 2024.",
          content: `
            <h2>Le Marché de Casablanca</h2>
            <p>Casablanca reste le centre économique du Maroc avec un marché immobilier dynamique.</p>
            
            <h3>Quartiers Prisés</h3>
            <p>Les quartiers de Ain Diab, Maarif et CIL offrent les meilleures opportunités.</p>
            
            <h3>Prévisions 2024</h3>
            <p>Le marché devrait connaître une croissance de 8-12% en 2024.</p>
          `,
          author: "Analyste Marché",
          category: "Market Analysis",
          status: "published",
          featured: false,
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          tags: ["casablanca", "marché", "investissement", "2024"]
        }
      ];
      
      let createdCount = 0;
      const createPromises = newArticles.map((articleData, index) => {
        return new Promise((resolve) => {
          testRoute('/articles', 'POST', articleData, (err, result) => {
            if (!err && result.status === 201) {
              const created = JSON.parse(result.data);
              createdCount++;
              console.log(`✅ ${index + 1}. Article créé: ${created.title}`);
              console.log(`   🆔 ID: ${created._id}`);
              console.log(`   🖼️ Image: ${created.image ? 'OUI' : 'NON'}`);
              console.log(`   ⭐ Featured: ${created.featured ? 'OUI' : 'NON'}`);
            } else {
              console.log(`❌ ${index + 1}. Échec création: ${articleData.title}`);
            }
            resolve();
          });
        });
      });
      
      Promise.all(createPromises).then(() => {
        console.log(`\n🎉 Migration terminée ! ${createdCount}/${newArticles.length} articles créés`);
        console.log('\n🔗 URLs pour tester:');
        console.log('   👁️ Blog: http://localhost:8080/blog');
        console.log('   📝 Admin: http://localhost:8080/admin/articles');
        console.log('\n🎯 Les images devraient maintenant s\'afficher correctement !');
      });
    });
    
  } else {
    console.log(`❌ Erreur récupération articles (Status: ${result.status})`);
  }
});
