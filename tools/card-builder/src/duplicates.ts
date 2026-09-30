import { cardImageUrl, findCardBySetAndNumber } from './tcgdex/client';

export type DuplicateReasonId =
  | 'same-set-number'
  | 'duplicate-index'
  | 'duplicate-other-prints'
  | 'duplicate-fullname';

export interface DuplicateReason {
  id: DuplicateReasonId | string;
  message: string;
}

export interface DuplicateCard {
  className: string;
  name: string;
  set: string;
  setNumber: string;
  fullName: string;
  sourcePath: string;
  kind: string;
  indexCount: number;
  imageUrl?: string;
}

export interface DuplicateGroup {
  key: string;
  reasons: DuplicateReason[];
  cards: DuplicateCard[];
}

export interface DuplicatesState {
  loading: boolean;
  error: string;
  groups: DuplicateGroup[];
  reasonFilter: string;
}

export const DUPLICATE_REASON_LABELS: Record<string, string> = {
  'same-set-number': 'Same set + number',
  'duplicate-index': 'Double-indexed',
  'duplicate-other-prints': 'Duplicate reprint',
  'duplicate-fullname': 'Duplicate fullName',
};

export function createDuplicatesState(): DuplicatesState {
  return {
    loading: false,
    error: '',
    groups: [],
    reasonFilter: '',
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

async function resolveDuplicateImages(groups: DuplicateGroup[]): Promise<void> {
  const cache = new Map<string, string | undefined>();

  const resolveOne = async (card: DuplicateCard): Promise<string | undefined> => {
    if (!card.set || !card.setNumber) return undefined;
    const key = `${card.set}:${card.setNumber}`;
    if (cache.has(key)) return cache.get(key);
    try {
      const match = await findCardBySetAndNumber(card.set, card.setNumber);
      const url = cardImageUrl(match?.image, 'high') || cardImageUrl(match?.image, 'low');
      cache.set(key, url);
      return url;
    } catch {
      cache.set(key, undefined);
      return undefined;
    }
  };

  await Promise.all(
    groups.flatMap(group =>
      group.cards.map(async card => {
        card.imageUrl = await resolveOne(card);
      })
    )
  );
}

export async function loadDuplicates(state: DuplicatesState): Promise<void> {
  state.loading = true;
  state.error = '';
  try {
    const response = await fetch('/card-duplicates');
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(payload.error || `Failed to load duplicates (${response.status})`);
    }
    const payload = await response.json() as { duplicates?: DuplicateGroup[] };
    state.groups = Array.isArray(payload.duplicates) ? payload.duplicates : [];
    await resolveDuplicateImages(state.groups);
  } catch (error) {
    state.groups = [];
    state.error = error instanceof Error ? error.message : 'Failed to load duplicates.';
  } finally {
    state.loading = false;
  }
}

export async function removeDuplicateCard(className: string, sourcePath: string): Promise<string> {
  const response = await fetch('/remove-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ className, sourcePath }),
  });
  const payload = await response.json().catch(() => ({})) as { message?: string; error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Failed to remove card (${response.status})`);
  }
  return payload.message || `Removed ${className}`;
}

export function applyRemovedDuplicate(
  state: DuplicatesState,
  className: string,
  sourcePath: string
): void {
  state.groups = state.groups
    .map(group => ({
      ...group,
      cards: group.cards.filter(
        card => !(card.className === className && card.sourcePath === sourcePath)
      ),
    }))
    .filter(group => group.cards.length > 1);
}

export function filteredDuplicateGroups(state: DuplicatesState): DuplicateGroup[] {
  if (!state.reasonFilter) return state.groups;
  return state.groups.filter(group =>
    group.reasons.some(reason => reason.id === state.reasonFilter)
  );
}

export function renderDuplicates(state: DuplicatesState): string {
  const groups = filteredDuplicateGroups(state);
  const reasonIds = [...new Set(state.groups.flatMap(group => group.reasons.map(r => r.id)))].sort();

  if (state.loading) {
    return `<section class="browse duplicates">
      <p class="muted">Scanning sets for duplicate cards…</p>
    </section>`;
  }

  if (state.error) {
    return `<section class="browse duplicates">
      <div class="error-box">${escapeHtml(state.error)}</div>
      <p class="muted">Click Rescan to try again.</p>
    </section>`;
  }

  const filterOptions = [
    `<option value="" ${!state.reasonFilter ? 'selected' : ''}>All reasons</option>`,
    ...reasonIds.map(id =>
      `<option value="${escapeHtml(id)}" ${state.reasonFilter === id ? 'selected' : ''}>${escapeHtml(DUPLICATE_REASON_LABELS[id] || id)}</option>`
    ),
  ].join('');

  const summary = state.groups.length === 0
    ? '<p class="browse-impl-summary">No duplicate cards found.</p>'
    : `<p class="browse-impl-summary">${groups.length} group${groups.length === 1 ? '' : 's'} shown${state.reasonFilter ? ` (filtered from ${state.groups.length})` : ''}.</p>`;

  const list = groups.length === 0
    ? ''
    : `<ul class="duplicate-list">
        ${groups.map(group => renderDuplicateGroup(group)).join('')}
      </ul>`;

  return `<section class="browse duplicates">
    <div class="browse-toolbar">
      <div>
        <strong>Duplicate cards</strong>
        ${summary}
      </div>
      <label class="duplicate-filter">Reason
        <select data-duplicates="reason-filter">${filterOptions}</select>
      </label>
    </div>
    ${list}
  </section>`;
}

function renderDuplicateGroup(group: DuplicateGroup): string {
  const reasons = group.reasons
    .map(reason =>
      `<li class="duplicate-reason">
        <span class="duplicate-reason-chip">${escapeHtml(DUPLICATE_REASON_LABELS[reason.id] || reason.id)}</span>
        <span>${escapeHtml(reason.message)}</span>
      </li>`
    )
    .join('');

  const panes = group.cards.map(card => renderDuplicatePane(card)).join('');

  return `<li class="duplicate-group">
    <ul class="duplicate-reasons">${reasons}</ul>
    <div class="duplicate-compare" style="--duplicate-cols: ${Math.min(group.cards.length, 4)}">
      ${panes}
    </div>
  </li>`;
}

function renderDuplicatePane(card: DuplicateCard): string {
  const identity = [card.fullName || card.name || card.className, card.set && card.setNumber ? `${card.set} ${card.setNumber}` : '']
    .filter(Boolean)
    .join(' · ');
  const alt = card.fullName || card.name || card.className;
  const image = card.imageUrl
    ? `<button type="button" class="duplicate-image-button" data-action="open-reprint-image" data-image-url="${escapeAttr(card.imageUrl)}" data-image-alt="${escapeAttr(alt)}" aria-label="Enlarge ${escapeAttr(alt)} image">
        <img src="${escapeAttr(card.imageUrl)}" alt="${escapeAttr(alt)}" loading="lazy" />
      </button>`
    : '<div class="duplicate-image-missing">No art</div>';

  return `<article class="duplicate-pane">
    ${image}
    <div class="duplicate-pane-body">
      <div class="duplicate-card-main">
        <strong>${escapeHtml(card.className)}</strong>
        <span class="duplicate-kind">${escapeHtml(card.kind)}</span>
        ${card.indexCount > 1 ? `<span class="duplicate-kind warn">index ×${card.indexCount}</span>` : ''}
      </div>
      <div class="muted">${escapeHtml(identity)}</div>
      <code class="duplicate-path">${escapeHtml(card.sourcePath)}</code>
      <button
        type="button"
        class="danger duplicate-remove"
        data-action="remove-duplicate"
        data-class-name="${escapeAttr(card.className)}"
        data-source-path="${escapeAttr(card.sourcePath)}"
      >Remove this card</button>
    </div>
  </article>`;
}
