import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function About() {
  return (
    <main className="bg-[#faf9f7]">
      <SEOHead 
        title="About Us | 20+ Years of NYC Home Renovation Excellence"
        description="Learn about Dancoby Construction's 20+ years of NYC renovation experience. Licensed, insured contractors with 3-year warranty."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6"
            >
              Our Story
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-light leading-[1.1] text-[#2d2d2d] mb-8"
            >
              More Than Just<br /><span className="italic">Remodelers</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#2d2d2d]/70 leading-relaxed"
            >
              With over twenty years of experience serving clients across New York City, 
              Dancoby truly understands the city's high standards, expectations, and common 
              challenges in the industry. We go the extra mile—always with a smile—to stand 
              out as a leader, delivering results that exceed what others offer.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[21/9] overflow-hidden"
          >
            <img 
              src="https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_1920,h_1080,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg"
              alt="Beautiful renovation"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-light leading-relaxed text-[#2d2d2d]"
          >
            We are builders and creative thinkers who love collaborating with clients, 
            architects, and makers who share our passion for <span className="italic">thoughtful renovations</span>.
          </motion.h2>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {[
              {
                title: 'Our Mission',
                description: 'We know how stressful a renovation project can be, but we do everything possible to make sure it is as smooth and painless as possible. That means we take pride in our efficiency and leave every home looking better than when we arrived.'
              },
              {
                title: 'Our Commitment',
                description: 'Our commitment to customer and employee safety is paramount. We understand that renovations can be invasive, so our team always ensures your family, floors, furniture, and belongings are safe and protected before any work begins.'
              },
              {
                title: 'Our Standards',
                description: 'Dancoby Construction exhibits the highest standards in the industry and leverages a customer-first approach so that we stay on your side from the first call to the final inspection—backed by our 3-year warranty.'
              }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-t border-[#e8e4df] pt-8"
              >
                <h3 className="text-xl font-light text-[#2d2d2d] mb-4">{value.title}</h3>
                <p className="text-[#2d2d2d]/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6">Meet the Founder</p>
              <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d] mb-8">Ralph</h2>
              <div className="space-y-6 text-[#2d2d2d]/70 leading-relaxed">
                <p>
                  Ralph is a dedicated general contractor with over 20 years' experience. 
                  Alongside his team, Ralph coordinates trades, builds partnerships, and 
                  collaborates with architects, engineers, vendors, and homeowners to ensure 
                  efficient and budget-friendly completion of every project.
                </p>
                <p>
                  With a deep knowledge of building and code regulations, expertise in team 
                  building, and devotion to leadership and quality control management, Ralph 
                  remains an industry leader with a commitment to client satisfaction.
                </p>
                <p>
                  During his free time Ralph enjoys playing pickleball, biking, or relaxing 
                  by the beach with his Goldendoodle, Jaxx. He currently lives in Rockaway 
                  Beach NY and holds a general contractor license in New York and Nassau County.
                </p>
              </div>
              <Link
                to={createPageUrl('Contact')}
                className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-[#2d2d2d] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#8b7355] transition-colors duration-300"
              >
                Let's Talk
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://static.wixstatic.com/media/efb67d_56ea9dfe4a0f437a8bc6abb241a18a24~mv2.jpeg/v1/fill/w_551,h_493,fp_0.54_0.31,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Favorite-Aragon-Headshot-94.jpeg"
                  alt="Ralph - Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 lg:py-24 bg-[#2d2d2d] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4bdb4] mb-6">Our Promise</p>
              <h2 className="text-4xl lg:text-5xl font-light mb-8">
                Complete Satisfaction,<br /><span className="italic">Guaranteed</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Our dedication to you means we prioritize open, honest communication every 
                step of the way—from initial concept through final completion. We understand 
                how challenging it can be to trust a team with your home—your castle—and your budget.
              </p>
              <p className="text-white/70 leading-relaxed">
                That's exactly why we back every project with a 3-year warranty, giving you 
                complete peace of mind that the finished result will meet or exceed your expectations.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="https://static.wixstatic.com/media/c1b522_7231b6f8cbaf46cf8dd85c643a4230f7~mv2.jpg/v1/fill/w_467,h_418,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2311%201.jpg"
                alt="Beautiful kitchen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6">Ready to Begin?</p>
          <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d] mb-8">
            Let's Create Something<br /><span className="italic">Beautiful Together</span>
          </h2>
          <Link
            to={createPageUrl('Contact')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#2d2d2d] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#8b7355] transition-colors duration-300"
          >
            Start Your Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}