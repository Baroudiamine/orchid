// Script pour créer un article de test et vérifier l'affichage
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

console.log('🚀 Création d\'un article de test pour vérifier l\'affichage public\n');

// Créer un article de test avec du contenu riche
const testArticle = {
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
    
    <h3>Analyse de Marché</h3>
    <p>Une analyse approfondie du marché local est essentielle avant tout investissement.</p>
    
    <h3>Sélection de Propriétés</h3>
    <p>Choisir les bonnes propriétés nécessite une expertise particulière et une connaissance du segment de luxe.</p>
    
    <h2>Conclusion</h2>
    <p>L'investissement immobilier de luxe offre des opportunités exceptionnelles pour ceux qui savent naviguer ce marché sophistiqué.</p>
  `,
  author: "Expert Immobilier",
  category: "Investment",
  status: "published",
  featured: true,
  image: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Guide+Investissement+Luxe+2024",
  tags: ["investissement", "immobilier", "luxe", "2024", "guide", "stratégie"]
};

testRoute('/articles', 'POST', testArticle, (err, result) => {
  if (err) {
    console.log('❌ Erreur création article:', err.message);
    return;
  }
  
  console.log(`✅ POST /articles : Status ${result.status}`);
  
  if (result.status === 201) {
    const createdArticle = JSON.parse(result.data);
    console.log('🎉 Article de test créé avec succès !');
    console.log('📋 Détails:');
    console.log(`   🆔 ID: ${createdArticle._id}`);
    console.log(`   📰 Titre: ${createdArticle.title}`);
    console.log(`   👤 Auteur: ${createdArticle.author}`);
    console.log(`   📊 Statut: ${createdArticle.status}`);
    console.log(`   ⭐ Featured: ${createdArticle.featured}`);
    console.log('');
    console.log('🔗 URLs pour tester:');
    console.log(`   👁️ Blog Public: http://localhost:8080/blog`);
    console.log(`   📖 Article Détail: http://localhost:8080/blog/${createdArticle._id}`);
    console.log(`   📝 Admin Articles: http://localhost:8080/admin/articles`);
    console.log(`   ✏️ Modifier: http://localhost:8080/admin/articles/edit/${createdArticle._id}`);
    console.log('');
    console.log('🎯 Maintenant:');
    console.log('1. Allez sur http://localhost:8080/blog');
    console.log('2. Vérifiez que l\'article apparaît dans la section "Featured Article"');
    console.log('3. Cliquez sur l\'article pour voir les détails');
    console.log('4. Testez les fonctionnalités de partage et navigation');
    console.log('');
    console.log('✅ Votre intégration Articles Frontend-Backend est COMPLÈTE !');
    
  } else {
    console.log(`❌ Échec création (Status: ${result.status})`);
    console.log('📄 Réponse:', result.data);
  }
});
