import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Target, Heart, Shield, Award } from 'lucide-react';
import EstimatorButton from '../components/EstimatorButton';
import SEOHead from '../components/SEOHead';

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="About Us | 20+ Years of NYC Home Renovation Excellence"
        description="Learn about Dancoby Construction's 20+ years of NYC renovation experience. Licensed, insured contractors with 5-year warranty. Meet our founder and team."
        keywords="about Dancoby Construction, NYC renovation company, licensed contractor Brooklyn, home renovation experience, general contractor history"
      />
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_1920,h_1080,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">More Than Just Remodelers</h1>
          <p className="text-xl md:text-2xl leading-relaxed mb-4">
            With over twenty years of experience working with clients in New York City, Dancoby knows the standards, expectations, and grievances in the industry and does everything possible to stand above competition with a smile as an industry leader.
          </p>
          <p className="text-xl md:text-2xl">
            Our primary goal is to make clients happy with an elegant, functional, and stress-free renovation.
          </p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center leading-relaxed">
            We are builders and creative thinkers who love collaborating with clients, architects, and makers who share our passion for thoughtful renovations.
          </h2>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Our Mission */}
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We know how stressful a renovation project can be, but we do everything possible to make sure it is as smooth and painless as possible.
              </p>
              <p className="text-gray-700 leading-relaxed">
                That means we take pride in our efficiency and leave every home looking better than when we arrived
              </p>
            </Card>

            {/* Our Commitment */}
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Commitment</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our commitment to customer and employee safety is paramount.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We understand that renovations can be invasive and dangerous, so our team always makes sure that you, your family, and your floors, furniture, and personal belongings are safe and protected before any work begins.
              </p>
            </Card>

            {/* Our Standards */}
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Standards</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Dancoby Construction exhibits the highest standards in the industry and leverages a customer-first approach so that we stay on your side from the first call to the final inspection.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In fact, we will be on your side for the long haul and even include a 5-year warranty on your project, no matter how big or small.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Bathroom Image Section */}
      <section className="py-0">
        <img 
          src="https://static.wixstatic.com/media/c1b522_4f61cdea0afd4a25baa42f7f902c624e~mv2.jpeg/v1/fill/w_1920,h_629,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_4f61cdea0afd4a25baa42f7f902c624e~mv2.jpeg"
          alt="Modern bathroom"
          className="w-full h-[500px] object-cover"
        />
      </section>

      {/* Commitment to Perfection */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Commitment to Perfection</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We don't merely strive for excellence, we strive for perfection on every project, every time. Our passion resonates in everything we do from our friendly smile to our attention to detail, collaborative approach, and commitment to a flawless result.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Plus, our contractors are licensed and insured so you are always protected. Our dedication to you, the customer, means we encourage open, honest communication throughout the collaborative process from concept to completion.
            </p>
            <Button 
              asChild
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg mt-6"
            >
              <Link to={createPageUrl('Contact')}>Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Complete Satisfaction Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Complete Satisfaction, Guaranteed</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our dedication to you, the customer, means we encourage open, honest communication throughout the collaborative process from concept to completion. Contact us today with any questions or concerns you may have.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Plus, trusting a business to take care of your home, your castle, and your budget can be difficult. That's why we offer a 5-year warranty on all our projects, so you can enter a contract or project with comfort knowing that the end result will meet or exceed your expectations.
              </p>
            </div>
            <div>
              <img 
                src="https://static.wixstatic.com/media/c1b522_7231b6f8cbaf46cf8dd85c643a4230f7~mv2.jpg/v1/fill/w_467,h_418,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2311%201.jpg"
                alt="Bright kitchen window"
                className="w-full h-[450px] object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About The Founder */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://static.wixstatic.com/media/efb67d_56ea9dfe4a0f437a8bc6abb241a18a24~mv2.jpeg/v1/fill/w_551,h_493,fp_0.54_0.31,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Favorite-Aragon-Headshot-94.jpeg"
                alt="Ralph - Founder"
                className="w-full h-[550px] object-cover rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">About The Founder</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Ralph is a dedicated general contractor with over 20 years' experience. Alongside his team, Ralph coordinates trades, builds partnerships, and collaborates with architects, engineers, vendors, and homeowners to ensure efficient and budget-friendly completion of every project.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With a deep knowledge of building and code regulations, expertise in team building, and devotion to leadership and quality control management, Ralph remains an industry leader with a commitment to client satisfaction.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                During his free time Ralph enjoys playing pickleball, biking, or relaxing by the beach with his Goldendoodle, Jaxx. He currently lives in Rockaway Beach NY and holds a general contractor license in New York and Nassau County.
              </p>
              <Button 
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg mt-6"
              >
                <Link to={createPageUrl('Contact')}>Let's Talk</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Let's work together to create the space of your dreams
          </p>
          <EstimatorButton size="large" />
        </div>
      </section>
    </main>
  );
}