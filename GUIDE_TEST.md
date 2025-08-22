# Guide de Test - Connexion Frontend/Backend

Ce guide vous explique comment tester la connexion entre le frontend et le backend de l'application Orchid Island.

## 🚀 Démarrage

### 1. Démarrer le Backend

```bash
cd backend
npm install
npm start
```

Le backend devrait démarrer sur `http://localhost:3000`

### 2. Démarrer le Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:8080`

## 🧪 Tests Automatiques

### Test de Connexion API

Pour tester automatiquement la connexion API, vous pouvez utiliser le script de test :

```bash
# Installer node-fetch si nécessaire
npm install node-fetch

# Exécuter le script de test
node test-connection.js
```

Ce script va :
- ✅ Vérifier la connexion au backend
- ✅ Tester GET /properties
- ✅ Tester POST /properties (création)
- ✅ Tester PUT /properties/:id (mise à jour)
- ✅ Tester DELETE /properties/:id (suppression)

## 🔍 Tests Manuels

### 1. Test de l'Administration

1. Allez sur `http://localhost:8080/admin`
2. Connectez-vous avec les identifiants admin
3. Allez dans "Gestion des Propriétés"
4. Testez :
   - ➕ Ajouter une nouvelle propriété
   - ✏️ Modifier une propriété existante
   - 🗑️ Supprimer une propriété
   - 💾 Sauvegarder un brouillon

### 2. Test de la Page Publique

1. Allez sur `http://localhost:8080/properties`
2. Vérifiez que les propriétés s'affichent
3. Testez les filtres de recherche
4. Cliquez sur une propriété pour voir les détails

### 3. Test de la Page de Détail

1. Cliquez sur une propriété depuis la liste
2. Vérifiez que toutes les informations s'affichent :
   - Images
   - Prix
   - Description
   - Équipements
   - Statistiques (chambres, salles de bain, surface)

## 🐛 Dépannage

### Backend ne démarre pas

1. Vérifiez que MongoDB est accessible
2. Vérifiez le fichier `.env` dans le dossier backend
3. Vérifiez les logs d'erreur dans la console

### Frontend ne se connecte pas au Backend

1. Vérifiez que le backend est démarré sur le port 3000
2. Vérifiez la configuration CORS dans `backend/index.js`
3. Ouvrez les outils de développement du navigateur pour voir les erreurs réseau

### Erreurs de Base de Données

1. Vérifiez la chaîne de connexion MongoDB dans `.env`
2. Vérifiez que la base de données est accessible
3. Vérifiez les permissions de la base de données

## 📊 Vérifications de Fonctionnement

### ✅ Backend Fonctionnel
- [ ] Le serveur démarre sans erreur
- [ ] MongoDB se connecte avec succès
- [ ] Les routes `/properties` répondent
- [ ] Les opérations CRUD fonctionnent

### ✅ Frontend Fonctionnel
- [ ] L'application se charge sans erreur
- [ ] Les propriétés s'affichent sur la page publique
- [ ] L'administration fonctionne
- [ ] Les formulaires d'ajout/modification fonctionnent
- [ ] La suppression fonctionne

### ✅ Intégration Complète
- [ ] Les données créées dans l'admin apparaissent sur le site public
- [ ] Les modifications sont sauvegardées en base
- [ ] Les suppressions sont effectives
- [ ] Les images s'affichent correctement
- [ ] Les filtres de recherche fonctionnent

## 🎯 Fonctionnalités Testées

### Administration
- ✅ Connexion admin
- ✅ Liste des propriétés avec données réelles
- ✅ Ajout de propriété avec validation
- ✅ Modification de propriété existante
- ✅ Suppression de propriété
- ✅ Sauvegarde de brouillon

### Site Public
- ✅ Affichage des propriétés disponibles
- ✅ Filtrage par type, prix, localisation
- ✅ Page de détail avec toutes les informations
- ✅ Navigation entre les images
- ✅ Affichage responsive

### API
- ✅ GET /properties - Liste des propriétés
- ✅ GET /properties/:id - Détail d'une propriété
- ✅ POST /properties - Création d'une propriété
- ✅ PUT /properties/:id - Mise à jour d'une propriété
- ✅ DELETE /properties/:id - Suppression d'une propriété

## 📝 Notes

- Les propriétés avec le statut "draft" n'apparaissent que dans l'administration
- Les propriétés "available" et "sold" apparaissent sur le site public
- Les images utilisent des placeholders par défaut si aucune URL n'est fournie
- La validation des données est effectuée côté backend
