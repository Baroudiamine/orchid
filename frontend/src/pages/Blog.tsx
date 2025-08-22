import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ArrowRight,
  Eye,
  MessageCircle,
  Share2,
  TrendingUp,
  Home,
  Building,
  FileText
} from "lucide-react";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const articles = await apiService.getAllArticles();
      // Filtrer seulement les articles publiés pour le blog public
      const publishedArticles = articles.filter(article => article.status === 'published');
      setBlogPosts(publishedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
      // En cas d'erreur, on peut garder un article par défaut ou afficher un message
      setBlogPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer le temps de lecture estimé
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };
  // Générer les catégories dynamiquement à partir des articles
  const categories = ["All Posts", ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Filtrer les articles par catégorie
  const filteredPosts = selectedCategory === "All Posts"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real Estate Insights
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Luxury Real Estate
                <span className="luxury-gradient bg-clip-text text-transparent"> Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay informed with the latest trends, insights, and expert analysis in luxury real estate markets.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={selectedCategory === category ? "luxury" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading ? (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-6">
              <div className="text-center mb-8">
                <div className="h-6 bg-muted rounded w-32 mx-auto"></div>
              </div>
              <Card className="overflow-hidden animate-pulse">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto bg-muted"></div>
                  <CardContent className="p-8">
                    <div className="h-6 bg-muted rounded mb-4 w-24"></div>
                    <div className="h-8 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-muted rounded mb-6 w-full"></div>
                    <div className="flex space-x-4 mb-6">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-10 bg-muted rounded w-32"></div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post */}
            {filteredPosts.filter(post => post.featured).map((post) => (
              <section key={post._id} className="py-16 bg-background">
            <div className="container mx-auto px-6">
              <div className="text-center mb-8">
                <Badge variant="default" className="luxury-gradient text-primary-foreground">
                  Featured Article
                </Badge>
              </div>
              <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {post.category}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                    </div>
                    <Link to={`/blog/${post._id}`}>
                      <Button variant="luxury" className="w-fit">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        ))}

        {/* Blog Posts Grid */}
        <section className="py-20 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert insights and market analysis from our team of real estate professionals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.filter(post => !post.featured).map((post) => (
                <Link key={post._id} to={`/blog/${post._id}`}>
                  <Card className="group hover:shadow-luxury transition-all duration-300 overflow-hidden h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments || 0}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>

            {/* Message si aucun article */}
            {!isLoading && filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucun article disponible</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === "All Posts"
                    ? "Aucun article publié pour le moment."
                    : `Aucun article dans la catégorie "${selectedCategory}".`}
                </p>
              </div>
            )}

            {!isLoading && filteredPosts.length > 6 && (
              <div className="text-center mt-12">
                <Button variant="elegant" size="lg">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        </section>
        </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
