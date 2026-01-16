// frontend/app/src/app/categories/[slug]/page.tsx

async function fetchProducts(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/navigation/${slug}/products`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function ProductsPage({
  params,
}: {
  params: { slug: string };
}) {
  const products = await fetchProducts(params.slug);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Products
      </h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 hover:shadow transition"
          >
            <h2 className="text-sm font-medium line-clamp-2">
              {product.title}
            </h2>

            {product.price && (
              <p className="text-green-600 mt-2 font-semibold">
                £{product.price}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
