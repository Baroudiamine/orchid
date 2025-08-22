import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Building,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import "../styles/slider.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    setIsLoading(true);
    try {
      const propertyData = await apiService.getPropertyById(propertyId);
      setProperty(propertyData);
    } catch (error) {
      console.error("Error loading property:", error);
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Chargement de la propriété...</h2>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Propriété non trouvée</h1>
          <Link to="/properties">
            <Button variant="luxury">Retour aux propriétés</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [property.mainImage, ...property.additionalImages].filter(Boolean);

  const nextImage = () => {
    if (allImages.length > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          prev === allImages.length - 1 ? 0 : prev + 1
        );
        setIsTransitioning(false);
      }, 100);
    }
  };

  const prevImage = () => {
    if (allImages.length > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          prev === 0 ? allImages.length - 1 : prev - 1
        );
        setIsTransitioning(false);
      }, 100);
    }
  };

  const goToImage = (index: number) => {
    if (!isTransitioning && index !== currentImageIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(index);
        setIsTransitioning(false);
      }, 100);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [property]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'decimal', minimumFractionDigits: 0 }).format(price) + ' MAD';
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Back Navigation */}
        <section className="py-6 bg-background border-b">
          <div className="font-lora container mx-auto px-6">
            <Link to="/properties" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </section>

        {/* Property Images Slider */}
        <section className="py-0">
          <div className="container mx-auto px-6">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-luxury mb-8 group hover:shadow-luxury-hover smooth-transition-slow">
              {/* Images */}
              <div className="relative w-full h-full">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
                      index === currentImageIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
                    }`}
                  >
                    <img src={image || "/api/placeholder/800/500"} alt={`${property.title} - Image ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button onClick={prevImage} disabled={isTransitioning} className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 p-4 rounded-full opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImage} disabled={isTransitioning} className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 p-4 rounded-full opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-6 right-6 bg-black/30 text-white px-5 py-3 rounded-2xl text-sm font-semibold">
                <span className="text-primary font-bold text-lg">{currentImageIndex + 1}</span>
                <span className="text-white/70 mx-1"> / </span>
                <span className="text-white/90">{allImages.length}</span>
              </div>
            </div>

            {/* Image Title Overlay */}
            <div className="text-center mt-6">
              <h3 className="text-lg font-lora font-bold text-foreground mb-2">
                Image {currentImageIndex + 1} de {allImages.length}
              </h3>
              <p className="text-muted-foreground">{property.title} - Galerie Photos</p>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default" className="font-lora luxury-gradient text-primary-foreground">
                        {property.status}
                      </Badge>
                      {property.featured && (
                        <Badge variant="outline" className="font-lora border-primary text-primary">
                          <Star className="w-3 h-3 mr-1" /> Featured
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">{property.title}</h1>
                  <div className="font-lora flex items-center space-x-2 text-muted-foreground mb-6">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{property.location}, {property.city}</span>
                  </div>
                  <div className="font-lora text-3xl md:text-4xl font-bold text-primary">{formatPrice(property.price)}</div>
                </div>

                {/* Stats, Description & Amenities */}
                {/* ... Tu peux ajouter ici les autres sections comme dans ton code original */}
              </div>

              {/* Sidebar */}
              {/* ... Contact et Info Cards */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
