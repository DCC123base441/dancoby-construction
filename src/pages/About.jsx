import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Award, Users, Clock, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#3d3d3d] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Dancoby</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Sophisticated-Customer Centric-Transformations
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_635,h_496,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2013.jpeg"
                alt="Our Work"
                className="w-full h-[500px] object-cover rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                With over twenty years of experience and a dedication to customer satisfaction, we work with you, your budget, and your style to turn your renovation dreams into realities.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We don't merely strive for excellence…we strive for perfection on every project, every time. Our passion resonates in everything we do from our friendly smile to our attention to detail, collaborative approach, and commitment to a flawless result.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Plus, our contractors are licensed and insured so you are always protected. Our dedication to you, the customer, means we encourage open, honest communication throughout the collaborative process from concept to completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Dancoby</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine expertise, quality, and dedication in every project
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "20+ Years Experience",
                description: "Over two decades of excellence in construction and renovation"
              },
              {
                icon: Users,
                title: "Customer Focused",
                description: "Your satisfaction and vision are at the heart of everything we do"
              },
              {
                icon: Shield,
                title: "Licensed & Insured",
                description: "Fully certified contractors with comprehensive insurance coverage"
              },
              {
                icon: Award,
                title: "Quality Guaranteed",
                description: "Commitment to perfection and flawless results on every project"
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="p-8 text-center border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Let's work together to create the space of your dreams
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-7 text-lg font-semibold"
          >
            <Link to={createPageUrl('Contact')}>Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}