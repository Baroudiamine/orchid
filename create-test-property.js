// Script pour créer une propriété de test
const fetch = require('node-fetch');
const API_BASE_URL = 'http://localhost:3000';

async function createTestProperty() {
  console.log('🏠 Création d\'une propriété de test...\n');
  
  const testProperty = {
    title: "Villa Test pour Modification",
    description: "Cette propriété a été créée pour tester la fonctionnalité de modification. Vous pouvez la modifier et la supprimer en toute sécurité.",
    price: 2500000,
    location: "Marina",
    city: "Casablanca",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    status: "available",
    featured: true,
    mainImage: "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Villa+Test",
    additionalImages: [
      "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Image+2",
      "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Image+3"
    ],
    amenities: [
      "Climatisation",
      "Chauffage central",
      "Cuisine équipée",
      "Terrasse",
      "Vue sur mer",
      "Garage"
    ],
    yearBuilt: 2022,
    parking: "3 places",
    garden: true,
    pool: true,
    security: true,
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
      console.log('✅ Propriété de test créée avec succès !');
      console.log('📋 Détails:');
      console.log(`   🆔 ID: ${createdProperty._id}`);
      console.log(`   🏠 Titre: ${createdProperty.title}`);
      console.log(`   💰 Prix: ${createdProperty.price.toLocaleString()} MAD`);
      console.log(`   📍 Localisation: ${createdProperty.location}, ${createdProperty.city}`);
      console.log('');
      console.log('🔗 URLs pour tester:');
      console.log(`   📝 Modifier: http://localhost:8080/admin/properties/edit/${createdProperty._id}`);
      console.log(`   👁️ Voir détail: http://localhost:8080/properties/${createdProperty._id}`);
      console.log('');
      console.log('🎯 Maintenant vous pouvez:');
      console.log('1. Aller sur http://localhost:8080/admin/properties');
      console.log('2. Cliquer sur "Modifier" pour cette propriété');
      console.log('3. Tester la modification, sauvegarde de brouillon, et suppression');
      
    } else {
      console.log('❌ Échec de la création, status:', response.status);
      const errorText = await response.text();
      console.log('📄 Erreur:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de la création:', error.message);
    console.log('💡 Assurez-vous que le backend est démarré avec: cd backend && npm start');
  }
}

createTestProperty();
