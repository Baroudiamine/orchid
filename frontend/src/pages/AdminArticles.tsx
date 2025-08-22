import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Article } from "@/services/api";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  Filter
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminArticles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }

    loadArticles();
  }, [navigate]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const articlesData = await apiService.getAllArticles();
      setArticles(articlesData);
      console.log("Articles chargés:", articlesData.map(a => ({ id: a._id, title: a.title })));
    } catch (error) {
      console.error("Error loading articles:", error);
      alert(`Erreur lors du chargement des articles: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) {
      try {
        await apiService.deleteArticle(articleId);
        alert("Article supprimé avec succès !");
        loadArticles(); // Recharger la liste
      } catch (error) {
        console.error("Error deleting article:", error);
        alert(`Erreur lors de la suppression de l'article: ${(error as Error).message}`);
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    const searchText = `${article.title} ${article.author} ${article.category}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || article.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default" className="bg-green-100 text-green-800">Publié</Badge>;
      case "draft":
        return <Badge variant="secondary">Brouillon</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      console.log("Delete article:", id);
      // Handle delete logic here
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Gestion des Articles</h1>
                  <p className="text-sm text-muted-foreground">Gérer les articles de blog</p>
                </div>
              </div>
              <Link to="/admin/articles/add">
                <Button variant="luxury">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Article
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-muted rounded mb-4 w-full"></div>
                        <div className="flex space-x-4">
                          <div className="h-4 bg-muted rounded w-20"></div>
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-4 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-muted rounded"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Articles List */
            <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article._id} className="hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{article.title}</h3>
                        {getStatusBadge(article.status)}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views || 0} vues</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link to={`/admin/articles/edit/${article._id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/blog/${article._id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {!isLoading && filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun article trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== "all" 
                    ? "Aucun article ne correspond à vos critères de recherche."
                    : "Commencez par créer votre premier article."}
                </p>
                <Link to="/admin/articles/add">
                  <Button variant="luxury">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminArticles;
