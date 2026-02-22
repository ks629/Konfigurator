export default function JsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NEXBE Sp. z o.o.',
    url: 'https://konfigurator.nexbe.pl',
    logo: 'https://konfigurator.nexbe.pl/logo-white.svg',
    description: 'Integrator 360 magazynów energii — sprzedaż bezpośrednia, ceny dystrybucyjne, montaż w 14 dni.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Sadowa 19D',
      addressLocality: 'Jawczyce',
      postalCode: '05-850',
      addressCountry: 'PL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+48-732-080-101',
      contactType: 'sales',
      email: 'kontakt@nexbe.pl',
      availableLanguage: 'Polish',
    },
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'NEXBE',
    image: 'https://konfigurator.nexbe.pl/logo-white.svg',
    '@id': 'https://konfigurator.nexbe.pl',
    url: 'https://konfigurator.nexbe.pl',
    telephone: '+48732080101',
    email: 'kontakt@nexbe.pl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Sadowa 19D',
      addressLocality: 'Jawczyce',
      postalCode: '05-850',
      addressCountry: 'PL',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(organization)}
      </script>
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(localBusiness)}
      </script>
    </>
  );
}
