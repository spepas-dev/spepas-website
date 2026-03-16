import React from 'react'
import {
  MagnifyingGlassIcon,
  MegaphoneIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import logoSvg from '@/assets/logo.svg'

const features = [
  {
    icon: MagnifyingGlassIcon,
    label: 'Find Any Part',
    description: 'Search thousands of new and used parts by vehicle',
  },
  {
    icon: MegaphoneIcon,
    label: 'Request What You Need',
    description: 'Post a request and let sellers come to you',
  },
  {
    icon: TagIcon,
    label: 'Sell Your Parts',
    description: 'List inventory and reach buyers across Ghana',
  },
  {
    icon: TruckIcon,
    label: 'Fast Delivery',
    description: 'Reliable delivery through our verified rider network',
  },
  {
    icon: ShieldCheckIcon,
    label: 'Shop with Confidence',
    description: 'Every listing verified for quality and accuracy',
  },
]

const AltHome: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Subtle radial gradient accent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, var(--color-primary-50) 0%, var(--color-primary-100) 30%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 text-center">
        {/* Logo + brand name */}
        <div className="flex items-center gap-3">
          <img
            src={logoSvg}
            alt="SpePas Logo"
            className="h-14 w-14 sm:h-16 sm:w-16"
          />
          <span
            className="text-primary-500"
            style={{
              fontSize: '36px',
              fontWeight: 500,
              letterSpacing: '-1.44px',
              lineHeight: '44px',
            }}
          >
            SpePas
          </span>
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-primary-500"
            style={{
              fontSize: '48px',
              fontWeight: 500,
              letterSpacing: '-0.96px',
              lineHeight: '60px',
            }}
          >
            COMING SOON
          </h1>
          {/* Yellow accent dot */}
          <div className="h-1.5 w-12 rounded-full bg-secondary-500" />
        </div>

        {/* Tagline */}
        <p
          className="text-dark"
          style={{
            fontSize: '30px',
            fontWeight: 400,
            letterSpacing: '-0.9px',
            lineHeight: '38px',
          }}
        >
          Your One-Stop Marketplace for Auto Parts in Ghana
        </p>

        {/* Description */}
        <p
          className="mx-auto max-w-2xl text-dark"
          style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '-0.54px',
            lineHeight: '28px',
          }}
        >
          We're building the easiest way to find, buy, and sell new and used car
          parts — connecting buyers, sellers, and mechanics across Ghana.
        </p>

        {/* Primary CTA */}
        <a
          href="https://forms.office.com/r/M4akU0t8US"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full bg-primary-500 text-white transition-colors hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '-0.64px',
            lineHeight: '24px',
            padding: '12px 32px',
          }}
        >
          Join the Waitlist
        </a>
        <p
          className="text-neutral-700"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '-0.42px',
            lineHeight: '20px',
          }}
        >
          Be the first to know when we launch.
        </p>

        {/* Feature cards */}
        <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 p-5"
            >
              <f.icon className="h-8 w-8 text-primary-500" />
              <span
                className="text-dark"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '-0.42px',
                  lineHeight: '20px',
                }}
              >
                {f.label}
              </span>
              <span
                className="text-neutral-700"
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  letterSpacing: '-0.36px',
                  lineHeight: '18px',
                }}
              >
                {f.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AltHome
