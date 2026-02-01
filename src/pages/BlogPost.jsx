import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Loader2, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import SEOHead from '../components/SEOHead';
import { createPageUrl } from '../utils';

export default function BlogPost() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['blogPost', id],
        queryFn: () => base44.entities.BlogPost.filter({ id }),
        enabled: !!id
    });

    const post = posts[0];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                <Button asChild>
                    <Link to={createPageUrl('Blog')}>Back to Blog</Link>
                </Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <SEOHead 
                title={`${post.title} | Dancoby Construction Blog`}
                description={post.excerpt}
                image={post.coverImage}
            />

            {/* Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-50 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
            />

            <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                {/* Back Link */}
                <Link 
                    to={createPageUrl('Blog')}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Articles
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                            Blog
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.created_date || Date.now()), 'MMMM d, yyyy')}
                        </span>
                        {post.author && (
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl md:leading-tight font-bold text-gray-900 font-serif mb-8">
                        {post.title}
                    </h1>

                    {post.coverImage && (
                        <div className="rounded-2xl overflow-hidden shadow-xl aspect-[21/9] mb-8 relative group">
                            <img 
                                src={post.coverImage} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-red-600 hover:prose-a:text-red-700 prose-img:rounded-xl prose-img:shadow-lg">
                    <ReactMarkdown>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Share / Footer */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-500 text-sm font-medium">
                        Share this article:
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 border-gray-200" title="Share on Facebook">
                            <Facebook className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-50 hover:text-sky-500 border-gray-200" title="Share on Twitter">
                            <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-700 border-gray-200" title="Share on LinkedIn">
                            <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-50 border-gray-200" title="Copy Link" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                        }}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </article>

            {/* Newsletter CTA */}
            <section className="bg-gray-50 py-16 mt-12 border-t border-gray-200">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Stay Inspired</h3>
                    <p className="text-gray-600 mb-8">
                        Join our newsletter for the latest renovation tips, trends, and exclusive project reveals.
                    </p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}