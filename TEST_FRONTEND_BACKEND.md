# Test de Connexion Frontend-Backend pour les Propriétés

## 🚀 Démarrage des Services

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

## 🧪 Tests à Effectuer

### Test 1: Vérification de l'API Backend
1. Ouvrez votre navigateur sur `http://localhost:3000`
2. Vous devriez voir: "Hello World from Node.js backend!"
3. Testez l'endpoint des propriétés: `http://localhost:3000/properties`

### Test 2: Page d'Administration - Liste des Propriétés
1. Allez sur `http://localhost:8080/admin`
2. Connectez-vous avec les identifiants admin
3. Cliquez sur "Gestion des Propriétés"
4. **Vérifiez que** :
   - ✅ La page se charge sans erreur
   - ✅ Les propriétés de la base de données s'affichent
   - ✅ Les boutons "Modifier" et "Supprimer" sont présents

### Test 3: Ajouter une Nouvelle Propriété
1. Dans la page admin des propriétés, cliquez sur "Nouvelle Propriété"
2. Remplissez le formulaire avec ces données de test :
   ```
   Titre: Villa Test Frontend-Backend
   Description: Propriété de test pour vérifier la connexion
   Prix: 1500000
   Localisation: Test Location
   Ville: Casablanca
   Type: Villa
   Chambres: 3
   Salles de bain: 2
   Surface: 250
   ```
3. Cliquez sur "Créer la propriété"
4. **Vérifiez que** :
   - ✅ Un message de succès s'affiche
   - ✅ Vous êtes redirigé vers la liste des propriétés
   - ✅ La nouvelle propriété apparaît dans la liste

### Test 4: Modifier une Propriété
1. Dans la liste des propriétés, cliquez sur "Modifier" pour une propriété
2. Modifiez le titre (ajoutez " - Modifié")
3. Cliquez sur "Mettre à jour la propriété"
4. **Vérifiez que** :
   - ✅ Un message de succès s'affiche
   - ✅ Les modifications sont sauvegardées
   - ✅ Le titre modifié apparaît dans la liste

### Test 5: Sauvegarder un Brouillon
1. Dans la page de modification d'une propriété
2. Modifiez quelques champs
3. Cliquez sur "Sauvegarder le brouillon"
4. **Vérifiez que** :
   - ✅ Un message de succès s'affiche
   - ✅ Le statut passe à "draft"

### Test 6: Supprimer une Propriété
1. Dans la liste des propriétés, cliquez sur l'icône de suppression
2. Confirmez la suppression
3. **Vérifiez que** :
   - ✅ Un message de confirmation s'affiche
   - ✅ La propriété disparaît de la liste
   - ✅ Elle est supprimée de la base de données

### Test 7: Page Publique des Propriétés
1. Allez sur `http://localhost:8080/properties`
2. **Vérifiez que** :
   - ✅ Les propriétés s'affichent (seulement celles avec statut "available" ou "sold")
   - ✅ Les filtres de recherche fonctionnent
   - ✅ Les images et informations s'affichent correctement

### Test 8: Page de Détail d'une Propriété
1. Cliquez sur une propriété dans la liste publique
2. **Vérifiez que** :
   - ✅ Toutes les informations s'affichent
   - ✅ Les images se chargent
   - ✅ La navigation entre images fonctionne
   - ✅ Les équipements s'affichent

## 🔍 Vérifications Techniques

### Console du Navigateur
Ouvrez les outils de développement (F12) et vérifiez :
- ✅ Aucune erreur JavaScript
- ✅ Les requêtes API se font vers `http://localhost:3000`
- ✅ Les réponses HTTP sont 200 (succès)

### Console du Backend
Dans le terminal où le backend tourne, vérifiez :
- ✅ "MongoDB connected" s'affiche
- ✅ "Server running on http://localhost:3000" s'affiche
- ✅ Les requêtes API s'affichent dans les logs

## 🐛 Dépannage

### Erreur 404 sur les API
- Vérifiez que le backend est démarré
- Vérifiez l'URL dans `frontend/src/services/api.ts` (doit être `http://localhost:3000`)

### Erreur de CORS
- Vérifiez que `app.use(cors())` est présent dans `backend/index.js`

### Erreur de Base de Données
- Vérifiez la chaîne de connexion MongoDB dans `backend/.env`
- Vérifiez que MongoDB est accessible

### Erreur 413 (Payload Too Large)
- Vérifiez que `bodyParser.json({ limit: '50mb' })` est configuré dans le backend

## ✅ Checklist de Validation

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] MongoDB se connecte avec succès
- [ ] Page admin des propriétés charge les données
- [ ] Création de propriété fonctionne
- [ ] Modification de propriété fonctionne
- [ ] Suppression de propriété fonctionne
- [ ] Sauvegarde de brouillon fonctionne
- [ ] Page publique affiche les propriétés
- [ ] Page de détail fonctionne
- [ ] Filtres de recherche fonctionnent
- [ ] Aucune erreur dans la console

## 🎯 Résultat Attendu

Si tous les tests passent, votre frontend est **complètement connecté** au backend pour :
- ✅ **CRUD complet** des propriétés
- ✅ **Gestion des états** (brouillon, disponible, vendu)
- ✅ **Interface publique** synchronisée avec l'administration
- ✅ **Validation des données** côté frontend et backend
- ✅ **Gestion d'erreurs** avec messages utilisateur clairs

Votre application Orchid Island est maintenant **entièrement fonctionnelle** ! 🎉
