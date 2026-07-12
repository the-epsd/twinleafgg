import type { SuperType } from 'ptcg-server';
import type { CardParentMapEntry } from '../types/responses';

export const NODE_WIDTH = 168;
export const NODE_HEIGHT = 48;
export const H_GAP = 28;
export const V_GAP = 64;
export const FOREST_GAP = 80;

export type LayoutNode = {
  id: string;
  label: string;
  kind: 'base' | 'card';
  entry?: CardParentMapEntry;
  x: number;
  y: number;
  subtreeWidth: number;
  children: LayoutNode[];
};

export type LayoutEdge = {
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ForestLayout = {
  rootId: string;
  title: string;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

const BASE_CLASS_NAMES = new Set(['TrainerCard', 'PokemonCard', 'EnergyCard', 'Card']);

function displayLabel(entry: CardParentMapEntry): string {
  const mark = entry.regulationMark ? ` [${entry.regulationMark}]` : '';
  return `${entry.name} ${entry.set}${mark}`;
}

function assignPositions(node: LayoutNode, left: number, depth: number): number {
  node.y = depth * (NODE_HEIGHT + V_GAP);
  if (node.children.length === 0) {
    node.x = left;
    node.subtreeWidth = NODE_WIDTH;
    return NODE_WIDTH;
  }

  let cursor = left;
  let childSpan = 0;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const width = assignPositions(child, cursor, depth + 1);
    cursor += width + H_GAP;
    childSpan += width + (i > 0 ? H_GAP : 0);
  }

  node.subtreeWidth = Math.max(NODE_WIDTH, childSpan);
  const first = node.children[0];
  const last = node.children[node.children.length - 1];
  node.x = (first.x + last.x) / 2;
  return node.subtreeWidth;
}

function flatten(node: LayoutNode, nodes: LayoutNode[], edges: LayoutEdge[]): void {
  nodes.push(node);
  for (const child of node.children) {
    edges.push({
      fromId: node.id,
      toId: child.id,
      x1: node.x + NODE_WIDTH / 2,
      y1: node.y + NODE_HEIGHT,
      x2: child.x + NODE_WIDTH / 2,
      y2: child.y,
    });
    flatten(child, nodes, edges);
  }
}

function buildChildrenMap(entries: CardParentMapEntry[]): Map<string, CardParentMapEntry[]> {
  const byParent = new Map<string, CardParentMapEntry[]>();
  for (const entry of entries) {
    if (!entry.parentFullName) continue;
    const list = byParent.get(entry.parentFullName) ?? [];
    list.push(entry);
    byParent.set(entry.parentFullName, list);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }
  return byParent;
}

function toTreeNode(
  entry: CardParentMapEntry,
  byParent: Map<string, CardParentMapEntry[]>,
  visited: Set<string>
): LayoutNode {
  if (visited.has(entry.fullName)) {
    return {
      id: `${entry.fullName}#cycle`,
      label: displayLabel(entry),
      kind: 'card',
      entry,
      x: 0,
      y: 0,
      subtreeWidth: NODE_WIDTH,
      children: [],
    };
  }
  visited.add(entry.fullName);
  const children = (byParent.get(entry.fullName) ?? []).map((child) =>
    toTreeNode(child, byParent, visited)
  );
  return {
    id: entry.fullName,
    label: displayLabel(entry),
    kind: 'card',
    entry,
    x: 0,
    y: 0,
    subtreeWidth: NODE_WIDTH,
    children,
  };
}

function matchesQuery(entry: CardParentMapEntry, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    entry.fullName.toLowerCase().includes(q) ||
    entry.name.toLowerCase().includes(q) ||
    entry.set.toLowerCase().includes(q) ||
    entry.className.toLowerCase().includes(q) ||
    (entry.regulationMark?.toLowerCase().includes(q) ?? false)
  );
}

function treeMatches(node: LayoutNode, query: string): boolean {
  if (!query) return true;
  if (node.entry && matchesQuery(node.entry, query)) return true;
  if (node.kind === 'base' && node.label.toLowerCase().includes(query.toLowerCase())) return true;
  return node.children.some((child) => treeMatches(child, query));
}

function pruneTree(node: LayoutNode, query: string): LayoutNode | null {
  if (!query) return node;
  const children = node.children
    .map((child) => pruneTree(child, query))
    .filter((child): child is LayoutNode => child !== null);
  const selfMatch =
    (node.entry && matchesQuery(node.entry, query)) ||
    (node.kind === 'base' && node.label.toLowerCase().includes(query.toLowerCase()));
  if (!selfMatch && children.length === 0) return null;
  return { ...node, children };
}

