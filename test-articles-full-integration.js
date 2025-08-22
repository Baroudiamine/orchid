// Test d'intégration complète Articles Frontend-Backend
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

console.log('🚀 Test d\'intégration complète Articles Frontend-Backend\n');

// Test 1: Vérifier que le backend fonctionne
testRoute('/', 'GET', null, (err, result) => {
  if (err) {
    console.log('❌ Backend non accessible:', err.message);
    return;
  }
  
  console.log('✅ Backend accessible');
  
  // Test 2: Lister les articles existants
  testRoute('/articles', 'GET', null, (err, result) => {
    if (err) {
      console.log('❌ Erreur GET /articles:', err.message);
      return;
    }
    
    console.log(`✅ GET /articles : Status ${result.status}`);
    
    if (result.status === 200) {
      const articles = JSON.parse(result.data);
      console.log(`   📋 ${articles.length} article(s) existant(s)`);
      
      if (articles.length > 0) {
        const testArticle = articles[0];
        console.log(`   🆔 Test avec article: ${testArticle._id}`);
        console.log(`   📰 Titre: ${testArticle.title}`);
        
        // Test 3: Récupérer un article spécifique
        testRoute(`/articles/${testArticle._id}`, 'GET', null, (err, result) => {
          if (err) {
            console.log(`❌ Erreur GET /articles/${testArticle._id}:`, err.message);
            return;
          }
          
          console.log(`✅ GET /articles/${testArticle._id} : Status ${result.status}`);
          
          if (result.status === 200) {
            console.log('   📰 Article récupéré avec succès');
            
            // Test 4: Créer un nouvel article de test
            const newArticle = {
              title: "Article de Test - Intégration Frontend-Backend",
              excerpt: "Cet article a été créé automatiquement pour tester l'intégration complète.",
              content: "Contenu de test pour vérifier que la création d'articles fonctionne correctement via l'API.",
              author: "Test Automation",
              category: "Technology",
              status: "draft",
              featured: false,
              image: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Test+Article",
              tags: ["test", "integration", "api"]
            };
            
            testRoute('/articles', 'POST', newArticle, (err, result) => {
              if (err) {
                console.log('❌ Erreur POST /articles:', err.message);
                return;
              }
              
              console.log(`✅ POST /articles : Status ${result.status}`);
              
              if (result.status === 201) {
                const createdArticle = JSON.parse(result.data);
                console.log(`   🆔 Nouvel article créé: ${createdArticle._id}`);
                console.log(`   📰 Titre: ${createdArticle.title}`);
                
                // Test 5: Modifier l'article créé
                const updatedData = {
                  ...newArticle,
                  title: "Article de Test - MODIFIÉ",
                  status: "published"
                };
                
                testRoute(`/articles/${createdArticle._id}`, 'PUT', updatedData, (err, result) => {
                  if (err) {
                    console.log(`❌ Erreur PUT /articles/${createdArticle._id}:`, err.message);
                    return;
                  }
                  
                  console.log(`✅ PUT /articles/${createdArticle._id} : Status ${result.status}`);
                  
                  if (result.status === 200) {
                    console.log('   📝 Article modifié avec succès');
                    
                    // Test 6: Supprimer l'article de test
                    testRoute(`/articles/${createdArticle._id}`, 'DELETE', null, (err, result) => {
                      if (err) {
                        console.log(`❌ Erreur DELETE /articles/${createdArticle._id}:`, err.message);
                        return;
                      }
                      
                      console.log(`✅ DELETE /articles/${createdArticle._id} : Status ${result.status}`);
                      
                      if (result.status === 200) {
                        console.log('   🗑️ Article supprimé avec succès');
                        
                        console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
                        console.log('\n📋 Résumé des fonctionnalités testées:');
                        console.log('   ✅ Connexion backend');
                        console.log('   ✅ Lecture des articles (GET /articles)');
                        console.log('   ✅ Lecture d\'un article spécifique (GET /articles/:id)');
                        console.log('   ✅ Création d\'article (POST /articles)');
                        console.log('   ✅ Modification d\'article (PUT /articles/:id)');
                        console.log('   ✅ Suppression d\'article (DELETE /articles/:id)');
                        
                        console.log('\n🔗 URLs de test pour le frontend:');
                        console.log('   📝 Admin Articles: http://localhost:8080/admin/articles');
                        console.log('   ➕ Ajouter Article: http://localhost:8080/admin/articles/add');
                        console.log('   👁️ Blog Public: http://localhost:8080/blog');
                        
                        console.log('\n🚀 Votre intégration Articles Frontend-Backend est COMPLÈTE !');
                        
                      } else {
                        console.log(`   ❌ Échec suppression (Status: ${result.status})`);
                      }
                    });
                  } else {
                    console.log(`   ❌ Échec modification (Status: ${result.status})`);
                  }
                });
              } else {
                console.log(`   ❌ Échec création (Status: ${result.status})`);
                console.log('   📄 Réponse:', result.data);
              }
            });
          } else {
            console.log(`   ❌ Échec récupération article (Status: ${result.status})`);
          }
        });
      } else {
        console.log('\n📭 Aucun article existant - créons-en un pour tester');
        // Créer un article de base si aucun n'existe
        const baseArticle = {
          title: "Premier Article - Test d'Intégration",
          excerpt: "Premier article créé pour tester l'intégration.",
          content: "Contenu du premier article de test.",
          author: "Admin Test",
          category: "Technology",
          status: "published",
          featured: true,
          image: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Premier+Article",
          tags: ["premier", "test", "integration"]
        };
        
        testRoute('/articles', 'POST', baseArticle, (err, result) => {
          if (err) {
            console.log('❌ Erreur création premier article:', err.message);
            return;
          }
          
          if (result.status === 201) {
            const created = JSON.parse(result.data);
            console.log(`✅ Premier article créé: ${created._id}`);
            console.log('\n🎉 Base de données initialisée avec succès !');
            console.log('🔗 Testez maintenant: http://localhost:8080/admin/articles');
          }
        });
      }
    } else {
      console.log(`   ❌ Erreur récupération articles (Status: ${result.status})`);
    }
  });
});
