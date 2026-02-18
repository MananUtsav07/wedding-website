import { Link } from 'react-router-dom'

function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h3>samplewebname</h3>
          <p>
            Creative pre-wedding planning for destination shoots, verified professionals, and easy
            slot booking.
          </p>
        </section>

        <section>
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/professionals">Professionals</Link>
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
          <p>Email: hello@samplewebname.com</p>
          <p>Phone: +91 98XXXXXX12</p>
          <p>Hours: 9:00 AM - 7:00 PM</p>
        </section>
      </div>
      <p className="footer-copy">Copyright {year} samplewebname. All rights reserved.</p>
    </footer>
  )
}

export default SiteFooter
