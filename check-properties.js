// Script pour vérifier les propriétés existantes et leurs IDs
const fetch = require('node-fetch');
const API_BASE_URL = 'http://localhost:3000';

async function checkProperties() {
  console.log('🔍 Vérification des propriétés existantes...\n');
  
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);
    
    if (!response.ok) {
      console.log('❌ Impossible d\'accéder aux propriétés, status:', response.status);
      return;
    }
    
    const properties = await response.json();
    
    if (properties.length === 0) {
      console.log('📭 Aucune propriété trouvée dans la base de données');
      console.log('💡 Ajoutez une propriété via l\'interface admin pour tester');
      return;
    }
    
    console.log(`📋 ${properties.length} propriété(s) trouvée(s):\n`);
    
    properties.forEach((property, index) => {
      console.log(`${index + 1}. 🏠 ${property.title}`);
      console.log(`   🆔 ID: ${property._id}`);
      console.log(`   💰 Prix: ${property.price.toLocaleString()} MAD`);
      console.log(`   📍 Localisation: ${property.location}, ${property.city}`);
      console.log(`   📊 Statut: ${property.status}`);
      console.log(`   🔗 URL de modification: http://localhost:8080/admin/properties/edit/${property._id}`);
      console.log('');
    });
    
    console.log('🎯 Pour tester la modification:');
    console.log('1. Copiez une des URLs de modification ci-dessus');
    console.log('2. Collez-la dans votre navigateur');
    console.log('3. Ou cliquez sur "Modifier" dans la liste admin');
    
  } catch (error) {
    console.log('❌ Erreur lors de la vérification:', error.message);
    console.log('💡 Assurez-vous que le backend est démarré avec: cd backend && npm start');
  }
}

checkProperties();
