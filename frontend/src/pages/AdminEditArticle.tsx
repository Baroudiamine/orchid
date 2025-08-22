import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, ArticleFormData } from "@/services/api";
import {
  FileText,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Tag,
  User,
  Calendar,
  Globe,
  Trash2
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminEditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    status: "draft",
    featured: false,
    image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }

    // Load article data
    loadArticleData();
  }, [navigate, id]);

  const loadArticleData = async () => {
    if (!id) {
      navigate("/admin/articles");
      return;
    }

    setIsLoadingData(true);
    try {
      const article = await apiService.getArticleById(id);

      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.tags.join(', '),
        status: article.status,
        featured: article.featured,
        image: article.image
      });

      setImagePreview(article.image);
    } catch (error) {
      console.error("Error loading article:", error);
      alert(`Erreur lors du chargement de l'article: ${(error as Error).message}`);
      navigate("/admin/articles");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);

    try {
      const updatedData = { ...formData, status: "published" };
      await apiService.updateArticle(id, updatedData);

      alert("Article mis à jour avec succès !");
      navigate("/admin/articles");

    } catch (error) {
      console.error("Error updating article:", error);
      alert(`Erreur lors de la mise à jour de l'article: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!id) return;

    setIsLoading(true);

    try {
      const draftData = { ...formData, status: "draft" };
      await apiService.updateArticle(id, draftData);

      alert("Brouillon sauvegardé !");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(`Erreur lors de la sauvegarde du brouillon: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) {
      setIsLoading(true);

      try {
        await apiService.deleteArticle(id);

        alert("Article supprimé avec succès !");
        navigate("/admin/articles");
      } catch (error) {
        console.error("Error deleting article:", error);
        alert(`Erreur lors de la suppression de l'article: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const categories = [
    "Market Analysis",
    "Investment",
    "Location Spotlight",
    "Sustainability",
    "Technology",
    "Global Markets",
    "Luxury Living",
    "Architecture"
  ];

  if (isLoadingData) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">Chargement de l'article...</p>
          </div>
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
                <Link to="/admin/articles">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux articles
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Modifier l'Article</h1>
                  <p className="text-sm text-muted-foreground">ID: {id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
                <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder brouillon
                </Button>
                <Button variant="luxury" form="article-form" type="submit" disabled={isLoading}>
                  <Globe className="w-4 h-4 mr-2" />
                  {isLoading ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <form id="article-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Contenu de l'article</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Titre de l'article *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Les tendances du marché immobilier de luxe en 2024"
                      className="text-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Résumé/Extrait *
                    </label>
                    <Textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Un bref résumé de l'article qui apparaîtra sur la page blog..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Contenu de l'article *
                    </label>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Rédigez le contenu complet de votre article ici..."
                      rows={15}
                      className="font-mono text-sm"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Vous pouvez utiliser du HTML pour le formatage (h2, h3, p, strong, em, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Image principale</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Changer l'image depuis votre ordinateur
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir une nouvelle image
                        </label>
                        {imageFile && (
                          <span className="text-sm text-muted-foreground">
                            {imageFile.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Ou modifier l'URL d'image
                      </label>
                      <Input
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://exemple.com/image.jpg"
                      />
                    </div>
                  </div>

                  {(imagePreview || formData.image) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Aperçu actuel:</p>
                      <img
                        src={imagePreview || formData.image}
                        alt="Aperçu"
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/800/400";
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Article Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Paramètres</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Auteur *
                    </label>
                    <Input
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Nom de l'auteur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tags
                    </label>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="immobilier, luxe, investissement"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Séparez les tags par des virgules
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Statut de publication
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium text-foreground">
                        ⭐ Article mis en avant (Featured)
                      </span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Les articles mis en avant apparaissent en première position sur le blog
                    </p>
                  </div>
                </CardContent>
              </Card>

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
                    <div>
                      <Badge variant="secondary">{formData.category || "Catégorie"}</Badge>
                    </div>
                    <h3 className="font-bold text-foreground">
                      {formData.title || "Titre de l'article"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.excerpt || "Résumé de l'article..."}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{formData.author || "Auteur"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminEditArticle;
