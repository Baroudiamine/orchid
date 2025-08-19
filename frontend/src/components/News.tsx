import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const news = [
  {
    id: 1,
    title: "Tendances du Marché Immobilier Luxe 2024",
    excerpt: "Analyse complète des évolutions du marché immobilier haut de gamme au Maroc et perspectives d'investissement.",
    category: "Market Insights",
    featured: true,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Nouveau Projet Exclusif à Casablanca",
    excerpt: "Découvrez notre dernière acquisition : un penthouse exceptionnel avec vue panoramique sur l'océan.",
    category: "Nouveauté",
    featured: false,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Guide d'Investissement Immobilier Maroc",
    excerpt: "Conseils d'experts pour investir dans l'immobilier de luxe au Maroc : opportunités et stratégies gagnantes.",
    category: "Investissement",
    featured: false,
    image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
];

const News = () => {
  return (
    <section id="news" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-cream/50 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-deep-blue font-inter text-sm font-medium">Actualités</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Latest <span className="luxury-gradient bg-clip-text text-transparent">News</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Restez informé des dernières tendances du marché immobilier de luxe, 
            de nos nouveaux projets et de nos conseils d'experts.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <Card className="group overflow-hidden shadow-elegant hover:shadow-luxury transition-luxury border-0 bg-card h-full">
              <div className="relative">
                {/* Image with overlay */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={news[0].image}
                    alt={news[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Badge className="luxury-gradient text-primary-foreground font-inter mb-4">
                        {news[0].category}
                      </Badge>
                      <h3 className="font-playfair text-3xl font-bold mb-4">
                        {news[0].title}
                      </h3>
                      <p className="font-inter text-white/90 text-lg leading-relaxed">
                        {news[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-charcoal font-inter">
                    Featured
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-end">
                  <Button variant="luxury" size="sm" className="group">
                    Lire plus
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Articles */}
          <div className="space-y-6">
            {news.slice(1).map((article) => (
              <Card key={article.id} className="group overflow-hidden shadow-subtle hover:shadow-elegant transition-luxury border-0 bg-card">
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-charcoal font-inter">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-smooth">
                    {article.title}
                  </h3>
                  <p className="font-inter text-muted-foreground text-sm mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto font-inter">
                      Lire →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button variant="elegant" size="lg" className="font-playfair text-lg px-10 py-6 h-auto">
            Voir toutes les actualités
          </Button>
        </div>
      </div>
    </section>
  );
};

export default News;
