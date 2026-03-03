import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h3>Pre & Wedding Shoot</h3>
          <p>
            Creative planning for pre-wedding, wedding, and post-wedding destination shoots with
            verified professionals.
          </p>
        </section>

        <section>
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/professionals">Professionals</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/booking">Booking</Link>
        </section>

        <section>
          <h4>Locations</h4>
          <p>Shimla, Himachal Pradesh</p>
          <p>Amritsar, Punjab</p>
          <p>Srinagar, Jammu & Kashmir</p>
        </section>

        <section>
          <h4>Contact</h4>
          <p>Email: hello@preandweddingshoot.com</p>
          <p>Phone: +91 98XXXXXX12</p>
          <p>Hours: 9:00 AM - 7:00 PM</p>
        </section>
      </div>

      <div className="footer-socials" aria-label="Social links">
        <a href="#" aria-label="Instagram" title="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
          </svg>
        </a>
        <a href="#" aria-label="Gmail" title="Gmail">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3.5 6.2h17a1 1 0 0 1 1 1v9.6a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1V7.2a1 1 0 0 1 1-1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </a>
        <a href="#" aria-label="Facebook" title="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M14.2 8.4h2.3V5.6h-2.7c-3 0-4.2 1.6-4.2 4.1v2h-2v2.8h2V20h3v-5.5h2.5l.5-2.8h-3V9.9c0-1 .3-1.5 1.6-1.5z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </footer>
  )
}

export default SiteFooter
