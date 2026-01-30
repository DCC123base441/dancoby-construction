import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from 'lucide-react';

export default function Press() {
  const articles = [
    {
      source: "Brownstoner",
      title: "The Insider: Park Slope Reno Yields Airy, Clutter-Free Apartment",
      excerpt: "A rethink of a prewar walkup leveled ceilings and floors and created built-in storage for its minimalist occupants. by Cara Greenberg",
      date: "Aug 1, 2025",
      readTime: "3 min read",
      link: "https://www.brownstoner.com/interiors-renovation/park-slope-prewar-apartment-renovation-studio8-storage-minimalist/",
      image: "https://static.wixstatic.com/media/c1b522_ef142567bb894db394ca2e7f4fadca32~mv2.webp/v1/fill/w_980,h_429,al_c,q_90,enc_avif,quality_auto/c1b522_ef142567bb894db394ca2e7f4fadca32~mv2.webp"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#3d3d3d] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Press & News</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Latest updates and featured articles about our work
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-12">
            {articles.map((article, idx) => (
              <Card key={idx} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-full">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      {article.source && (
                        <span className="font-semibold text-red-600 uppercase tracking-wider">{article.source}</span>
                      )}
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {article.excerpt}
                    </p>
                    <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white w-fit">
                      <a href={article.link} target="_blank" rel="noopener noreferrer">
                        Read Full Article
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State for More Articles */}
          <div className="mt-20 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">More Articles Coming Soon</h3>
              <p className="text-gray-600 mb-8">
                Stay tuned for more updates about our projects and industry insights
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}