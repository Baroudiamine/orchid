// Test pour simuler la création d'article depuis le frontend
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

console.log('🧪 Test de création d\'article depuis le frontend...\n');

// Simuler exactement les données que le frontend envoie
const frontendArticleData = {
  title: "Test Article Frontend avec Image",
  excerpt: "Test pour vérifier que les images fonctionnent depuis le frontend",
  content: `
    <h2>Test Frontend</h2>
    <p>Cet article teste la création depuis l'interface frontend.</p>
    <p>L'image devrait s'afficher correctement.</p>
  `,
  author: "Admin Frontend",
  category: "Technology",
  tags: "test,frontend,image,création",
  status: "published",
  featured: true,
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

console.log('📋 Données à envoyer:');
console.log(JSON.stringify(frontendArticleData, null, 2));
console.log('');

testRoute('/articles', 'POST', frontendArticleData, (err, result) => {
  if (err) {
    console.log('❌ Erreur création article:', err.message);
    return;
  }
  
  console.log(`📤 POST /articles : Status ${result.status}`);
  
  if (result.status === 201) {
    const createdArticle = JSON.parse(result.data);
    console.log('✅ Article créé avec succès !');
    console.log('📋 Article retourné:');
    console.log(`   🆔 ID: ${createdArticle._id}`);
    console.log(`   📰 Titre: ${createdArticle.title}`);
    console.log(`   🖼️ Image: ${createdArticle.image ? 'OUI' : 'NON'}`);
    console.log(`   📏 URL Image: ${createdArticle.image || 'Aucune'}`);
    console.log(`   ⭐ Featured: ${createdArticle.featured ? 'OUI' : 'NON'}`);
    console.log(`   📊 Statut: ${createdArticle.status}`);
    console.log(`   🏷️ Tags: ${createdArticle.tags ? createdArticle.tags.join(', ') : 'Aucun'}`);
    
    // Vérifier en récupérant l'article
    testRoute(`/articles/${createdArticle._id}`, 'GET', null, (err, result) => {
      if (err) {
        console.log('❌ Erreur récupération:', err.message);
        return;
      }
      
      if (result.status === 200) {
        const retrievedArticle = JSON.parse(result.data);
        console.log('\n🔍 Vérification après récupération:');
        console.log(`   🖼️ Image présente: ${retrievedArticle.image ? 'OUI' : 'NON'}`);
        console.log(`   📏 URL: ${retrievedArticle.image || 'Aucune'}`);
        console.log(`   ⭐ Featured: ${retrievedArticle.featured ? 'OUI' : 'NON'}`);
        
        if (retrievedArticle.image && retrievedArticle.featured !== undefined) {
          console.log('\n🎉 SUCCÈS ! L\'article a été créé avec tous les champs !');
          console.log('\n🔗 URLs pour tester:');
          console.log(`   👁️ Blog: http://localhost:8080/blog`);
          console.log(`   📖 Article: http://localhost:8080/blog/${retrievedArticle._id}`);
          console.log(`   📝 Admin: http://localhost:8080/admin/articles`);
          console.log('\n💡 Maintenant testez la création depuis l\'interface:');
          console.log('1. Allez sur http://localhost:8080/admin/articles/add');
          console.log('2. Remplissez le formulaire avec une URL d\'image');
          console.log('3. Cochez "Article mis en avant" si désiré');
          console.log('4. Cliquez sur "Publier l\'article"');
          console.log('5. Vérifiez sur http://localhost:8080/blog');
        } else {
          console.log('\n❌ PROBLÈME: Certains champs manquent encore');
        }
      }
    });
    
  } else {
    console.log(`❌ Échec création (Status: ${result.status})`);
    console.log('📄 Réponse:', result.data);
  }
});
