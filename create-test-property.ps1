# Script PowerShell pour créer une propriété de test
$API_BASE_URL = "http://localhost:3000"

Write-Host "🏠 Création d'une propriété de test..." -ForegroundColor Cyan

$testProperty = @{
    title = "Villa Test pour Modification"
    description = "Cette propriété a été créée pour tester la fonctionnalité de modification. Vous pouvez la modifier et la supprimer en toute sécurité."
    price = 2500000
    location = "Marina"
    city = "Casablanca"
    type = "Villa"
    bedrooms = 4
    bathrooms = 3
    area = 350
    status = "available"
    featured = $true
    mainImage = "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Villa+Test"
    additionalImages = @(
        "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Image+2",
        "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Image+3"
    )
    amenities = @(
        "Climatisation",
        "Chauffage central",
        "Cuisine équipée",
        "Terrasse",
        "Vue sur mer",
        "Garage"
    )
    yearBuilt = 2022
    parking = "3 places"
    garden = $true
    pool = $true
    security = $true
    furnished = $false
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/properties" -Method Post -Body $testProperty -ContentType "application/json"
    
    Write-Host "✅ Propriété de test créée avec succès !" -ForegroundColor Green
    Write-Host "📋 Détails:" -ForegroundColor Yellow
    Write-Host "   🆔 ID: $($response._id)" -ForegroundColor White
    Write-Host "   🏠 Titre: $($response.title)" -ForegroundColor White
    Write-Host "   💰 Prix: $($response.price) MAD" -ForegroundColor White
    Write-Host "   📍 Localisation: $($response.location), $($response.city)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 URLs pour tester:" -ForegroundColor Yellow
    Write-Host "   📝 Modifier: http://localhost:8080/admin/properties/edit/$($response._id)" -ForegroundColor Cyan
    Write-Host "   👁️ Voir détail: http://localhost:8080/properties/$($response._id)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎯 Maintenant vous pouvez:" -ForegroundColor Green
    Write-Host "1. Aller sur http://localhost:8080/admin/properties"
    Write-Host "2. Cliquer sur 'Modifier' pour cette propriété"
    Write-Host "3. Tester la modification, sauvegarde de brouillon, et suppression"
    
} catch {
    Write-Host "❌ Erreur lors de la création: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que le backend est démarré avec: cd backend && npm start" -ForegroundColor Yellow
}
