const baseUrl = 'https://www.senior.zucca100.com';

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
