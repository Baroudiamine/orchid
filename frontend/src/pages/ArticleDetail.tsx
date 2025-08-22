import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Article } from "@/services/api";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Eye,
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const articleData = await apiService.getArticleById(articleId);
      setArticle(articleData);
    } catch (error) {
      console.error("Error loading article:", error);
      setError("Article non trouvé ou erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer le temps de lecture
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-muted rounded mb-8 w-1/2"></div>
                <div className="h-64 bg-muted rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // État d'erreur ou article non trouvé
  if (error || !article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "L'article que vous recherchez n'existe pas."}
            </p>
            <Link to="/blog">
              <Button variant="luxury">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Link to="/blog">
                  <Button variant="outline" size="sm" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au Blog
                  </Button>
                </Link>
                
                <Badge variant="secondary" className="mb-4">
                  {article.category}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {article.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{calculateReadTime(article.content)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{article.views || 0} vues</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{article.comments || 0} commentaires</span>
                  </div>
                </div>
              </div>
              
              {/* Featured Image */}
              {article.image && (
                <div className="mb-12">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-96 object-cover rounded-lg shadow-luxury"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/800/400";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Sharing */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Partager cet article</h3>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copier le lien
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    J'aime
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
                
                <Link to="/blog">
                  <Button variant="luxury">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
