import { useEffect } from 'react';

export default function SEOHead({ 
  title = "Dancoby Construction Company", 
  description = "NYC's premier home renovation contractor. Kitchen & bath remodeling, brownstone restorations, interior renovations. 20+ years experience, 5-year warranty. Brooklyn & Long Island.",
  keywords = "home renovation Brooklyn, kitchen remodeling NYC, bathroom renovation New York, brownstone restoration, interior renovation contractor, construction company Brooklyn",
  canonical,
  ogImage = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg",
  ogType = "website",
  structuredData
}) {
  useEffect(() => {
    // Update document title
    document.title = title.includes('Dancoby') ? title : `${title} | Dancoby Construction Company`;
    
    // Update or create meta tags
    const updateMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'Dancoby Construction Company');
    
    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:site_name', 'Dancoby Construction Company', true);
    updateMeta('og:locale', 'en_US', true);
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    
    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    // Favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png');

    // Structured Data (JSON-LD)
    const existingScript = document.querySelector('script[data-seo-structured]');
    if (existingScript) existingScript.remove();

    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": "Dancoby Construction Company",
      "description": "NYC's premier home renovation contractor specializing in kitchen & bath remodeling, brownstone restorations, and interior renovations.",
      "url": "https://dancoby.com",
      "telephone": "+1-516-684-9766",
      "email": "info@dancoby.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Brooklyn",
        "addressRegion": "NY",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "40.6782",
        "longitude": "-73.9442"
      },
      "areaServed": ["Brooklyn", "Manhattan", "Queens", "Long Island", "New York City"],
      "priceRange": "$$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "50"
      },
      "openingHours": "Mo-Fr 08:00-20:00",
      "sameAs": [
        "https://www.instagram.com/dancobyconstruction",
        "https://www.facebook.com/dancobyconstruction"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-structured', 'true');
    script.textContent = JSON.stringify(structuredData || defaultStructuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-seo-structured]');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, structuredData]);

  return null;
}