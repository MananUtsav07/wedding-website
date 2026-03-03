const RS = '\u20B9'

export const defaultPhotographerPricingGuide = {
  title: 'Photography Investment Guide',
  subtitle: 'Transparent regional pricing for your special day.',
  baseDailyRates: [
    {
      region: 'Punjab',
      photoOnly: `${RS}30,000 - ${RS}60,000`,
      standard: `${RS}75,000 - ${RS}1,50,000`,
      premium: `${RS}1,50,000 - ${RS}5,00,000+`,
    },
    {
      region: 'Jammu',
      photoOnly: `${RS}20,000 - ${RS}35,000`,
      standard: `${RS}35,000 - ${RS}75,000`,
      premium: `${RS}1,00,000 - ${RS}1,80,000`,
    },
    {
      region: 'Srinagar',
      photoOnly: `${RS}15,000 - ${RS}25,000`,
      standard: `${RS}25,000 - ${RS}50,000`,
      premium: `${RS}50,000 - ${RS}2,00,000`,
    },
    {
      region: 'Himachal',
      photoOnly: `${RS}30,000 - ${RS}50,000`,
      standard: `${RS}50,000 - ${RS}1,50,000`,
      premium: `${RS}1,50,000 - ${RS}5,00,000+ (Destination)`,
    },
  ],
  multiDayPackages: [
    {
      tier: 'Budget',
      budgetRange: `${RS}70,000 - ${RS}1,20,000`,
      teamSize: '1 Photographer, 1 Videographer',
      deliverables: 'Standard editing, traditional photo album, long-form unedited video.',
    },
    {
      tier: 'Mid-Range',
      budgetRange: `${RS}1,50,000 - ${RS}3,00,000`,
      teamSize: '2-3 Photographers, 1-2 Videographers',
      deliverables: 'Candid & traditional mix, cinematic highlight reel, 1 premium physical album.',
    },
    {
      tier: 'Luxury',
      budgetRange: `${RS}3,00,000 - ${RS}10,00,000+`,
      teamSize: 'Lead Photographer, Drone Operator, Full Crew',
      deliverables: 'Same-day edits, pre-wedding shoot included, drone footage, multiple luxury albums.',
    },
  ],
  addOns: [
    {
      item: 'Pre-Wedding Shoot',
      cost: `${RS}10,000 - ${RS}60,000`,
      notes:
        'Lower end for Srinagar/Jammu local shoots; higher end for Punjab/Himachal destination shoots.',
    },
    {
      item: 'Drone Videography',
      cost: `${RS}10,000 - ${RS}50,000`,
      notes: 'Dependent on location permissions and the complexity of the aerial tracking required.',
    },
    {
      item: 'Premium Physical Album',
      cost: `${RS}8,000 - ${RS}60,000+`,
      notes: `${RS}15,000 is the standard average in Jammu for a high-quality 40-page printed photobook.`,
    },
    {
      item: 'Travel & Accommodation',
      cost: `${RS}15,000 - ${RS}50,000+`,
      notes: 'Billed to the client for outstation or remote resort destinations.',
    },
  ],
}

// For future use: override specific photographers by ID.
// Example:
// export const photographerPricingGuideById = {
//   'arjun-sharma': { ...defaultPhotographerPricingGuide, title: 'Arjun Pricing Guide' },
// }
export const photographerPricingGuideById = {}

export function getPhotographerPricingGuide(professionalId) {
  return photographerPricingGuideById[professionalId] ?? defaultPhotographerPricingGuide
}

