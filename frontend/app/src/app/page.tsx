import { fetchNavigation } from '@/lib/api';

export default async function HomePage() {
  const navigation = await fetchNavigation();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Product Data Explorer
      </h1>

      {navigation.length === 0 && (
        <p className="text-gray-500">
          No navigation data found.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {navigation.map((item: any) => (
          <a
            key={item.id}
            href={`/navigation/${item.slug}`}
            className="border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            {item.title}
          </a>
        ))}
      </div>
    </main>
  );
}
