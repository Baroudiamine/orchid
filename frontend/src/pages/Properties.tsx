import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Property } from "@/services/api";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Star,
  Eye,
  ArrowRight,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const PropertiesPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const propertiesData = await apiService.getAllProperties();
      // Filtrer seulement les propriétés disponibles pour le public
      const availableProperties = propertiesData.filter(property =>
        property.status === 'available' || property.status === 'sold'
      );
      setProperties(availableProperties);
    } catch (error) {
      console.error("Error loading properties:", error);
      // En cas d'erreur, on peut afficher un message ou utiliser des données par défaut
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' MAD';
  };

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const searchText = `${property.title} ${property.location} ${property.city}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || property.type.toLowerCase() === filterType.toLowerCase();

    const matchesPrice = (() => {
      switch (priceRange) {
        case "0-5M": return property.price <= 5000000;
        case "5M-15M": return property.price > 5000000 && property.price <= 15000000;
        case "15M-30M": return property.price > 15000000 && property.price <= 30000000;
        case "30M+": return property.price > 30000000;
        default: return true;
      }
    })();

    return matchesSearch && matchesType && matchesPrice;
  });

  const propertyTypes = ["all", "Villa", "Penthouse", "Appartement", "Chalet", "Riad", "Duplex", "Studio", "Maison"];

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
                  Nos Propriétés d'Exception
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Découvrez notre sélection exclusive de propriétés de luxe au Maroc
                </p>
              </div>
            </div>
          </section>

          {isLoading ? (
            <section className="py-20">
              <div className="container mx-auto px-6">
                <div className="text-center">
                  <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Chargement des propriétés...</h2>
                  <p className="text-muted-foreground">Veuillez patienter</p>
                </div>
              </div>
            </section>
          ) : (
            <>

          {/* Filters Section */}
          <section className="py-12 bg-background border-b">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Search */}
                <div>
                  <Input
                    type="text"
                    placeholder="Rechercher une propriété..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Type Filter */}
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type === "all" ? "Tous les types" : type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="all">Tous les prix</option>
                    <option value="0-5M">0 - 5M MAD</option>
                    <option value="5M-15M">5M - 15M MAD</option>
                    <option value="15M-30M">15M - 30M MAD</option>
                    <option value="30M+">30M+ MAD</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-muted-foreground">
                    {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} trouvée{filteredProperties.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Properties Grid */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <Card key={property._id} className="group overflow-hidden hover:shadow-luxury transition-all duration-500">
                    <div className="relative">
                      {/* Property Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={property.mainImage || "/api/placeholder/400/300"}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Featured Badge */}
                        {property.featured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="luxury-gradient text-primary-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(property._id)}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(property._id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>

                        {/* Quick View Button */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Link to={`/properties/${property._id}`}>
                            <Button variant="secondary" size="sm" className="bg-white/90 text-foreground hover:bg-white">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir les détails
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          {property.status}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Property Info */}
                      <div className="mb-4">
                        <h3 className="text-xl font-playfair font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.location}, {property.city}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {property.description}
                        </p>
                      </div>

                      {/* Property Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-100">
                        <div className="text-center">
                          <Bed className="w-4 h-4 text-primary mx-auto mb-1" />
                          <span className="text-sm font-medium text-foreground">{property.bedrooms}</span>
                          <div className="text-xs text-muted-foreground">Chambres</div>
                        </div>
                        <div className="text-center">
                          <Bath className="w-4 h-4 text-primary mx-auto mb-1" />
                          <span className="text-sm font-medium text-foreground">{property.bathrooms}</span>
                          <div className="text-xs text-muted-foreground">Salles de bain</div>
                        </div>
                        <div className="text-center">
                          <Square className="w-4 h-4 text-primary mx-auto mb-1" />
                          <span className="text-sm font-medium text-foreground">{property.area}</span>
                          <div className="text-xs text-muted-foreground">m²</div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.amenities.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(property.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {property.yearBuilt && `Construit en ${property.yearBuilt}`}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link to={`/properties/${property._id}`}>
                            <Button variant="luxury" size="sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredProperties.length === 0 && (
                <div className="text-center py-20">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aucune propriété trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </section>
          </>
          )}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PropertiesPage;
