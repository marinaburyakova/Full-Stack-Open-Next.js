// app/page.tsx
'use client';

import Homepage from './homepage.mdx';

export default function Home() {
  return (
    <div className="markdown max-w-4xl mx-auto py-8">
      <Homepage />
    </div>
  );
}