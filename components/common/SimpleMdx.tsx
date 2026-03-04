import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

type SimpleMdxProps = {
  body: string;
};

function mergeClassName(baseClassName: string, nextClassName?: string) {
  return nextClassName ? `${baseClassName} ${nextClassName}` : baseClassName;
}

function ArticleLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const className = mergeClassName("article-link", props.className);

  return <a {...props} className={className} href={href} />;
}

const mdxComponents = {
  a: ArticleLink,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className={mergeClassName("article-list", props.className)} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => <strong {...props} />,
  code: (props: ComponentPropsWithoutRef<"code">) => <code {...props} />
};

export async function SimpleMdx({ body }: SimpleMdxProps) {
  return (
    <div className="article-body">
      <MDXRemote components={mdxComponents} source={body} />
    </div>
  );
}
