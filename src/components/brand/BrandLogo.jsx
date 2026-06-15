import React from 'react';
// Final HypeGrid brand assets live at the project root /assets folder (outside
// /public), so they are imported from source — Vite fingerprints + serves them.
// File casing is exact on purpose (case-sensitive on Linux/Vercel builds).
import logo from '../../../assets/images/brand/logo.png';
import icon from '../../../assets/images/brand/Icon.png';

/**
 * Reusable HypeGrid brand mark.
 * @param {string}  className  sizing/layout classes (width + h-auto recommended)
 * @param {boolean} iconOnly   use the icon mark instead of the full wordmark logo
 * @param {string}  alt        accessible alt text
 */
export default function BrandLogo({ className = '', iconOnly = false, alt = 'HypeGrid' }) {
  return (
    <img
      src={iconOnly ? icon : logo}
      alt={alt}
      className={`object-contain ${className}`.trim()}
      loading="eager"
      decoding="async"
    />
  );
}
