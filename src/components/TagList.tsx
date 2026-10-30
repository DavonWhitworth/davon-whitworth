interface TagListProps {
  tags: readonly string[];
  label: string;
}

export function TagList({ tags, label }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
