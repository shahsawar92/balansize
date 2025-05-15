"use client";
import DOMPurify from "isomorphic-dompurify";
import React from "react";

// import DOMPurify from 'dompurify';
import "@/styles/globals.css";

const SanitizeHtmlWidget = ({ htmlContent }: { htmlContent: string }) => {
  // Use DOMPurify to sanitize the input HTML
  // const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  const clean = DOMPurify.sanitize(htmlContent);

  return (
    <div
      className='sanitizedHTML font-roboto text-cps-projects text-sm text-muted text-gray-800'
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default SanitizeHtmlWidget;
