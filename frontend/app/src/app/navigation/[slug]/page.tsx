async function fetchCategories(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/navigation/${slug}/categories`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export default async function NavigationPage({
  params,
}: {
  params: { slug: string };
}) {
  const categories = await fetchCategories(params.slug);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Categories
      </h1>

      {categories.length === 0 && (
        <p className="text-gray-500">No categories found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat: any) => (
          <a
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <h2 className="font-medium">{cat.title}</h2>
          </a>
        ))}
      </div>
    </main>
  );
}