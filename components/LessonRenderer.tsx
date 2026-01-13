import { MDXRemote } from "next-mdx-remote/rsc";

export function LessonRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-slate max-w-none">
      <MDXRemote source={content} />
    </article>
  );
}
