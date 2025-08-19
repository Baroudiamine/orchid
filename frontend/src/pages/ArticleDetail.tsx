import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  // Sample article data - in a real app, this would come from an API
  const articles = {
    "1": {
      title: "Luxury Real Estate Market Trends 2024",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      views: "2.1k",
      comments: 24,
      category: "Market Analysis",
      image: "/api/placeholder/800/400",
      content: `
        <p>The luxury real estate market in 2024 is experiencing unprecedented growth, driven by evolving buyer preferences and global economic shifts. As we navigate through this dynamic landscape, several key trends are shaping the future of premium property investments.</p>
        
        <h2>Market Overview</h2>
        <p>The global luxury real estate market has shown remarkable resilience, with prime properties in key markets appreciating by an average of 8-12% year-over-year. This growth is particularly pronounced in emerging luxury destinations and established premium locations.</p>
        
        <h2>Key Trends Driving Growth</h2>
        <h3>1. Sustainable Luxury</h3>
        <p>Environmental consciousness is no longer optional in luxury real estate. High-net-worth individuals are increasingly seeking properties that combine opulence with sustainability. Features like solar panels, smart home technology, and eco-friendly materials are becoming standard expectations.</p>
        
        <h3>2. Remote Work Revolution</h3>
        <p>The shift towards remote and hybrid work models has fundamentally changed what buyers seek in luxury properties. Home offices, dedicated workspace areas, and high-speed connectivity infrastructure are now essential features.</p>
        
        <h3>3. Wellness-Focused Design</h3>
        <p>Luxury properties are incorporating wellness amenities such as home gyms, spa facilities, meditation rooms, and air purification systems. The focus on health and well-being has become a significant driver in property selection.</p>
        
        <h2>Investment Opportunities</h2>
        <p>For investors, the current market presents unique opportunities. Emerging markets in Southeast Asia and Latin America are showing strong potential, while traditional luxury markets like Monaco, Manhattan, and London continue to offer stability and prestige.</p>
        
        <h2>Looking Ahead</h2>
        <p>As we progress through 2024, the luxury real estate market is expected to maintain its upward trajectory. Smart investors who understand these trends and adapt their strategies accordingly will be well-positioned to capitalize on the evolving landscape.</p>
      `,
      tags: ["Market Analysis", "Investment", "Luxury Properties", "2024 Trends"]
    },
    "2": {
      title: "Investment Strategies for Premium Properties",
      author: "Michael Chen",
      date: "March 12, 2024",
      readTime: "7 min read",
      views: "1.8k",
      comments: 18,
      category: "Investment",
      image: "/api/placeholder/800/400",
      content: `
        <p>Investing in premium properties requires a sophisticated approach that goes beyond traditional real estate investment strategies. This comprehensive guide explores proven methodologies for maximizing returns in the luxury property market.</p>
        
        <h2>Understanding Premium Property Investment</h2>
        <p>Premium property investment differs significantly from conventional real estate investing. The market dynamics, buyer behavior, and investment timelines all require specialized knowledge and strategic planning.</p>
        
        <h2>Core Investment Strategies</h2>
        <h3>1. Location-First Approach</h3>
        <p>In luxury real estate, location isn't just important—it's everything. Prime locations with limited supply and high demand consistently outperform broader market trends.</p>
        
        <h3>2. Value-Add Opportunities</h3>
        <p>Identifying properties with renovation or development potential can significantly enhance returns. This strategy requires expertise in luxury design trends and understanding of high-end buyer preferences.</p>
        
        <h3>3. Portfolio Diversification</h3>
        <p>Spreading investments across different luxury markets and property types helps mitigate risk while capturing various growth opportunities.</p>
        
        <h2>Risk Management</h2>
        <p>Premium property investments, while potentially lucrative, come with unique risks that must be carefully managed through proper due diligence and market analysis.</p>
      `,
      tags: ["Investment Strategy", "Premium Properties", "Portfolio Management", "Risk Assessment"]
    }
  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button variant="luxury">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
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
        {/* Article Header */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-6">
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                {article.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>{article.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{article.comments} comments</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-8">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Article Image */}
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg shadow-luxury"
              />
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

              {/* Social Share */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Share this article</h3>
                <div className="flex space-x-4">
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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-20 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Related Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Continue reading our latest insights
              </p>
            </div>
            
            <div className="text-center">
              <Link to="/blog">
                <Button variant="luxury" size="lg">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
