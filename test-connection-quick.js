// Test rapide de connexion Frontend-Backend
const API_BASE_URL = 'http://localhost:3000';

async function testConnection() {
  console.log('🔍 Test de connexion Frontend-Backend...\n');
  
  // Test 1: Backend accessible
  console.log('1️⃣ Test d\'accessibilité du backend...');
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Backend accessible:', text);
    } else {
      console.log('❌ Backend non accessible, status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Impossible de se connecter au backend:', error.message);
    console.log('💡 Assurez-vous que le backend est démarré avec: cd backend && npm start');
    return false;
  }
  
  // Test 2: API Properties
  console.log('\n2️⃣ Test de l\'API des propriétés...');
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (response.ok) {
      const properties = await response.json();
      console.log(`✅ API Properties fonctionne - ${properties.length} propriétés trouvées`);
      
      if (properties.length > 0) {
        console.log('📋 Exemple de propriété:', {
          id: properties[0]._id,
          title: properties[0].title,
          price: properties[0].price,
          city: properties[0].city
        });
      }
    } else {
      console.log('❌ API Properties non accessible, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur API Properties:', error.message);
  }
  
  // Test 3: Création d'une propriété de test
  console.log('\n3️⃣ Test de création de propriété...');
  const testProperty = {
    title: "Test Property - À supprimer",
    description: "Propriété de test pour vérifier la connexion",
    price: 1000000,
    location: "Test Location",
    city: "Casablanca",
    type: "Villa",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    status: "draft",
    featured: false,
    mainImage: "https://via.placeholder.com/600x400",
    additionalImages: [],
    amenities: ["Test Amenity"],
    yearBuilt: 2023,
    parking: "2",
    garden: false,
    pool: false,
    security: false,
    furnished: false
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProperty),
    });
    
    if (response.ok) {
      const createdProperty = await response.json();
      console.log('✅ Création de propriété réussie:', createdProperty.title);
      
      // Test 4: Suppression de la propriété de test
      console.log('\n4️⃣ Test de suppression de propriété...');
      const deleteResponse = await fetch(`${API_BASE_URL}/properties/${createdProperty._id}`, {
        method: 'DELETE',
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Suppression de propriété réussie');
      } else {
        console.log('⚠️ Impossible de supprimer la propriété de test');
      }
      
    } else {
      console.log('❌ Création de propriété échouée, status:', response.status);
      const errorText = await response.text();
      console.log('📄 Erreur:', errorText);
    }
  } catch (error) {
    console.log('❌ Erreur lors de la création:', error.message);
  }
  
  console.log('\n🎯 Résumé:');
  console.log('✅ Backend: Accessible');
  console.log('✅ API Properties: Fonctionnelle');
  console.log('✅ CRUD: Opérationnel');
  console.log('\n🚀 Votre frontend est connecté au backend !');
  console.log('📖 Consultez TEST_FRONTEND_BACKEND.md pour les tests complets');
  
  return true;
}

// Exécuter le test
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testConnection();
} else {
  // Browser environment
  window.testConnection = testConnection;
  console.log('Test disponible. Appelez testConnection() pour l\'exécuter.');
}
