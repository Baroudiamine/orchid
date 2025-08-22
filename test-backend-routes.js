// Test simple des routes du backend
const http = require('http');

function testRoute(path, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback(null, { status: res.statusCode, data: data });
    });
  });

  req.on('error', (err) => {
    callback(err, null);
  });

  req.end();
}

console.log('🧪 Test des routes du backend...\n');

// Test route principale
testRoute('/', (err, result) => {
  if (err) {
    console.log('❌ Route / : Erreur -', err.message);
  } else {
    console.log(`✅ Route / : Status ${result.status} - ${result.data}`);
  }

  // Test route properties
  testRoute('/properties', (err, result) => {
    if (err) {
      console.log('❌ Route /properties : Erreur -', err.message);
    } else {
      console.log(`✅ Route /properties : Status ${result.status}`);
      if (result.status === 200) {
        try {
          const properties = JSON.parse(result.data);
          console.log(`   📋 ${properties.length} propriété(s) trouvée(s)`);
          if (properties.length > 0) {
            console.log(`   🆔 Premier ID: ${properties[0]._id}`);
            
            // Test route property by ID
            testRoute(`/properties/${properties[0]._id}`, (err, result) => {
              if (err) {
                console.log(`❌ Route /properties/${properties[0]._id} : Erreur -`, err.message);
              } else {
                console.log(`✅ Route /properties/${properties[0]._id} : Status ${result.status}`);
                if (result.status === 200) {
                  const property = JSON.parse(result.data);
                  console.log(`   🏠 Propriété trouvée: ${property.title}`);
                  console.log('\n🎉 Toutes les routes fonctionnent !');
                  console.log('🔗 Vous pouvez maintenant modifier la propriété sur:');
                  console.log(`   http://localhost:8080/admin/properties/edit/${property._id}`);
                } else {
                  console.log(`   ❌ Propriété non trouvée (Status: ${result.status})`);
                  console.log('   📄 Réponse:', result.data);
                }
              }
            });
          }
        } catch (e) {
          console.log('   ❌ Erreur parsing JSON:', e.message);
        }
      }
    }
  });
});
