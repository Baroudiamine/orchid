// Test pour vérifier que le problème de payload est résolu
const API_BASE_URL = 'http://localhost:3000';

async function testLargePayload() {
  console.log('🧪 Test de payload volumineux...');
  
  // Créer une propriété avec beaucoup de données
  const largeProperty = {
    title: "Test Property avec beaucoup de données - " + "x".repeat(100),
    description: "Description très longue: " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(50),
    price: 1500000,
    location: "Test Location très détaillée",
    city: "Test City",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    status: "draft",
    featured: false,
    mainImage: "https://via.placeholder.com/800x600",
    additionalImages: [
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400"
    ],
    amenities: [
      "Climatisation", "Chauffage central", "Cuisine équipée", "Terrasse",
      "Vue sur mer", "Garage", "Piscine", "Jardin", "Sécurité 24h/24",
      "Ascenseur", "Balcon", "Cave", "Parking", "Internet", "Télévision"
    ],
    yearBuilt: 2023,
    parking: "3 places de parking couvertes",
    garden: true,
    pool: true,
    security: true,
    furnished: false
  };
  
  try {
    console.log('📤 Envoi de la propriété de test...');
    console.log('📊 Taille approximative:', JSON.stringify(largeProperty).length, 'caractères');
    
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(largeProperty),
    });
    
    if (response.ok) {
      const createdProperty = await response.json();
      console.log('✅ Succès! Propriété créée:', createdProperty.title);
      console.log('🆔 ID:', createdProperty._id);
      
      // Nettoyer en supprimant la propriété de test
      console.log('🧹 Suppression de la propriété de test...');
      const deleteResponse = await fetch(`${API_BASE_URL}/properties/${createdProperty._id}`, {
        method: 'DELETE',
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Propriété de test supprimée avec succès');
      } else {
        console.log('⚠️ Impossible de supprimer la propriété de test');
      }
      
    } else {
      console.log('❌ Échec:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('📄 Détails de l\'erreur:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erreur de réseau:', error.message);
  }
}

async function testBackendStatus() {
  console.log('🔍 Vérification du statut du backend...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Backend accessible:', text);
      return true;
    } else {
      console.log('❌ Backend non accessible, status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Impossible de se connecter au backend:', error.message);
    return false;
  }
}

async function runPayloadTest() {
  console.log('🚀 Test de résolution du problème de payload...\n');
  
  const backendOk = await testBackendStatus();
  
  if (backendOk) {
    await testLargePayload();
  } else {
    console.log('\n💡 Assurez-vous que le backend est démarré avec: cd backend && npm start');
  }
  
  console.log('\n🏁 Test terminé!');
}

// Exécuter le test
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runPayloadTest();
} else {
  // Browser environment
  window.runPayloadTest = runPayloadTest;
  console.log('Test disponible. Appelez runPayloadTest() pour l\'exécuter.');
}
