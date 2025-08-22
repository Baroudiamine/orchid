import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";
import {
  Building, Save, Eye, ArrowLeft,
  MapPin, DollarSign, Bed, Bath, Square,
  Trash2
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminEditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    status: "available",
    featured: false,
    mainImage: "",
    additionalImages: "",
    amenities: "",
    yearBuilt: "",
    parking: "",
    garden: false,
    pool: false,
    security: false,
    furnished: false,
  });
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }
    if (id) loadPropertyData(id);
  }, [navigate, id]);

  const loadPropertyData = async (propertyId: string) => {
    setIsLoadingData(true);
    try {
      const property = await apiService.getPropertyById(propertyId);

      setFormData({
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        location: property.location,
        city: property.city,
        type: property.type,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        status: property.status,
        featured: property.featured,
        mainImage: property.mainImage,
        additionalImages: property.additionalImages.join(", "),
        amenities: property.amenities.join(", "),
        yearBuilt: property.yearBuilt?.toString() || "",
        parking: property.parking?.toString() || "",
        garden: property.garden,
        pool: property.pool,
        security: property.security,
        furnished: property.furnished,
      });

      setMainImagePreview(property.mainImage);
      setAdditionalImagePreviews(property.additionalImages);
    } catch (error) {
      console.error("Error loading property:", error);
      alert(`Erreur lors du chargement de la propriété: ${(error as Error).message}`);
      navigate("/admin/properties");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setMainImagePreview(result);
        setFormData(prev => ({ ...prev, mainImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAdditionalImagePreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!id) throw new Error("ID de propriété manquant");
      const updatedProperty = await apiService.updateProperty(id, formData);
      console.log("Property updated:", updatedProperty);
      alert("Propriété mise à jour avec succès !");
      navigate("/admin/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      alert(`Erreur lors de la mise à jour: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);

    try {
      if (!id) {
        throw new Error("ID de propriété manquant");
      }

      const draftFormData = { ...formData, status: "draft" };
      const updatedProperty = await apiService.updateProperty(id, draftFormData);
      console.log("Draft saved:", updatedProperty);

      setFormData(prev => ({ ...prev, status: "draft" }));
      alert("Brouillon sauvegardé !");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(`Erreur lors de la sauvegarde du brouillon: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette propriété ?")) {
      setIsLoading(true);
      try {
        if (!id) throw new Error("ID de propriété manquant");
        await apiService.deleteProperty(id);
        alert("Propriété supprimée !");
        navigate("/admin/properties");
      } catch (error) {
        console.error("Error deleting property:", error);
        alert(`Erreur suppression: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const propertyTypes = ["Villa", "Penthouse", "Appartement", "Maison", "Studio", "Duplex", "Triplex", "Terrain"];
  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda"];

  if (isLoadingData) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <p>Chargement de la propriété...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/properties">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Modifier la Propriété</h1>
                  <p className="text-sm text-muted-foreground">Mettre à jour les informations de la propriété</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder le brouillon</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>Informations de Base</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Titre de la propriété *
                      </label>
                      <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Villa Luxury Marina"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description détaillée de la propriété..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Prix (MAD) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="2500000"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Type de propriété *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          required
                        >
                          <option value="">Sélectionner un type</option>
                          {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Localisation *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Ex: Marina"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ville *
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          required
                        >
                          <option value="">Sélectionner une ville</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Chambres *
                        </label>
                        <div className="relative">
                          <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                            placeholder="3"
                            className="pl-10"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Salles de bain *
                        </label>
                        <div className="relative">
                          <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                            placeholder="2"
                            className="pl-10"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Surface (m²) *
                        </label>
                        <div className="relative">
                          <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={formData.area}
                            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                            placeholder="200"
                            className="pl-10"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Aperçu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.featured && (
                      <Badge className="luxury-gradient text-white">Vedette</Badge>
                    )}
                    <h3 className="font-bold text-foreground">
                      {formData.title || "Titre de la propriété"}
                    </h3>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {formData.location && formData.city
                          ? `${formData.location}, ${formData.city}`
                          : "Localisation"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-primary">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold">
                        {formData.price ? `${parseInt(formData.price).toLocaleString()} MAD` : "Prix"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Bed className="w-4 h-4" />
                        <span>{formData.bedrooms || "0"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4" />
                        <span>{formData.bathrooms || "0"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4" />
                        <span>{formData.area || "0"}m²</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/properties")}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="luxury"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Mettre à jour la propriété</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminEditProperty;
