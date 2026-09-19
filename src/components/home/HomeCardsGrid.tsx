import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Code2,
  Briefcase,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';

export default function HomeCardsGrid() {
  return (
    <div className="rich-cards-grid" aria-label="Main Portfolio Features">
      {/* ==================================================
          CARD 1: ABOUT (Top Left)
         ================================================== */}
      <article className="rich-feature-card rich-card-about">
        <div className="rich-card-left">
          <div>
            <div className="rich-card-top-icon">
              <User size={22} />
            </div>
            <h2 className="rich-card-title">About</h2>
            <p className="rich-card-subtitle">Who I am and what I do.</p>
            <p className="rich-card-desc">
              My background, skills, values and the vision behind RICH WORLD.
            </p>
          </div>
          <Link href="/about" className="rich-card-btn" title="Explore About page">
            <span>Explore</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="rich-card-right rich-card-right-about">
          <div className="rich-card-img-container">
            <Image
              src="/images/cards/about-artwork.png"
              alt="About illustration"
              width={575}
              height={406}
              className="rich-card-img rich-card-img-about"
              priority
            />
          </div>
        </div>
      </article>

      {/* ==================================================
          CARD 2: PROJECTS & PRACTICES (Top Right)
         ================================================== */}
      <article className="rich-feature-card rich-card-projects">
        <div className="rich-card-left">
          <div>
            <div className="rich-card-top-icon">
              <Code2 size={22} />
            </div>
            <h2 className="rich-card-title">Projects & Practices</h2>
            <p className="rich-card-subtitle">My technical builds and hands-on practices.</p>

            <ul className="rich-practices-list" aria-label="Technical practice areas">
              <li className="rich-practice-item">
                <span className="rich-practice-dot" />
                <span>Softwares</span>
              </li>
              <li className="rich-practice-item">
                <span className="rich-practice-dot" />
                <span>Network Labs</span>
              </li>
              <li className="rich-practice-item">
                <span className="rich-practice-dot" />
                <span>DevOps / Platform Practices</span>
              </li>
              <li className="rich-practice-item">
                <span className="rich-practice-dot" />
                <span>Cyber Security Practices</span>
              </li>
              <li className="rich-practice-item">
                <span className="rich-practice-dot" />
                <span>AI Practices</span>
              </li>
            </ul>
          </div>

          <Link href="/projects" className="rich-card-btn" title="Explore Projects & Practices">
            <span>Explore</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="rich-card-right rich-card-right-projects">
          <div className="rich-card-img-container">
            <Image
              src="/images/cards/projects-artwork.png"
              alt="Projects & Practices illustration"
              width={657}
              height={400}
              className="rich-card-img rich-card-img-projects"
              priority
            />
          </div>
        </div>
      </article>

      {/* ==================================================
          CARD 3: BUSINESS SOLUTIONS (Bottom Left)
         ================================================== */}
      <article className="rich-feature-card rich-card-business">
        <div className="rich-card-left">
          <div>
            <div className="rich-card-top-icon">
              <Briefcase size={22} />
            </div>
            <h2 className="rich-card-title">Business Solutions</h2>
            <p className="rich-card-subtitle">Technology applied to real-world business problems.</p>
            <p className="rich-card-desc">
              Exploring solutions for different industries such as education, healthcare, technology and more.
            </p>
          </div>

          <div className="rich-card-bottom-action">
            <Link href="/businesses" className="rich-card-btn" title="Explore Business Solutions">
              <span>Explore</span>
              <ArrowRight size={17} />
            </Link>

            <div className="rich-card-handwritten-business" aria-hidden="true">
              <span>Real Problems</span>
              <span>Practical Solutions</span>
              <svg className="rich-handwritten-business-stroke" viewBox="0 0 100 8" fill="none">
                <path d="M 2 5 C 25 2, 70 3, 98 6" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rich-card-right rich-card-right-business">
          <div className="rich-card-img-container">
            <Image
              src="/images/cards/business-artwork.png"
              alt="Business Solutions illustration"
              width={579}
              height={401}
              className="rich-card-img rich-card-img-business"
              priority
            />
          </div>
        </div>
      </article>

      {/* ==================================================
          CARD 4: 2D WORLD (Bottom Right)
         ================================================== */}
      <article className="rich-feature-card rich-card-world">
        <div className="rich-card-left">
          <div>
            <div className="rich-card-top-icon">
              <Gamepad2 size={22} />
            </div>
            <h2 className="rich-card-title">2D World</h2>
            <p className="rich-card-subtitle">
              Explore RICH CITY — an interactive digital city (coming soon).
            </p>
            <p className="rich-card-desc">
              Walk around, discover buildings, meet characters and explore my ecosystem in a 2D world.
            </p>
          </div>

          <Link href="/world" className="rich-card-btn" title="Enter Rich City 2D World">
            <span style={{ color: '#0284c7' }}>Enter Rich City</span>
            <ArrowRight size={17} color="#0284c7" />
          </Link>
        </div>

        <div className="rich-card-right rich-card-right-world">
          <div className="rich-card-img-container">
            <div className="rich-card-handwritten-world" aria-hidden="true">
              <span>Explore</span>
              <span>Discover</span>
              <span>Interact</span>
            </div>
            <Image
              src="/images/cards/world-artwork.png"
              alt="2D World Rich City illustration"
              width={662}
              height={441}
              className="rich-card-img rich-card-img-world"
              priority
            />
          </div>
        </div>
      </article>
    </div>
  );
}
