import { IMAGES_BASE_URL } from "@/lib/apiConfig";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function CategoryTree({
  categories,
  expandedNodes,
  onToggleExpand,
  onAdd,
  onEdit,
  onDelete,
  onCollapseAll,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const visibleTree = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return categories;
    }

    return filterTree(categories, trimmed);
  }, [categories, searchTerm]);

  return (
    <div className="bg-(--color-card) border border-badge rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-badge">
        <h3 className="font-semibold text-(--color-primary-text)">
          Category Structure
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text) text-sm focus:outline-none focus:border-(--color-primary) w-64"
          />
          <button
            onClick={onCollapseAll}
            className="text-sm text-(--color-primary) hover:underline"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="p-2">
        {renderTree(
          visibleTree,
          0,
          expandedNodes,
          onToggleExpand,
          onAdd,
          onEdit,
          onDelete,
        )}
      </div>
    </div>
  );
}

function renderTree(
  nodes,
  level,
  expandedNodes,
  onToggleExpand,
  onAdd,
  onEdit,
  onDelete,
) {
  return nodes.map((node) => {
    const children = getChildren(node);
    const isExpanded = expandedNodes[node._id];
    const hasChildren = children.length > 0;

    return (
      <div key={node._id} className="select-none">
        <div
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-badge/50 transition-colors group"
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <button
            onClick={() => hasChildren && onToggleExpand(node._id)}
            className={`w-6 h-6 flex items-center justify-center rounded hover:bg-badge transition-colors ${!hasChildren && "invisible"}`}
          >
            {isExpanded ? "▼" : "▶"}
          </button>

          <div className="w-10 h-10 rounded-lg bg-(--color-primary)/10 flex items-center justify-center text-xl">
            {(node.image && (
              <Image
                src={`${IMAGES_BASE_URL}/categories/${node.image}`}
                alt={node.name}
                height={40}
                width={40}
                unoptimized
              />
            )) ||
              "📁"}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-(--color-primary-text) truncate">
              {node.name}
            </h4>
            <p className="text-xs text-secondary-text">
              /{node.slugPath?.join("/") || node.slug}
            </p>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onAdd(node)}
              className="px-3 py-1.5 text-sm bg-(--color-primary)/10 text-(--color-primary) rounded-lg hover:bg-(--color-primary)/20 transition-colors"
            >
              + Sub
            </button>
            <button
              onClick={() => onEdit(node)}
              className="px-3 py-1.5 text-sm bg-badge text-(--color-primary-text) rounded-lg hover:bg-(--color-primary) hover:text-white transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(node)}
              className="px-3 py-1.5 text-sm bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="animate-enter">
            {renderTree(
              children,
              level + 1,
              expandedNodes,
              onToggleExpand,
              onAdd,
              onEdit,
              onDelete,
            )}
          </div>
        )}
      </div>
    );
  });
}

function filterTree(nodes = [], term) {
  return nodes.reduce((acc, node) => {
    const children = getChildren(node);
    const matchesSelf =
      node.name?.toLowerCase().includes(term) ||
      node.slug?.toLowerCase().includes(term);
    const matchingChildren = filterTree(children, term);

    if (matchesSelf || matchingChildren.length > 0) {
      acc.push({ ...node, children: matchingChildren });
    }

    return acc;
  }, []);
}

function getChildren(node) {
  if (Array.isArray(node.children)) {
    return node.children;
  }

  if (Array.isArray(node.subcategories)) {
    return node.subcategories;
  }

  return [];
}
