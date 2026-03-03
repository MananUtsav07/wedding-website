function PhotographerPricingGuide({ pricingGuide }) {
  if (!pricingGuide) {
    return null
  }

  return (
    <section className="photographer-pricing-guide" aria-label="Photography pricing guide">
      <div className="photographer-pricing-header">
        <h3>{pricingGuide.title}</h3>
        <p>{pricingGuide.subtitle}</p>
      </div>

      <div className="photographer-pricing-block">
        <h4>Base Daily Rates by Region & Service</h4>
        <div className="photographer-pricing-table-wrap">
          <table className="photographer-pricing-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Photo Only (Traditional & Candid)</th>
                <th>Standard (Photo + Video)</th>
                <th>Premium (Cinematic + Drone + Candid)</th>
              </tr>
            </thead>
            <tbody>
              {pricingGuide.baseDailyRates.map((row) => (
                <tr key={row.region}>
                  <td>
                    <strong>{row.region}</strong>
                  </td>
                  <td>{row.photoOnly}</td>
                  <td>{row.standard}</td>
                  <td>{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="photographer-pricing-block">
        <h4>Multi-Day Comprehensive Packages (2-3 Days)</h4>
        <div className="photographer-pricing-table-wrap">
          <table className="photographer-pricing-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Expected Budget Range</th>
                <th>Team Size</th>
                <th>Typical Deliverables</th>
              </tr>
            </thead>
            <tbody>
              {pricingGuide.multiDayPackages.map((row) => (
                <tr key={row.tier}>
                  <td>
                    <strong>{row.tier}</strong>
                  </td>
                  <td>{row.budgetRange}</td>
                  <td>{row.teamSize}</td>
                  <td>{row.deliverables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="photographer-pricing-block">
        <h4>Add-Ons & Variable Costs</h4>
        <div className="photographer-pricing-table-wrap">
          <table className="photographer-pricing-table">
            <thead>
              <tr>
                <th>Service / Item</th>
                <th>Estimated Cost</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pricingGuide.addOns.map((row) => (
                <tr key={row.item}>
                  <td>
                    <strong>{row.item}</strong>
                  </td>
                  <td>{row.cost}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default PhotographerPricingGuide

