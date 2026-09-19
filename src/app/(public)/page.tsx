import React from 'react';
import type { Metadata } from 'next';
import RichWorldLogo from '@/components/home/RichWorldLogo';
import HomeHero from '@/components/home/HomeHero';
import ToolsMarquee from '@/components/ToolsMarquee';
import HomeCardsGrid from '@/components/home/HomeCardsGrid';
import HomeFooterLine from '@/components/home/HomeFooterLine';

export const metadata: Metadata = {
  title: 'RICH WORLD | Turning ideas into reality',
  description:
    'A digital space for my projects, practices, solutions and future possibilities.',
};

export default function HomePage() {
  return (
    <main className="rich-home-main">
      {/* Top Header Row: Hero on Left, Logo on Top Right */}
      <div className="rich-home-top-row">
        <HomeHero />
        <RichWorldLogo />
      </div>

      {/* Tools Marquee directly under Hero */}
      <ToolsMarquee />

      {/* The Four Main Feature Cards (2x2 Grid) */}
      <HomeCardsGrid />

      {/* Centered Bottom Footer Line */}
      <HomeFooterLine />
    </main>
  );
}