export type ParentMapFilters = {
  query?: string;
  /** When empty/undefined, all super types are included. */
  superTypes?: ReadonlySet<SuperType> | SuperType[];
};

/**
 * Build forest layouts for cards that participate in class inheritance beyond
 * TrainerCard / PokemonCard / EnergyCard (i.e. reprints that `extends` another card).
 */
export function buildParentForestLayouts(
  entries: CardParentMapEntry[],
  filters: string | ParentMapFilters = ''
): ForestLayout[] {
  const opts: ParentMapFilters =
    typeof filters === 'string' ? { query: filters } : filters;
  const query = opts.query?.trim() ?? '';
  const allowed =
    opts.superTypes == null
      ? undefined
      : opts.superTypes instanceof Set
        ? opts.superTypes
        : new Set(opts.superTypes);

  const scoped =
    allowed && allowed.size > 0
      ? entries.filter((e) => allowed.has(e.superType))
      : entries;

  const byFullName = new Map(scoped.map((e) => [e.fullName, e]));
  const byParent = buildChildrenMap(scoped);

  const interestingRoots = new Set<string>();
  for (const entry of scoped) {
    if (!entry.parentFullName) continue;
    let cursor: CardParentMapEntry | undefined = entry;
    const seen = new Set<string>();
    while (cursor?.parentFullName && !seen.has(cursor.fullName)) {
      seen.add(cursor.fullName);
      cursor = byFullName.get(cursor.parentFullName);
    }
    if (cursor) {
      interestingRoots.add(cursor.fullName);
    }
  }

  const forests: ForestLayout[] = [];
  const roots = [...interestingRoots]
    .map((fullName) => byFullName.get(fullName))
    .filter((e): e is CardParentMapEntry => !!e)
    .sort((a, b) => a.name.localeCompare(b.name) || a.fullName.localeCompare(b.fullName));

  for (const rootEntry of roots) {
    const cardRoot = toTreeNode(rootEntry, byParent, new Set());
    const baseName =
      rootEntry.parentClassName && BASE_CLASS_NAMES.has(rootEntry.parentClassName)
        ? rootEntry.parentClassName
        : 'Card';

    const tree: LayoutNode = {
      id: `base:${baseName}:${rootEntry.fullName}`,
      label: baseName,
      kind: 'base',
      x: 0,
      y: 0,
      subtreeWidth: NODE_WIDTH,
      children: [cardRoot],
    };

    const pruned = pruneTree(tree, query);
    if (!pruned || !treeMatches(pruned, query)) continue;

    assignPositions(pruned, 0, 0);
    const nodes: LayoutNode[] = [];
    const edges: LayoutEdge[] = [];
    flatten(pruned, nodes, edges);

    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = 0;
    for (const node of nodes) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x + NODE_WIDTH);
      maxY = Math.max(maxY, node.y + NODE_HEIGHT);
    }
    if (minX !== 0 && Number.isFinite(minX)) {
      for (const node of nodes) node.x -= minX;
      for (const edge of edges) {
        edge.x1 -= minX;
        edge.x2 -= minX;
      }
      maxX -= minX;
    }

    forests.push({
      rootId: rootEntry.fullName,
      title: rootEntry.name,
      nodes,
      edges,
      width: Math.max(NODE_WIDTH, maxX),
      height: maxY,
      offsetX: 0,
      offsetY: 0,
    });
  }

  // Pack forests left-to-right in rows that wrap loosely by a soft max width.
  const ROW_MAX = 3200;
  let rowX = 0;
  let rowY = 0;
  let rowHeight = 0;

  for (const forest of forests) {
    if (rowX > 0 && rowX + forest.width > ROW_MAX) {
      rowX = 0;
      rowY += rowHeight + FOREST_GAP;
      rowHeight = 0;
    }
    forest.offsetX = rowX;
    forest.offsetY = rowY;
    rowX += forest.width + FOREST_GAP;
    rowHeight = Math.max(rowHeight, forest.height);
  }

  return forests;
}

export function getCanvasSize(forests: ForestLayout[]): { width: number; height: number } {
  let width = 0;
  let height = 0;
  for (const forest of forests) {
    width = Math.max(width, forest.offsetX + forest.width);
    height = Math.max(height, forest.offsetY + forest.height);
  }
  return {
    width: Math.max(width + 40, 400),
    height: Math.max(height + 40, 200),
  };
}