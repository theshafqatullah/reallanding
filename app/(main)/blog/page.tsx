import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowRight, TrendingUp, Home, DollarSign } from "lucide-react";

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "2024 Real Estate Market Trends: What Buyers and Sellers Need to Know",
    excerpt: "Comprehensive analysis of current market conditions, pricing trends, and expert predictions for the upcoming year in real estate.",
    category: "Market Analysis",
    author: "Sarah Johnson",
    date: "January 15, 2024",
    readTime: "8 min read",
    image: "/api/placeholder/600/300"
  };

  const blogPosts = [
    {
      id: 2,
      title: "First-Time Homebuyer's Complete Guide",
      excerpt: "Everything you need to know about buying your first home, from pre-approval to closing.",
      category: "Buying Tips",
      author: "Emily Rodriguez",
      date: "January 12, 2024",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Top 10 Home Staging Tips to Sell Fast",
      excerpt: "Professional staging techniques that can help your property sell quicker and for better prices.",
      category: "Selling Tips",
      author: "Michael Chen",
      date: "January 10, 2024",
      readTime: "5 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Investment Properties: Calculating ROI",
      excerpt: "Learn how to properly evaluate investment properties and calculate potential returns.",
      category: "Investment",
      author: "David Thompson",
      date: "January 8, 2024",
      readTime: "7 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Understanding Mortgage Types and Rates",
      excerpt: "A breakdown of different mortgage options and how to choose the best one for your situation.",
      category: "Financing",
      author: "Lisa Park",
      date: "January 5, 2024",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Luxury Home Features That Add Value",
      excerpt: "Premium amenities and features that significantly increase luxury property values.",
      category: "Luxury",
      author: "James Wilson",
      date: "January 3, 2024",
      readTime: "4 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 7,
      title: "Property Management Best Practices",
      excerpt: "Essential tips for landlords to effectively manage their rental properties.",
      category: "Property Management",
      author: "Sarah Johnson",
      date: "December 28, 2023",
      readTime: "8 min read",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = [
    { name: "Market Analysis", count: 12, icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Buying Tips", count: 18, icon: <Home className="h-4 w-4" /> },
    { name: "Selling Tips", count: 15, icon: <DollarSign className="h-4 w-4" /> },
    { name: "Investment", count: 9, icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Financing", count: 7, icon: <DollarSign className="h-4 w-4" /> },
    { name: "Luxury", count: 5, icon: <Home className="h-4 w-4" /> }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Real Estate Blog</h1>
        <p className="text-xl text-gray-600">
          Stay informed with the latest real estate insights, market trends, and expert advice.
        </p>
      </div>

      {/* Featured Post */}
      <Card className="mb-12 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Featured Image</span>
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <Badge className="mb-4">{featuredPost.category}</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {featuredPost.title}
            </h2>
            <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{featuredPost.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
            <Button>
              Read Full Article
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Article Image</span>
                </div>
                <div className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Read More
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Categories */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="text-primary">{category.icon}</div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Newsletter */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest real estate insights and market updates.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button className="w-full" size="sm">
                Subscribe
              </Button>
            </div>
          </Card>

          {/* Popular Posts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h3>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post, index) => (
                <div key={index} className="flex space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}