// Test pour vérifier les images des articles
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

console.log('🖼️ Test des images d\'articles...\n');

// Récupérer tous les articles pour vérifier leurs images
testRoute('/articles', 'GET', null, (err, result) => {
  if (err) {
    console.log('❌ Erreur récupération articles:', err.message);
    return;
  }
  
  if (result.status === 200) {
    const articles = JSON.parse(result.data);
    console.log(`📋 ${articles.length} article(s) trouvé(s)\n`);
    
    articles.forEach((article, index) => {
      console.log(`${index + 1}. 📰 ${article.title}`);
      console.log(`   🆔 ID: ${article._id}`);
      console.log(`   🖼️ Image: ${article.image ? 'OUI' : 'NON'}`);
      
      if (article.image) {
        console.log(`   📏 Taille URL: ${article.image.length} caractères`);
        
        // Vérifier le type d'image
        if (article.image.startsWith('data:image/')) {
          console.log(`   📊 Type: Base64 (${article.image.substring(0, 50)}...)`);
          console.log(`   ⚠️ PROBLÈME: Image base64 détectée - peut être trop lourde`);
        } else if (article.image.startsWith('http')) {
          console.log(`   📊 Type: URL externe (${article.image})`);
          console.log(`   ✅ OK: URL externe`);
        } else if (article.image.startsWith('/')) {
          console.log(`   📊 Type: Chemin local (${article.image})`);
          console.log(`   ⚠️ ATTENTION: Chemin local - vérifier si le fichier existe`);
        } else {
          console.log(`   📊 Type: Autre (${article.image.substring(0, 50)}...)`);
          console.log(`   ❌ PROBLÈME: Format d'image non reconnu`);
        }
      } else {
        console.log(`   ❌ PROBLÈME: Aucune image définie`);
      }
      console.log('');
    });
    
    // Créer un article de test avec une image valide
    console.log('🧪 Création d\'un article de test avec image...\n');
    
    const testArticleWithImage = {
      title: "Test Article avec Image Valide",
      excerpt: "Article de test pour vérifier l'affichage des images",
      content: `
        <h2>Test d'affichage d'image</h2>
        <p>Cet article teste l'affichage des images dans le blog.</p>
        <p>L'image principale devrait s'afficher correctement.</p>
      `,
      author: "Test Admin",
      category: "Test",
      status: "published",
      featured: false,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["test", "image", "affichage"]
    };
    
    testRoute('/articles', 'POST', testArticleWithImage, (err, result) => {
      if (err) {
        console.log('❌ Erreur création article test:', err.message);
        return;
      }
      
      if (result.status === 201) {
        const createdArticle = JSON.parse(result.data);
        console.log('✅ Article de test créé avec succès !');
        console.log(`   🆔 ID: ${createdArticle._id}`);
        console.log(`   🖼️ Image: ${createdArticle.image}`);
        console.log('');
        console.log('🔗 URLs pour tester l\'affichage:');
        console.log(`   👁️ Blog: http://localhost:8080/blog`);
        console.log(`   📖 Article: http://localhost:8080/blog/${createdArticle._id}`);
        console.log('');
        console.log('🎯 Instructions de test:');
        console.log('1. Allez sur http://localhost:8080/blog');
        console.log('2. Vérifiez que l\'image de l\'article "Test Article avec Image Valide" s\'affiche');
        console.log('3. Cliquez sur l\'article pour voir les détails');
        console.log('4. Vérifiez que l\'image s\'affiche dans la page de détail');
        console.log('');
        console.log('💡 Solutions si les images ne s\'affichent pas:');
        console.log('- Utilisez des URLs d\'images externes valides (Unsplash, etc.)');
        console.log('- Évitez les images base64 trop lourdes');
        console.log('- Vérifiez la console du navigateur pour les erreurs');
        
      } else {
        console.log(`❌ Échec création article test (Status: ${result.status})`);
        console.log('📄 Réponse:', result.data);
      }
    });
    
  } else {
    console.log(`❌ Erreur récupération articles (Status: ${result.status})`);
  }
});
