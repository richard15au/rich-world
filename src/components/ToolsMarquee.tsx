'use client';

import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface ToolItem {
  name: string;
  renderIcon: () => React.ReactNode;
}

const TOOLS_LIST: ToolItem[] = [
  {
    name: 'Visual Studio Code',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M17.5 2.5L7.5 10.5L3 7L1.5 8.5L5.5 12L1.5 15.5L3 17L7.5 13.5L17.5 21.5L22.5 19V5L17.5 2.5Z"
          fill="#007ACC"
        />
        <path
          d="M17.5 16.5L9.5 12L17.5 7.5V16.5Z"
          fill="#1F9CF0"
        />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="90" fill="#000000" />
        <path
          d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
          fill="#ffffff"
        />
        <path d="M115.816 54H127.93V106.848L115.816 91.1896V54Z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    name: 'React',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="16" fill="#3178C6" />
        <path
          d="M74.1 82.2c1.7 2.8 4.1 4.9 7.3 6.3 3.2 1.4 6.8 2.1 10.8 2.1 4.5 0 8.2-.9 11.2-2.7 3-1.8 4.5-4.5 4.5-8.1 0-2.3-.7-4.2-2.2-5.7-1.5-1.5-3.5-2.7-6.2-3.6-2.7-.9-6.1-1.9-10.2-3-5.2-1.4-9.5-3.1-12.8-5.1-3.3-2-5.9-4.5-7.6-7.5-1.7-3-2.6-6.7-2.6-11 0-4.8 1.3-9 3.8-12.7 2.5-3.7 6.1-6.5 10.6-8.5 4.6-2 9.9-3 16.1-3 5.4 0 10.3.9 14.7 2.6 4.4 1.7 8 4.3 10.8 7.6l-8.6 8.6c-3.6-3.8-8.2-5.7-13.9-5.7-4 0-7.3.8-9.8 2.4-2.5 1.6-3.8 3.9-3.8 7 0 2.2.8 4 2.3 5.3 1.6 1.3 3.6 2.4 6.2 3.2 2.6.8 5.9 1.7 9.8 2.7 5.4 1.4 9.9 3.1 13.3 5.1 3.4 2 6 4.6 7.7 7.7 1.8 3.1 2.6 6.9 2.6 11.4 0 5.1-1.3 9.6-4 13.5-2.7 3.9-6.4 6.9-11.3 9-4.9 2.1-10.7 3.2-17.4 3.2-6.6 0-12.6-1.1-17.9-3.4-5.3-2.3-9.4-5.7-12.4-10.3l9.8-7.8zM42.1 35.6H58v69.9H42.1V35.6zM24.8 23.1h62.4v12.5H24.8V23.1z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 2L3 9.5V24.5L16 32L29 24.5V9.5L16 2Z"
          fill="#539E43"
        />
        <path
          d="M16 5.5L6 11.5V22.5L16 28.5L26 22.5V11.5L16 5.5Z"
          fill="#333333"
        />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#336791">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
  },
  {
    name: 'Prisma',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#2D3748">
        <path d="M19.12 18.25L13.56 2.6c-.2-.55-.78-.85-1.33-.68-.2.06-.38.18-.5.35L3.6 15.65c-.34.48-.23 1.15.26 1.49.17.12.37.18.57.17l13.5-.02c.6 0 1.07-.48 1.07-1.07 0-.2-.06-.4-.18-.57l.3-.4z" fill="#0C344B"/>
        <path d="M13.5 3L4.5 16.5l14 1.5L13.5 3z" fill="#5A67D8" opacity="0.3"/>
      </svg>
    ),
  },
  {
    name: 'Supabase',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M21.362 9.354H12V.343a.75.75 0 0 0-1.312-.493L.614 13.064a.75.75 0 0 0 .563 1.258h9.363v9.011a.75.75 0 0 0 1.312.493l10.074-13.214a.75.75 0 0 0-.564-1.258z" fill="#3ECF8E" />
      </svg>
    ),
  },
  {
    name: 'Neon',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#00E599" />
        <path d="M7 16L13 6V11H17L11 20V15H7Z" fill="#000000" />
      </svg>
    ),
  },
  {
    name: 'Docker',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#2496ED">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186zm5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zm-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zM23.6 11.2c-.3-.2-.9-.4-1.5-.4-.1 0-.3 0-.4.1-.4.2-.8.5-1.2.9-.3.3-.6.5-1 .5-.2 0-.4 0-.6-.1-.3-.2-.6-.4-1-.5-.4-.1-.8-.2-1.3-.2-.5 0-.9.1-1.3.2h-.1V10c0-.5-.4-.9-.9-.9h-14c-.5 0-.9.4-.9.9v1.9c-.3.1-.7.2-1 .4-.4.2-.8.5-1.2.9-.3.3-.6.5-1 .5-.2 0-.4 0-.6-.1-.2-.1-.4-.2-.5-.3-.1 0-.1 0-.2-.1C.1 13.9 0 14.8 0 15.6c0 1.9.8 3.6 2.1 4.7 1.3 1.1 3 1.7 5.1 1.7 5.4 0 9.8-3.4 11.1-8.2.7.2 1.5.3 2.3.3 1.2 0 2.3-.3 3.3-.8.2-.1.3-.2.4-.3.1-.1.2-.2.2-.3.4-.6.6-1.2.6-1.8 0-.4-.1-.8-.3-1.1"/>
      </svg>
    ),
  },
  {
    name: 'AWS',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#FF9900">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 12.36c-1.32.96-3.08 1.48-4.72 1.48-2.32 0-4.41-.88-6-2.35-.12-.11-.03-.28.13-.23 1.7.53 3.51.81 5.37.81 1.5 0 3.09-.27 4.56-.84.21-.08.38.15.2.32l.46-.19zm1.19-2.02c-.17-.22-.98-.1-1.36-.06-.11.01-.13-.08-.03-.15.66-.46 1.74-.33 2.06.07.31.4-.08 1.45-.71 1.96-.1.08-.17.04-.12-.06.19-.34.33-1.54.16-1.76z"/>
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#06B6D4">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
      </svg>
    ),
  },
  {
    name: 'Linux',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#FCC624">
        <path d="M12 2C9.5 2 8 3.5 8 6v4c-1.5 1-2.5 2.5-2.5 4.5 0 2 .8 3.8 2 5 .5 1.5 1.5 2.5 4.5 2.5s4-1 4.5-2.5c1.2-1.2 2-3 2-5 0-2-1-3.5-2.5-4.5V6c0-2.5-1.5-4-4-4z" fill="#000000"/>
        <circle cx="10" cy="6.5" r="1" fill="#FFFFFF"/>
        <circle cx="14" cy="6.5" r="1" fill="#FFFFFF"/>
        <path d="M10.5 8.5C11 9.5 13 9.5 13.5 8.5" stroke="#FFA500" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'VMware',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#607078">
        <path d="M18.8 6.2h-3.6V2.6c0-.3-.3-.6-.6-.6H2.6c-.3 0-.6.3-.6.6v12c0 .3.3.6.6.6h3.6v3.6c0 .3.3.6.6.6h12c.3 0 .6-.3.6-.6V6.8c0-.3-.3-.6-.6-.6zm-15.6 7.8V3.2h10.8v3H6.8c-.3 0-.6.3-.6.6V14H3.2zm14.4 3.6H6.8v-3h7.4c.3 0 .6-.3.6-.6V6.8h2.8v10.8z"/>
      </svg>
    ),
  },
  {
    name: 'OPNsense',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#D94F00">
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v4.93c0 4.52-3.13 8.74-7 9.88-3.87-1.14-7-5.36-7-9.88V8.07l7-3.89z"/>
      </svg>
    ),
  },
  {
    name: 'Git',
    renderIcon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#F05032">
        <path d="M21.6 10.9L13.1 2.4c-.5-.5-1.4-.5-1.9 0L8.7 4.9l2.8 2.8c.6-.2 1.3 0 1.8.5.5.5.7 1.2.5 1.8l2.7 2.7c.6-.2 1.3 0 1.8.5.8.8.8 2 0 2.8s-2 .8-2.8 0c-.6-.6-.8-1.4-.5-2.1l-2.5-2.5v6.5c.2.1.4.3.5.5.8.8.8 2 0 2.8s-2 .8-2.8 0-2-1.2 0-2c.2-.2.4-.4.7-.5v-6.7c-.3-.1-.5-.3-.7-.5-.6-.6-.7-1.4-.4-2.1L6.7 6.3 2.4 10.6c-.5.5-.5 1.4 0 1.9l8.5 8.5c.5.5 1.4.5 1.9 0l8.8-8.8c.5-.5.5-1.3 0-1.8z"/>
      </svg>
    ),
  },
];

export default function ToolsMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="rich-marquee-capsule" aria-label="Technologies and tools I work with">
      <div className="rich-marquee-label">
        <span>TOOLS I WORK WITH</span>
      </div>

      <div className="rich-marquee-track-container">
        <div className={`rich-marquee-track ${isPaused ? 'paused' : ''}`}>
          {/* First sequence */}
          {TOOLS_LIST.map((tool, index) => (
            <React.Fragment key={`tool-1-${index}`}>
              <div className="rich-marquee-item">
                {tool.renderIcon()}
                <span>{tool.name}</span>
              </div>
              <span className="rich-marquee-divider" aria-hidden="true">|</span>
            </React.Fragment>
          ))}

          {/* Duplicate sequence for seamless loop */}
          {TOOLS_LIST.map((tool, index) => (
            <React.Fragment key={`tool-2-${index}`}>
              <div className="rich-marquee-item" aria-hidden="true">
                {tool.renderIcon()}
                <span>{tool.name}</span>
              </div>
              <span className="rich-marquee-divider" aria-hidden="true">|</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="rich-marquee-pause-btn"
        onClick={() => setIsPaused(!isPaused)}
        title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
        aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
      >
        {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
      </button>
    </div>
  );
}
