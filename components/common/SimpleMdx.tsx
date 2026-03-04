import type { ReactNode } from "react";

type SimpleMdxProps = {
  body: string;
};

function renderLine(line: string, index: number) {
  if (!line.trim()) {
    return null;
  }

  if (line.startsWith("### ")) {
    return <h3 key={index}>{line.slice(4)}</h3>;
  }

  if (line.startsWith("## ")) {
    return <h2 key={index}>{line.slice(3)}</h2>;
  }

  if (line.startsWith("- ")) {
    return (
      <li key={index}>
        {line.slice(2)}
      </li>
    );
  }

  return <p key={index}>{line}</p>;
}

export function SimpleMdx({ body }: SimpleMdxProps) {
  const lines = body.split("\n");
  const nodes: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  function flushList() {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={`list-${nodes.length}`} className="article-list">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  }

  lines.forEach((line, index) => {
    if (line.startsWith("- ")) {
      listItems.push(renderLine(line, index));
      return;
    }

    flushList();
    const rendered = renderLine(line, index);
    if (rendered) {
      nodes.push(rendered);
    }
  });

  flushList();

  return <div className="article-body">{nodes}</div>;
}
