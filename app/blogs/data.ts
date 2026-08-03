// app/blogs/data.ts

export interface Blog {
  id: string;
  title: string;
  author: string;
  url: string;
  likes: number;
}

// Глобальный массив на сервере для хранения блогов
export const blogsDb: Blog[] = [
  {
    id: "1",
    title: "React Server Components are awesome",
    author: "Dan Abramov",
    url: "https://react.dev",
    likes: 124
  },
  {
    id: "2",
    title: "Next.js App Router Insights",
    author: "Lee Robinson",
    url: "https://nextjs.org",
    likes: 89
  }
];
