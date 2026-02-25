import { Link } from 'react-router-dom'

const PREFIX = '/95668339501103956045'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-3/50">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pt-14 sm:pt-16 lg:pt-20 pb-10 lg:pb-14">
          {/* ── Brand + Contact ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={`${PREFIX}/home`} className="inline-block mb-6">
              <img src="/images/logo/logo.png" alt="SpePas" className="h-9 w-auto" />
            </Link>
            

            <ul className="flex flex-col gap-3 text-sm text-dark-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>support@spepas.com</span>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              <SocialLink href="#" label="Facebook">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616 2c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.762.128 1.124C7.728 7.835 4.1 5.876 1.671 2.902a4.902 4.902 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.062a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417A9.868 9.868 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.009-7.503 14.009-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </SocialLink>
            </div>
          </div>

          {/* ── Company ── */}
          <div>
            <h3 className="font-semibold text-dark text-base mb-5">Company</h3>
            <ul className="flex flex-col gap-3 text-sm text-dark-3">
              <FooterLink to={`${PREFIX}/about-us`}>About Us</FooterLink>
              <FooterLink to={`${PREFIX}/contact`}>Contact</FooterLink>
              <FooterLink to={`${PREFIX}/faqs`}>FAQs</FooterLink>
              <FooterLink to={`${PREFIX}/shop`}>Shop</FooterLink>
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <h3 className="font-semibold text-dark text-base mb-5">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm text-dark-3">
              <FooterLink to={`${PREFIX}/privacy-policy`}>Privacy Policy</FooterLink>
              <FooterLink to={`${PREFIX}/refund-policy`}>Refund Policy</FooterLink>
              <FooterLink to={`${PREFIX}/terms`}>Terms of Use</FooterLink>
            </ul>
          </div>

          {/* ── Download App ── */}
          <div>
            <h3 className="font-semibold text-dark text-base mb-5">Download App</h3>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-dark text-white rounded-xl px-5 py-3 hover:bg-dark-2 transition-colors w-full sm:w-auto"
              >
                <svg className="w-7 h-7 fill-current flex-shrink-0" viewBox="0 0 34 35">
                  <path d="M29.5529 12.3412C29.3618 12.4871 25.9887 14.3586 25.9887 18.5198C25.9887 23.3331 30.2809 25.0358 30.4093 25.078C30.3896 25.1818 29.7275 27.41 28.1463 29.6804C26.7364 31.6783 25.264 33.6731 23.024 33.6731C20.7841 33.6731 20.2076 32.3918 17.6217 32.3918C15.1018 32.3918 14.2058 33.7152 12.1569 33.7152C10.1079 33.7152 8.6783 31.8664 7.03456 29.5961C5.13062 26.93 3.59229 22.7882 3.59229 18.8572C3.59229 12.552 7.756 9.20804 11.8538 9.20804C14.0312 9.20804 15.8462 10.6157 17.2133 10.6157C18.5144 10.6157 20.5436 9.12373 23.0207 9.12373C23.9595 9.12373 27.3327 9.20804 29.5529 12.3412ZM21.8447 6.45441C22.8692 5.25759 23.5939 3.59697 23.5939 1.93635C23.5939 1.70607 23.5741 1.47254 23.5313 1.28442C21.8645 1.34605 19.8815 2.37745 18.6857 3.74292C17.7469 4.79379 16.8707 6.45441 16.8707 8.13773C16.8707 8.39076 16.9135 8.64369 16.9333 8.72476C17.0387 8.74426 17.21 8.76694 17.3813 8.76694C18.8768 8.76694 20.7577 7.78094 21.8447 6.45441Z" />
                </svg>
                <div>
                  <span className="block text-[10px] opacity-80">Download on the</span>
                  <p className="font-semibold text-sm leading-tight">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-blue text-white rounded-xl px-5 py-3 hover:bg-blue-dark transition-colors w-full sm:w-auto"
              >
                <svg className="w-7 h-7 fill-current flex-shrink-0" viewBox="0 0 34 35">
                  <path d="M5.45764 1.03125L19.9718 15.5427L23.7171 11.7973C18.5993 8.69224 11.7448 4.52679 8.66206 2.65395L6.59681 1.40278C6.23175 1.18039 5.84088 1.06062 5.45764 1.03125ZM3.24214 2.76868C3.21276 2.92814 3.1875 3.08837 3.1875 3.26041V31.939C3.1875 32.0593 3.21169 32.1713 3.22848 32.2859L17.9939 17.5205L3.24214 2.76868ZM26.1785 13.2916L21.9496 17.5205L26.1047 21.6756C28.3062 20.3412 29.831 19.4147 30.0003 19.3126C30.7486 18.8552 31.1712 18.1651 31.1586 17.4112C31.1474 16.6713 30.7247 16.0098 30.0057 15.6028C29.8449 15.5104 28.3408 14.6022 26.1785 13.2916ZM19.9718 19.4983L5.50135 33.9688C5.78248 33.9198 6.06327 33.836 6.33182 33.6737C6.70387 33.4471 16.7548 27.3492 23.6433 23.1699L19.9718 19.4983Z" />
                </svg>
                <div>
                  <span className="block text-[10px] opacity-80">Get it on</span>
                  <p className="font-semibold text-sm leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-3/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-dark-4">
          <p>&copy; {new Date().getFullYear()} SpePas. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to={`${PREFIX}/privacy-policy`} className="hover:text-blue transition-colors">
              Privacy
            </Link>
            <Link to={`${PREFIX}/terms`} className="hover:text-blue transition-colors">
              Terms
            </Link>
            <Link to={`${PREFIX}/contact`} className="hover:text-blue transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── helpers ── */
const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-blue transition-colors duration-200">
      {children}
    </Link>
  </li>
)

const SocialLink: React.FC<{
  href: string
  label: string
  children: React.ReactNode
}> = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-1 text-dark-3 hover:bg-blue hover:text-white transition-all duration-200"
  >
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      {children}
    </svg>
  </a>
)

export default Footer
