import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Home as HomeIcon, Building2, Paintbrush, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 inline-block px-8 py-12 rounded-lg">
            <div className="border-t-2 border-white/40 w-48 mx-auto mb-8" />
            <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
              Dancoby<br />Construction Company
            </h1>
            <p className="text-xl md:text-2xl text-white/90 tracking-wide">
              Sophisticated-Customer Centric-Transformations
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Who We Are</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              With over twenty years of experience and a dedication to customer satisfaction, we work with you, your budget, and your style to turn your renovation dreams into realities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            <div>
              <img 
                src="https://static.wixstatic.com/media/c1b522_74cf22378412427c8944f5e8a0fa3851~mv2.jpeg/v1/fill/w_366,h_654,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%209.jpeg"
                alt="Bar interior"
                className="w-full h-[600px] object-cover rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-gray-900 leading-tight">
                Home is where the heart is.
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Which is why your space should promote cozy relaxation and evoke your unique personality and taste.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                That's why our team of professionals provides a customer-centric experience with complete collaboration that ensures we turn your conceptual ideas into sophisticated transformations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Our Services</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Full-Service Rejuvenation For Any Space
            </h3>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              {
                title: "Interior Renovations",
                description: "Complete transformation of living spaces for form and function.",
                image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2017.jpeg"
              },
              {
                title: "Kitchen & Bath Remodeling",
                description: "Modern upgrades tailored to your lifestyle.",
                image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg"
              },
              {
                title: "Brownstone Restorations",
                description: "Preserving the charm, enhancing the function.",
                image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg"
              },
              {
                title: "Townhouses & Apartments",
                description: "Expert craftsmanship for high-end residences.",
                image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg"
              }
            ].map((service, idx) => (
              <Card key={idx} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="text-lg font-bold mb-2">{service.title}</h4>
                    <p className="text-sm text-white/90">{service.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">About Us</h2>
              <h3 className="text-4xl font-bold text-gray-900 leading-tight">
                By working with your goals, budget, schedule, and lifestyle.
              </h3>
              <p className="text-2xl text-gray-700 font-light">
                We will help you create an enviable space that you're proud to call home.
              </p>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg mt-6">
                Learn More
              </Button>
            </div>
            <div>
              <img 
                src="https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_635,h_496,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2013.jpeg"
                alt="Modern Kitchen"
                className="w-full h-[500px] object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment to Perfection Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <img 
              src="https://static.wixstatic.com/media/efb67d_a261152299dc4434a364c708901dffc5~mv2.jpg/v1/fill/w_1068,h_371,al_c,q_85,enc_avif,quality_auto/efb67d_a261152299dc4434a364c708901dffc5~mv2.jpg"
              alt="Kitchen"
              className="w-full h-[400px] object-cover rounded-lg shadow-xl"
            />
          </div>
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-4xl font-bold text-gray-900">Commitment to Perfection</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              We don't merely strive for excellence…we strive for perfection on every project, every time. Our passion resonates in everything we do from our friendly smile to our attention to detail, collaborative approach, and commitment to a flawless result.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Plus, our contractors are licensed and insured so you are always protected. Our dedication to you, the customer, means we encourage open, honest communication throughout the collaborative process from concept to completion.
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg mt-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12">Client Testimonials</h2>
          
          <Card className="p-12 bg-gray-50 border-0 shadow-lg">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                A
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
              "Dancoby Construction did an absolutely incredible job renovating our entire home and they finished ON TIME! The owner, Ralph Abekassis, is open, transparent, fair and respectful. He was very communicative with regular onsite meetings, very clear around any changes or issues and while we were away he sent us daily updates with pictures on progress"
            </p>
            <p className="text-gray-900 font-semibold">Amanda O</p>
            <p className="text-gray-500 text-sm">Homeowner, Brooklyn, NY</p>
          </Card>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Our Projects</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
              Envision Your Upgrade with 3D Rendering and Expert Floor Planning
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              It can be difficult to visualize what your transformations will look like, which is why we offer life-like 3D rendering that ensures we are on the same page and that we incorporate all the features, designs, styles, and materials you want.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Using our customer-centric and collaborative approach, we can turn your concept into a mock-up so you can enter any new project trusting that the final result will exceed your expectations.
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "The Garden",
                image: "https://static.wixstatic.com/media/c1b522_0463b4b57a704427b7c60a57afd204b4~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2269%201.jpg"
              },
              {
                title: "Penthouse A",
                image: "https://static.wixstatic.com/media/c1b522_d14a164578e44c94b12a1805090ad37e~mv2.jpeg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2020%20-%20V2.jpeg"
              },
              {
                title: "So Suite",
                image: "https://static.wixstatic.com/media/c1b522_ad38c506d35e4fd6a819d8702ad6b680~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_849%20Central_15.jpg"
              }
            ].map((project, idx) => (
              <Card key={idx} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold">{project.title}</h4>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Our Blogs</h2>
            <h3 className="text-4xl font-bold text-gray-900">Latest Updates</h3>
          </div>

          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-full">
                <img 
                  src="https://static.wixstatic.com/media/c1b522_ef142567bb894db394ca2e7f4fadca32~mv2.webp/v1/fill/w_980,h_429,al_c,q_90,enc_avif,quality_auto/c1b522_ef142567bb894db394ca2e7f4fadca32~mv2.webp"
                  alt="Blog post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-12 flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  The Insider: Park Slope Reno Yields Airy, Clutter-Free Apartment
                </h4>
                <p className="text-gray-600 leading-relaxed mb-6">
                  A rethink of a prewar walkup leveled ceilings and floors and created built-in storage for its minimalist occupants. by Cara Greenberg Got...
                </p>
                <p className="text-sm text-gray-500">Aug 1, 2025 • 3 min read</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Space?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Let's turn your renovation dreams into reality
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-7 text-lg font-semibold">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}