import React from 'react';

export default function HomeHero() {
  return (
    <section className="rich-home-hero" aria-label="Hero Introduction">
      <span className="rich-hero-eyebrow">WELCOME TO RICH WORLD</span>
      <h1 className="rich-hero-title">
        Build. Learn. Explore.{' '}
        <span className="rich-hero-grow">
          Grow.
          <svg
            className="rich-hero-grow-underline"
            viewBox="0 0 100 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 2 8 C 25 2, 70 3, 98 9"
              stroke="#2563eb"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>
      <p className="rich-hero-desc">
        A digital space for my projects, practices, solutions and future possibilities.
      </p>
    </section>
  );
}
