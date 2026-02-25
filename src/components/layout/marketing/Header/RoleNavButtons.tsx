import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useAccountType } from '@/features/accountTypeContext'

/* ──────────────── shared chevron icon ──────────────── */
const ChevronDown: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

/* ──────────────── generic dropdown wrapper ──────────────── */
type DropdownItem = { label: string; path: string; icon?: React.ReactNode }

const NavDropdown: React.FC<{
  label: string
  icon?: React.ReactNode
  items: DropdownItem[]
  variant?: 'default' | 'accent'
}> = ({ label, icon, items, variant = 'default' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const btnBase =
    variant === 'accent'
      ? 'bg-blue/10 text-blue hover:bg-blue/20'
      : 'bg-gray-1 text-dark hover:bg-gray-2'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-colors ${btnBase}`}
      >
        {icon}
        <span className="hidden lsm:inline">{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-3 border border-gray-3/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setOpen(false)
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-2 hover:bg-gray-1 hover:text-blue transition-colors"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────────── simple nav button ──────────────── */
const NavButton: React.FC<{
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'accent'
}> = ({ label, icon, onClick, variant = 'default' }) => {
  const base =
    variant === 'accent'
      ? 'bg-blue/10 text-blue hover:bg-blue/20'
      : 'bg-gray-1 text-dark hover:bg-gray-2'

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-colors ${base}`}
    >
      {icon}
      <span className="hidden lsm:inline">{label}</span>
    </button>
  )
}

/* ──────────────── icons ──────────────── */
const CartIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
)

const BidIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const RequestIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2-2h-4a2 2 0 00-2 2v1h10V5a2 2 0 00-2-2zM9 11h6M9 15h6" />
  </svg>
)

const PlusIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
  </svg>
)

const GopaIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
)

/* ──────────────── MAIN EXPORT ──────────────── */

/** Desktop role‑based nav buttons */
export const RoleNavDesktop: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, authData } = useAuth()
  const { accountType } = useAccountType()

  if (!isAuthenticated) return null

  const sellerId = authData?.user?.sellerDetails?.Seller_ID
  const gopaId = authData?.user?.gopa?.Gopa_ID
  const prefix = '/95668339501103956045'

  return (
    <div className="hidden xl:flex items-center gap-2">
      {/* Buyer */}
      {accountType === 'BUYER' && (
        <>
          <NavButton label="Cart" icon={CartIcon} onClick={() => navigate(`${prefix}/buyer/cart`)} />
          <NavDropdown
            label="Requests"
            icon={RequestIcon}
            items={[
              { label: 'Create Request', path: `${prefix}/buyer/post-request`, icon: PlusIcon },
              { label: 'My Requests', path: `${prefix}/buyer/requests`, icon: RequestIcon },
            ]}
          />
        </>
      )}

      {/* Seller */}
      {accountType === 'SELLER' && sellerId && (
        <NavButton
          label="Bids"
          icon={BidIcon}
          variant="accent"
          onClick={() => navigate(`${prefix}/seller/${sellerId}/bids`)}
        />
      )}

      {/* GOPA */}
      {accountType === 'GOPA' && gopaId && (
        <NavDropdown
          label="GOPA"
          icon={GopaIcon}
          variant="accent"
          items={[
            { label: 'Assigned', path: `${prefix}/gopa/${gopaId}/assigned/active`, icon: GopaIcon },
            { label: 'Assigned History', path: `${prefix}/gopa/${gopaId}/assigned/history`, icon: GopaIcon },
            { label: 'Unassigned Active', path: `${prefix}/gopa/${gopaId}/unassigned/active`, icon: GopaIcon },
            { label: 'Unassigned History', path: `${prefix}/gopa/${gopaId}/unassigned/history`, icon: GopaIcon },
          ]}
        />
      )}
    </div>
  )
}

/** Mobile role‑based buttons (rendered inside the mobile menu) */
export const RoleNavMobile: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const navigate = useNavigate()
  const { isAuthenticated, authData } = useAuth()
  const { accountType } = useAccountType()

  if (!isAuthenticated) return null

  const sellerId = authData?.user?.sellerDetails?.Seller_ID
  const gopaId = authData?.user?.gopa?.Gopa_ID
  const prefix = '/95668339501103956045'

  const go = (path: string) => {
    navigate(path)
    onNavigate()
  }

  return (
    <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-3/50">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-4 px-1 mb-1">
        Quick Actions
      </p>

      {accountType === 'BUYER' && (
        <>
          <MobileBtn icon={CartIcon} label="Cart" onClick={() => go(`${prefix}/buyer/cart`)} />
          <MobileBtn icon={PlusIcon} label="Create Request" onClick={() => go(`${prefix}/buyer/post-request`)} />
          <MobileBtn icon={RequestIcon} label="My Requests" onClick={() => go(`${prefix}/buyer/requests`)} />
        </>
      )}

      {accountType === 'SELLER' && sellerId && (
        <MobileBtn icon={BidIcon} label="Bids" onClick={() => go(`${prefix}/seller/${sellerId}/bids`)} />
      )}

      {accountType === 'GOPA' && gopaId && (
        <>
          <MobileBtn icon={GopaIcon} label="Assigned" onClick={() => go(`${prefix}/gopa/${gopaId}/assigned/active`)} />
          <MobileBtn icon={GopaIcon} label="Assigned History" onClick={() => go(`${prefix}/gopa/${gopaId}/assigned/history`)} />
          <MobileBtn icon={GopaIcon} label="Unassigned Active" onClick={() => go(`${prefix}/gopa/${gopaId}/unassigned/active`)} />
          <MobileBtn icon={GopaIcon} label="Unassigned History" onClick={() => go(`${prefix}/gopa/${gopaId}/unassigned/history`)} />
        </>
      )}
    </div>
  )
}

/* small helper for mobile list buttons */
const MobileBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 w-full text-left text-sm text-dark-2 hover:text-blue hover:bg-gray-1 rounded-lg px-3 py-2.5 transition-colors"
  >
    {icon}
    {label}
  </button>
)
