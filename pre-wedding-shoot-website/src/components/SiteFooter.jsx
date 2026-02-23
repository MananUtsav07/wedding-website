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
    </footer>
  )
}

export default SiteFooter
