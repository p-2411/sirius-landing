import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  slug: string;
  author: string;
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${dateStr}`);
  return d;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    return {
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      slug: data.slug as string,
      author: (data.author as string) || "Sirius",
    };
  });

  return posts.sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);

  const actualPath = fs.existsSync(filePath)
    ? filePath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!actualPath) return null;

  const raw = fs.readFileSync(actualPath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    slug: data.slug as string,
    author: (data.author as string) || "Sirius",
    content,
  };
}
