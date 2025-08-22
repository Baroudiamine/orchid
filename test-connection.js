// Script de test pour vérifier la connexion entre le frontend et le backend
const API_BASE_URL = 'http://localhost:3000';

// Test de connexion au backend
async function testBackendConnection() {
  console.log('🔍 Test de connexion au backend...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Backend connecté:', text);
      return true;
    } else {
      console.log('❌ Backend non accessible, status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur de connexion au backend:', error.message);
    return false;
  }
}

// Test des endpoints des propriétés
async function testPropertyEndpoints() {
  console.log('\n🏠 Test des endpoints des propriétés...');
  
  try {
    // Test GET /properties
    console.log('📋 Test GET /properties...');
    const getResponse = await fetch(`${API_BASE_URL}/properties`);
    if (getResponse.ok) {
      const properties = await getResponse.json();
      console.log(`✅ GET /properties réussi - ${properties.length} propriétés trouvées`);
      
      // Test d'une propriété spécifique si elle existe
      if (properties.length > 0) {
        const firstProperty = properties[0];
        console.log(`📄 Test GET /properties/${firstProperty._id}...`);
        
        const getOneResponse = await fetch(`${API_BASE_URL}/properties/${firstProperty._id}`);
        if (getOneResponse.ok) {
          const property = await getOneResponse.json();
          console.log(`✅ GET /properties/${firstProperty._id} réussi - ${property.title}`);
        } else {
          console.log(`❌ GET /properties/${firstProperty._id} échoué`);
        }
      }
    } else {
      console.log('❌ GET /properties échoué, status:', getResponse.status);
    }
    
    // Test POST /properties (création d'une propriété de test)
    console.log('➕ Test POST /properties...');
    const testProperty = {
      title: "Test Property - À supprimer",
      description: "Propriété de test créée automatiquement",
      price: 1000000,
      location: "Test Location",
      city: "Test City",
      type: "Villa",
      bedrooms: 3,
      bathrooms: 2,
      area: 200,
      status: "draft",
      featured: false,
      mainImage: "https://via.placeholder.com/600x400",
      additionalImages: ["https://via.placeholder.com/400x300"],
      amenities: ["Test Amenity"],
      yearBuilt: 2023,
      parking: "2",
      garden: false,
      pool: false,
      security: false,
      furnished: false
    };
    
    const postResponse = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProperty),
    });
    
    if (postResponse.ok) {
      const createdProperty = await postResponse.json();
      console.log(`✅ POST /properties réussi - Propriété créée: ${createdProperty.title}`);
      
      // Test PUT /properties/:id (mise à jour)
      console.log(`✏️ Test PUT /properties/${createdProperty._id}...`);
      const updatedProperty = { ...testProperty, title: "Test Property - Mise à jour" };
      
      const putResponse = await fetch(`${API_BASE_URL}/properties/${createdProperty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
      });
      
      if (putResponse.ok) {
        const updated = await putResponse.json();
        console.log(`✅ PUT /properties/${createdProperty._id} réussi - ${updated.title}`);
      } else {
        console.log(`❌ PUT /properties/${createdProperty._id} échoué`);
      }
      
      // Test DELETE /properties/:id (suppression)
      console.log(`🗑️ Test DELETE /properties/${createdProperty._id}...`);
      const deleteResponse = await fetch(`${API_BASE_URL}/properties/${createdProperty._id}`, {
        method: 'DELETE',
      });
      
      if (deleteResponse.ok) {
        console.log(`✅ DELETE /properties/${createdProperty._id} réussi`);
      } else {
        console.log(`❌ DELETE /properties/${createdProperty._id} échoué`);
      }
      
    } else {
      console.log('❌ POST /properties échoué, status:', postResponse.status);
      const errorText = await postResponse.text();
      console.log('Erreur:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erreur lors du test des endpoints:', error.message);
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests de connexion...\n');
  
  const backendConnected = await testBackendConnection();
  
  if (backendConnected) {
    await testPropertyEndpoints();
  } else {
    console.log('\n❌ Impossible de tester les endpoints car le backend n\'est pas accessible.');
    console.log('💡 Assurez-vous que le backend est démarré avec: cd backend && npm start');
  }
  
  console.log('\n🏁 Tests terminés!');
}

// Exécuter les tests si ce script est appelé directement
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  window.runTests = runTests;
  console.log('Tests disponibles. Appelez runTests() pour les exécuter.');
}
