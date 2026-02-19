const points = [
  {
    title: 'Verified Professionals',
    description: 'Only top-tier, vetted artists with proven portfolios and a commitment to excellence.',
  },
  {
    title: 'Curated Locations',
    description: 'Exclusive access to handpicked locations for breathtaking and timeless couple frames.',
  },
  {
    title: 'Hassle-Free Booking',
    description: 'Seamless scheduling, secure payments, and easy planning from one place.',
  },
]

function CommitmentSection() {
  return (
    <section className="section commitment-section">
      <div className="commitment-head">
        <div>
          <p className="commitment-eyebrow">Our Commitment</p>
          <h2>Why Choose Our Platform</h2>
        </div>
        <p>
          We provide a seamless experience for couples looking to document their journey with curated
          luxury and professional ease.
        </p>
      </div>

      <div className="commitment-grid">
        {points.map((point) => (
          <article key={point.title} className="commitment-card">
            <span className="commitment-icon" aria-hidden="true">
              ●
            </span>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CommitmentSection
