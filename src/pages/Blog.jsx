import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import SEOHead from '../components/SEOHead';

export default function Blog() {
    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['blogPosts'],
        queryFn: () => base44.entities.BlogPost.list('-created_date'),
    });

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <main className="min-h-screen bg-white">
            <SEOHead 
                title="Dancoby Construction Blog | Renovation Tips & Insights"
                description="Expert advice on home renovation, kitchen remodeling, bathroom design, and construction trends in NYC and Long Island."
                keywords="home renovation blog, kitchen remodeling tips, bathroom design ideas, construction trends NYC, renovation advice Brooklyn, home improvement tips, remodeling inspiration, contractor blog NYC"
            />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop)` }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif"
                    >
                        Insights & Inspiration
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
                    >
                        Discover the latest trends, expert tips, and behind-the-scenes stories from our renovation projects.
                    </motion.p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <h3 className="text-xl text-gray-600 font-medium">No posts yet</h3>
                        <p className="text-gray-500 mt-2">Check back soon for new content!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.filter(p => p.status === 'published').map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                <Link to={`${createPageUrl('BlogPost')}?id=${post.id}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    {post.coverImage ? (
                                        <img 
                                            src={post.coverImage} 
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                            <span className="text-4xl font-serif italic opacity-20">Dancoby</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
                                </Link>

                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(post.created_date || Date.now()), 'MMM d, yyyy')}
                                        </span>
                                        {post.author && (
                                            <span className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                {post.author}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 font-serif group-hover:text-red-600 transition-colors">
                                        <Link to={`${createPageUrl('BlogPost')}?id=${post.id}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                        {post.excerpt || "Read more about this topic..."}
                                    </p>

                                    <Link 
                                        to={`${createPageUrl('BlogPost')}?id=${post.id}`}
                                        className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 group/link"
                                    >
                                        Read Article 
                                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}