// API service pour la communication avec le backend
const API_BASE_URL = 'http://localhost:3000';

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  city: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: string;
  featured: boolean;
  mainImage: string;
  additionalImages: string;
  amenities: string;
  yearBuilt: string;
  parking: string;
  garden: boolean;
  pool: boolean;
  security: boolean;
  furnished: boolean;
}

export interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  featured: boolean;
  mainImage: string;
  additionalImages: string[];
  amenities: string[];
  yearBuilt?: number;
  parking: string;
  garden: boolean;
  pool: boolean;
  security: boolean;
  furnished: boolean;
}

export interface Property extends PropertyData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaces pour les articles
export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: string;
  featured: boolean;
  image: string;
  tags: string;
}

export interface ArticleData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: string;
  featured: boolean;
  image: string;
  tags: string[];
}

export interface Article extends ArticleData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  readTime?: string;
  views?: number;
  comments?: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP! status: ${response.status}`;

        // Messages d'erreur spécifiques selon le code de statut
        switch (response.status) {
          case 413:
            errorMessage = 'Les données sont trop volumineuses. Veuillez réduire la taille des images ou du contenu.';
            break;
          case 400:
            errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
            break;
          case 404:
            errorMessage = 'Propriété non trouvée. Elle a peut-être été supprimée ou l\'ID est incorrect.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          default:
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch {
              // Ignore si on ne peut pas parser la réponse JSON
            }
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de réseau');
    }
  }

  // Convertir les données du formulaire en données pour l'API
  private convertFormDataToApiData(formData: PropertyFormData): PropertyData {
    // Validation de la taille des données
    const description = formData.description.length > 5000
      ? formData.description.substring(0, 5000) + '...'
      : formData.description;

    const amenitiesArray = formData.amenities
      ? formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity).slice(0, 20) // Limiter à 20 équipements
      : [];

    const additionalImagesArray = formData.additionalImages
      ? formData.additionalImages.split(',').map(url => url.trim()).filter(url => url).slice(0, 10) // Limiter à 10 images
      : [];

    return {
      title: formData.title.substring(0, 200), // Limiter le titre
      description: description,
      price: parseFloat(formData.price) || 0,
      location: formData.location.substring(0, 100),
      city: formData.city.substring(0, 50),
      type: formData.type,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      area: parseFloat(formData.area) || 0,
      status: formData.status,
      featured: formData.featured,
      mainImage: formData.mainImage,
      additionalImages: additionalImagesArray,
      amenities: amenitiesArray,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      parking: formData.parking.substring(0, 50),
      garden: formData.garden,
      pool: formData.pool,
      security: formData.security,
      furnished: formData.furnished
    };
  }

  // Méthodes API pour les propriétés
  async getAllProperties(): Promise<Property[]> {
    return this.request<Property[]>('/properties');
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.request<Property>(`/properties/${id}`);
  }

  async createProperty(formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async createPropertyDraft(formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    propertyData.status = 'draft';
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id: string, formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Convertir les données du formulaire d'article en données pour l'API
  private convertArticleFormDataToApiData(formData: ArticleFormData): ArticleData {
    return {
      title: formData.title.substring(0, 200),
      content: formData.content,
      excerpt: formData.excerpt.substring(0, 500),
      author: formData.author.substring(0, 100),
      category: formData.category,
      status: formData.status,
      featured: formData.featured,
      image: formData.image,
      tags: formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).slice(0, 10)
        : []
    };
  }

  // Méthodes API pour les articles
  async getAllArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles');
  }

  async getArticleById(id: string): Promise<Article> {
    return this.request<Article>(`/articles/${id}`);
  }

  async createArticle(formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async createArticleDraft(formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    articleData.status = 'draft';
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: string, formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    return this.request<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthode utilitaire pour vérifier la connexion au backend
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
