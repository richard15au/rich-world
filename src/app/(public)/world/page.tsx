import type { Metadata } from 'next';
import WorldViewport from '@/components/world/WorldViewport';

export const metadata: Metadata = {
  title: 'RICH CITY | 2.5D Interactive World',
  description:
    'Explore RICH CITY — a realistic 2.5D isometric digital miniature city connecting RICH WORLD HQ, RichAcademy, Technology & AI Studio, RichBuild, RichFinance, and our vibrant commercial districts.',
};

export default function WorldPage() {
  return <WorldViewport />;
}
