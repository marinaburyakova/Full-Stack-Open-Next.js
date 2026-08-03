// app/blogs/page.tsx
import Link from 'next/link';
import { db } from '../db';
import { blogs } from '../db/schema';
import { desc, ilike } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface BlogsPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filterQuery = resolvedSearchParams.filter || '';

  // Запрашиваем блоги из БД с фильтрацией по заголовку и сортировкой по убыванию лайков
  const allBlogs = await db
    .select()
    .from(blogs)
    .where(ilike(blogs.title, `%${filterQuery}%`))
    .orderBy(desc(blogs.likes));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-950">Blogs</h1>
        <Link 
          href="/blogs/new" 
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Add New Blog
        </Link>
      </div>

      <form method="GET" action="/blogs" className="flex gap-2 max-w-md">
        <input
          type="text"
          name="filter"
          defaultValue={filterQuery}
          placeholder="Filter blogs by title..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition cursor-pointer"
        >
          Search
        </button>
        {filterQuery && (
          <Link
            href="/blogs"
            className="px-3 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition text-center"
          >
            Clear
          </Link>
        )}
      </form>
      
      <div className="space-y-4">
        {allBlogs.length === 0 ? (
          <p className="text-gray-500 italic">No blogs found matching "{filterQuery}"</p>
        ) : (
          allBlogs.map((blog) => (
            <div 
              key={blog.id} 
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-100 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-indigo-600 mb-1 hover:underline">
                <Link href={`/blogs/${blog.id}`}>
                  {blog.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                by <span className="font-medium text-gray-700">{blog.author}</span>
              </p>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <a 
                  href={blog.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-500 hover:underline break-all mr-4"
                >
                  {blog.url}
                </a>
                <span className="bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700 shrink-0">
                  👍 {blog.likes} likes
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
