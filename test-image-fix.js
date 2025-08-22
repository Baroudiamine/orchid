// Test pour vérifier la correction des images
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

console.log('🔧 Test de correction des images d\'articles...\n');

// Créer un nouvel article avec image après la correction du modèle
const testArticleWithImage = {
  title: "Article avec Image Corrigée - Test Final",
  excerpt: "Test final pour vérifier que les images s'affichent correctement après correction du modèle",
  content: `
    <h2>Test d'affichage d'image après correction</h2>
    <p>Cet article teste l'affichage des images après la correction du modèle de données.</p>
    <p>L'image principale devrait maintenant s'afficher correctement dans le blog.</p>
    <h3>Fonctionnalités testées :</h3>
    <ul>
      <li>Sauvegarde de l'URL d'image dans le champ "image"</li>
      <li>Affichage dans la liste des articles</li>
      <li>Affichage dans la page de détail</li>
      <li>Support des images featured</li>
    </ul>
  `,
  author: "Admin Test",
  category: "Technology",
  status: "published",
  featured: true,
  image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  tags: ["test", "image", "correction", "final"]
};

testRoute('/articles', 'POST', testArticleWithImage, (err, result) => {
  if (err) {
    console.log('❌ Erreur création article:', err.message);
    return;
  }
  
  if (result.status === 201) {
    const createdArticle = JSON.parse(result.data);
    console.log('✅ Article avec image créé avec succès !');
    console.log(`   🆔 ID: ${createdArticle._id}`);
    console.log(`   📰 Titre: ${createdArticle.title}`);
    console.log(`   🖼️ Image: ${createdArticle.image ? 'OUI' : 'NON'}`);
    console.log(`   ⭐ Featured: ${createdArticle.featured ? 'OUI' : 'NON'}`);
    
    if (createdArticle.image) {
      console.log(`   📏 URL Image: ${createdArticle.image}`);
      console.log('   ✅ Image sauvegardée correctement !');
    }
    
    console.log('');
    console.log('🔗 URLs pour tester:');
    console.log(`   👁️ Blog: http://localhost:8080/blog`);
    console.log(`   📖 Article: http://localhost:8080/blog/${createdArticle._id}`);
    console.log(`   📝 Admin: http://localhost:8080/admin/articles`);
    console.log('');
    console.log('🎯 Instructions de test:');
    console.log('1. Allez sur http://localhost:8080/blog');
    console.log('2. L\'article devrait apparaître en "Featured" avec son image');
    console.log('3. Cliquez sur l\'article pour voir les détails');
    console.log('4. Vérifiez que l\'image s\'affiche dans la page de détail');
    console.log('5. Testez aussi l\'interface admin');
    console.log('');
    
    // Vérifier en récupérant l'article créé
    testRoute(`/articles/${createdArticle._id}`, 'GET', null, (err, result) => {
      if (err) {
        console.log('❌ Erreur récupération article:', err.message);
        return;
      }
      
      if (result.status === 200) {
        const retrievedArticle = JSON.parse(result.data);
        console.log('🔍 Vérification de l\'article récupéré:');
        console.log(`   🖼️ Image présente: ${retrievedArticle.image ? 'OUI' : 'NON'}`);
        console.log(`   📏 URL: ${retrievedArticle.image || 'Aucune'}`);
        console.log(`   ⭐ Featured: ${retrievedArticle.featured ? 'OUI' : 'NON'}`);
        
        if (retrievedArticle.image) {
          console.log('');
          console.log('🎉 SUCCÈS ! Les images fonctionnent maintenant correctement !');
          console.log('');
          console.log('💡 Pour ajouter des images à vos articles:');
          console.log('1. Utilisez des URLs d\'images externes (Unsplash, etc.)');
          console.log('2. Ou uploadez vos images sur un service comme Imgur');
          console.log('3. Évitez les images base64 trop lourdes');
          console.log('4. Testez toujours l\'URL avant de sauvegarder');
        } else {
          console.log('');
          console.log('❌ PROBLÈME: L\'image n\'est toujours pas sauvegardée correctement');
        }
      }
    });
    
  } else {
    console.log(`❌ Échec création article (Status: ${result.status})`);
    console.log('📄 Réponse:', result.data);
  }
});
