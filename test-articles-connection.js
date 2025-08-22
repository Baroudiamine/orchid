// Test de la connexion frontend-backend pour les articles
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

console.log('🧪 Test de la connexion Articles Frontend-Backend...\n');

// Test 1: GET tous les articles
testRoute('/articles', 'GET', null, (err, result) => {
  if (err) {
    console.log('❌ GET /articles : Erreur -', err.message);
    return;
  }
  
  console.log(`✅ GET /articles : Status ${result.status}`);
  
  if (result.status === 200) {
    try {
      const articles = JSON.parse(result.data);
      console.log(`   📋 ${articles.length} article(s) trouvé(s)`);
      
      if (articles.length > 0) {
        const firstArticle = articles[0];
        console.log(`   🆔 Premier article ID: ${firstArticle._id}`);
        console.log(`   📰 Titre: ${firstArticle.title}`);
        console.log(`   👤 Auteur: ${firstArticle.author}`);
        console.log(`   📊 Statut: ${firstArticle.status}`);
        
        // Test 2: GET article spécifique
        testRoute(`/articles/${firstArticle._id}`, 'GET', null, (err, result) => {
          if (err) {
            console.log(`❌ GET /articles/${firstArticle._id} : Erreur -`, err.message);
            return;
          }
          
          console.log(`✅ GET /articles/${firstArticle._id} : Status ${result.status}`);
          
          if (result.status === 200) {
            const article = JSON.parse(result.data);
            console.log(`   📰 Article trouvé: ${article.title}`);
            console.log('');
            console.log('🎉 Connexion Articles Frontend-Backend : SUCCÈS !');
            console.log('');
            console.log('🔗 URLs de test:');
            console.log(`   📝 Admin Articles: http://localhost:8080/admin/articles`);
            console.log(`   ✏️ Modifier article: http://localhost:8080/admin/articles/edit/${article._id}`);
            console.log(`   👁️ Voir article: http://localhost:8080/blog/${article._id}`);
            console.log('');
            console.log('🚀 Prochaines étapes:');
            console.log('1. Allez sur http://localhost:8080/admin/articles');
            console.log('2. Vérifiez que les articles se chargent depuis la base de données');
            console.log('3. Testez la modification et suppression d\'articles');
            console.log('4. Testez la création de nouveaux articles');
            
          } else {
            console.log(`   ❌ Article non trouvé (Status: ${result.status})`);
          }
        });
        
      } else {
        console.log('');
        console.log('📭 Aucun article dans la base de données');
        console.log('💡 Créez un article de test via l\'interface admin');
      }
      
    } catch (e) {
      console.log('   ❌ Erreur parsing JSON:', e.message);
    }
  } else {
    console.log(`   ❌ Erreur (Status: ${result.status})`);
    console.log('   📄 Réponse:', result.data);
  }
});
