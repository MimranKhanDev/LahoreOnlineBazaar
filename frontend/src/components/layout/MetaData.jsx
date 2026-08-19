// src/components/layout/MetaData.jsx

import React from "react";
import { Helmet } from "react-helmet-async";

const MetaData = ({ title, description, keywords, image, url }) => {
  const siteTitle = title ? `${title} | ECOMMERCE` : "ECOMMERCE - Shop Now";
  const siteDescription =
    description || "Your one-stop shop for amazing products at the best prices";
  const siteKeywords = keywords || "ecommerce, shop, buy online, products";
  const siteImage = image || "https://yourdomain.com/og-image.jpg";
  const siteUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph (OG) Tags for Social Media */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ECOMMERCE" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />

      {/* Theme Color */}
      <meta name="theme-color" content="#ef4444" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default MetaData;
