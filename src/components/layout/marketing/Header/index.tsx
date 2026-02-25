import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { RoleNavDesktop, RoleNavMobile } from './RoleNavButtons'

const PREFIX = '/95668339501103956045'

/* ─────────────────── profile pill ─────────────────── */
const ProfilePill: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, authData } = useAuth()

  if (isAuthenticated) {
    return (
      <button
        onClick={() => navigate(`${PREFIX}/my-account`)}
        className="
          inline-flex items-center gap-2
          border border-gray-3 rounded-full
          pl-2.5 pr-3 sm:pr-4 py-1.5
          bg-white hover:border-blue/40 hover:shadow-1
          transition-all duration-200
        "
      >
        <div className="w-7 h-7 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75S9.38 11.5 12 11.5s4.75-2.13 4.75-4.75S14.62 2 12 2zm0 15c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4z" />
          </svg>
        </div>
        <span className="hidden sm:block text-sm font-medium text-dark truncate max-w-[120px]">
          {authData?.user?.name}
        </span>
      </button>
    )
  }

  return (
    <Link
      to={`${PREFIX}/auth/signin`}
      className="
        inline-flex items-center gap-2
        text-sm font-medium
        rounded-lg
        h-10 sm:h-11
        px-4 sm:px-5
        bg-blue text-white
        hover:bg-blue-dark
        shadow-sm hover:shadow-md
        transition-all duration-200
      "
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75S9.38 11.5 12 11.5s4.75-2.13 4.75-4.75S14.62 2 12 2zm0 15c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4z" />
      </svg>
      <span className="hidden lsm:inline">Sign In</span>
    </Link>
  )
}

/* ─────────────────── nav link helper ─────────────────── */
const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const { pathname } = useLocation()
  const isActive = pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={`
        relative text-sm font-medium px-1 py-1
        transition-colors duration-200
        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full
        after:bg-blue after:transition-all after:duration-200
        ${isActive ? 'text-blue after:w-full' : 'text-dark hover:text-blue after:w-0 hover:after:w-full'}
      `}
    >
      {label}
    </Link>
  )
}

/* ═══════════════════ HEADER ═══════════════════ */
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)

  // sticky on scroll
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close mobile menu on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [mobileOpen])

  // close mobile menu on route change
  const { pathname } = useLocation()
  useEffect(() => setMobileOpen(false), [pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={`
        fixed left-0 top-0 w-full z-9999 bg-white
        transition-all duration-300
        ${sticky ? 'shadow-1 border-b border-gray-3/60' : 'border-b border-gray-3/40'}
      `}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 h-16 sm:h-[72px]">
          {/* ── Logo ── */}
          <Link to={`${PREFIX}/home`} className="flex-shrink-0">
            <img src="/images/logo/logo.png" alt="SpePas" className="h-8 sm:h-9 w-auto" />
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden xl:flex items-center gap-5 ml-auto">
            <NavLink to={`${PREFIX}/home`} label="Home" />
            <NavLink to={`${PREFIX}/shop`} label="Shop" />
          </nav>

          {/* ── Desktop role buttons ── */}
          <RoleNavDesktop />

          {/* ── Profile pill ── */}
          <div className="hidden sm:block ml-auto xl:ml-0">
            <ProfilePill />
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden ml-auto flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-1 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-dark rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 bg-dark rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
              <span className={`block h-0.5 bg-dark rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ═══ Mobile menu ═══ */}
      <div
        ref={mobileRef}
        className={`
          xl:hidden
          absolute top-full right-0 left-0
          bg-white border-t border-gray-3/40
          shadow-3
          transition-all duration-300 ease-out overflow-hidden
          ${mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 py-4 space-y-3 overflow-y-auto max-h-[75vh]">
          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            <MobileNavLink to={`${PREFIX}/home`} label="Home" onClick={closeMobile} />
            <MobileNavLink to={`${PREFIX}/shop`} label="Shop" onClick={closeMobile} />
          </nav>

          {/* Role buttons */}
          <RoleNavMobile onNavigate={closeMobile} />

          {/* Mobile profile / sign in */}
          <div className="sm:hidden pt-3 border-t border-gray-3/50">
            <ProfilePill />
          </div>
        </div>
      </div>
    </header>
  )
}

/* mobile nav link helper */
const MobileNavLink: React.FC<{ to: string; label: string; onClick: () => void }> = ({
  to,
  label,
  onClick,
}) => {
  const { pathname } = useLocation()
  const isActive = pathname === to

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center text-sm font-medium rounded-lg px-3 py-2.5
        transition-colors
        ${isActive ? 'text-blue bg-blue/5' : 'text-dark hover:text-blue hover:bg-gray-1'}
      `}
    >
      {label}
    </Link>
  )
}

export default Header
