import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Projects() {
  const projects = [
    {
      title: "The Garden",
      category: "Brownstone Restoration",
      image: "https://static.wixstatic.com/media/c1b522_0463b4b57a704427b7c60a57afd204b4~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2269%201.jpg",
      description: "Complete restoration of a historic Park Slope brownstone with modern amenities"
    },
    {
      title: "Penthouse A",
      category: "Full Renovation",
      image: "https://static.wixstatic.com/media/c1b522_d14a164578e44c94b12a1805090ad37e~mv2.jpeg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2020%20-%20V2.jpeg",
      description: "Luxury penthouse transformation with custom finishes and modern design"
    },
    {
      title: "So Suite",
      category: "Bathroom Remodel",
      image: "https://static.wixstatic.com/media/c1b522_ad38c506d35e4fd6a819d8702ad6b680~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_849%20Central_15.jpg",
      description: "Sophisticated bathroom suite with premium materials and elegant design"
    },
    {
      title: "Modern Kitchen",
      category: "Kitchen Remodel",
      image: "https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_635,h_496,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2013.jpeg",
      description: "Contemporary kitchen with custom cabinetry and high-end appliances"
    },
    {
      title: "Conklin Bathroom",
      category: "Bathroom Remodel",
      image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg",
      description: "Modern bathroom with herringbone flooring and exposed brick accent"
    },
    {
      title: "Living Space",
      category: "Interior Renovation",
      image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2017.jpeg",
      description: "Open concept living room with panoramic city views"
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our portfolio of sophisticated transformations
          </p>
        </div>
      </section>

      {/* 3D Rendering Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Envision Your Upgrade with 3D Rendering and Expert Floor Planning
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            It can be difficult to visualize what your transformations will look like, which is why we offer life-like 3D rendering that ensures we are on the same page and that we incorporate all the features, designs, styles, and materials you want.
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Using our customer-centric and collaborative approach, we can turn your concept into a mock-up so you can enter any new project trusting that the final result will exceed your expectations.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <Card key={idx} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-sm text-white/80 mb-2 block">{project.category}</span>
                    <p className="text-sm text-white/90">{project.description}</p>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Own Project</h2>
          <p className="text-xl text-gray-300 mb-12">
            Let's create something amazing together
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