import {
  TcgDexApiError,
  cardImageUrl,
  getActiveSource,
  getCard,
  getSerie,
  getSet,
  listSeries,
  searchCardsByName,
  setLogoUrl,
  type TcgDexCardResume,
  type TcgDexSerieResume,
  type TcgDexSet,
  type TcgDexSetResume,
} from './client';
import { mapTcgDexCardToDraft, type BrowseSourceMeta } from './mapCardToDraft';
import { isImplemented, loadImplementedCardIds } from '../data/implemented';
import type { CardDraft } from '../types';

export type BrowseLevel = 'series' | 'sets' | 'cards' | 'search';

export interface BrowseState {
  level: BrowseLevel;
  loading: boolean;
  error: string;
  series: TcgDexSerieResume[];
  sets: TcgDexSetResume[];
  activeSerieId: string;
  activeSerieName: string;
  activeSet: TcgDexSet | null;
  cards: TcgDexCardResume[];
  searchQuery: string;
  filter: string;
  implementedIds: Set<string>;
  hideImplemented: boolean;
}

export function createBrowseState(): BrowseState {
  return {
    level: 'series',
    loading: false,
    error: '',
    series: [],
    sets: [],
    activeSerieId: '',
    activeSerieName: '',
    activeSet: null,
    cards: [],
    searchQuery: '',
    filter: '',
    implementedIds: new Set(),
    hideImplemented: false,
  };
}

export async function ensureImplementedLoaded(state: BrowseState): Promise<void> {
  state.implementedIds = await loadImplementedCardIds();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function matchesFilter(name: string, filter: string): boolean {
  if (!filter.trim()) return true;
  return name.toLowerCase().includes(filter.trim().toLowerCase());
}

export function renderBrowse(state: BrowseState): string {
  const source = getActiveSource();
  const crumbs: string[] = [];
  crumbs.push(`<button type="button" class="linkish" data-browse="go-series">Series</button>`);
  if (state.level === 'sets' || state.level === 'cards') {
    crumbs.push(`<span>/</span><button type="button" class="linkish" data-browse="go-sets">${escapeHtml(state.activeSerieName || 'Sets')}</button>`);
  }
  if (state.level === 'cards' && state.activeSet) {
    crumbs.push(`<span>/</span><span>${escapeHtml(state.activeSet.name)}</span>`);
  }
  if (state.level === 'search') {
    crumbs.push(`<span>/</span><span>Search</span>`);
  }

  return `
    <section class="browse">
      <div class="browse-toolbar">
        <div class="crumbs">${crumbs.join(' ')}</div>
        <form class="search-row" data-browse-form="search">
          <input name="q" placeholder="Search card name…" value="${escapeHtml(state.searchQuery)}" />
          <button type="submit">Search</button>
        </form>
      </div>

      <div class="status-box muted-note">${escapeHtml(source.note)}</div>
      ${
        state.implementedIds.size
          ? `<div class="browse-options">
              <label class="check-inline">
                <input type="checkbox" data-browse-hide-implemented ${state.hideImplemented ? 'checked' : ''} />
                Hide implemented (${state.implementedIds.size.toLocaleString()} in catalog)
              </label>
            </div>`
          : ''
      }
      ${state.error ? `<div class="error-box">${escapeHtml(state.error)}</div>` : ''}
      ${state.loading ? `<div class="status-box">Loading local card data…</div>` : ''}

      ${
        state.level === 'series' || state.level === 'sets'
          ? `<div class="filter-row">
              <label>Filter list
                <input data-browse-filter value="${escapeHtml(state.filter)}" placeholder="Type to filter…" />
              </label>
            </div>`
          : ''
      }

      ${renderBrowseBody(state)}
    </section>
  `;
}

function renderBrowseBody(state: BrowseState): string {
  if (state.loading && state.series.length === 0 && state.sets.length === 0 && state.cards.length === 0) {
    return '';
  }

  if (state.level === 'series') {
    const items = state.series.filter(s => matchesFilter(s.name, state.filter));
    return `<div class="tile-grid">
      ${items
        .map(s => {
          const logo = setLogoUrl(s.logo);
          return `<button type="button" class="tile" data-browse="open-serie" data-id="${escapeHtml(s.id)}" data-name="${escapeHtml(s.name)}">
            ${logo ? `<img src="${escapeHtml(logo)}" alt="" loading="lazy" onerror="this.style.display='none'" />` : '<div class="tile-placeholder"></div>'}
            <span>${escapeHtml(s.name)}</span>
            <small>${escapeHtml(s.id)}</small>
          </button>`;
        })
        .join('')}
    </div>`;
  }

  if (state.level === 'sets') {
    const items = state.sets.filter(s => matchesFilter(s.name, state.filter) || matchesFilter(s.id, state.filter));
    return `<div class="tile-grid">
      ${items
        .map(s => {
          const logo = setLogoUrl(s.logo);
          return `<button type="button" class="tile" data-browse="open-set" data-id="${escapeHtml(s.id)}">
            ${logo ? `<img src="${escapeHtml(logo)}" alt="" loading="lazy" onerror="this.style.display='none'" />` : '<div class="tile-placeholder"></div>'}
            <span>${escapeHtml(s.name)}</span>
            <small>${escapeHtml(s.id)} · ${s.cardCount?.official ?? s.cardCount?.total ?? '?'} cards</small>
          </button>`;
        })
        .join('')}
    </div>`;
  }

  // cards or search
  let cards = state.cards;
  if (state.hideImplemented) {
    cards = cards.filter(c => !isImplemented(state.implementedIds, c.id));
  }
  if (cards.length === 0 && !state.loading) {
    return `<p class="muted">No cards found.</p>`;
  }
  const implementedCount = state.cards.filter(c => isImplemented(state.implementedIds, c.id)).length;
  return `
  ${
    state.cards.length && state.implementedIds.size
      ? `<p class="muted browse-impl-summary">${implementedCount} of ${state.cards.length} shown as implemented</p>`
      : ''
  }
  <div class="card-grid">
    ${cards
      .map(c => {
        const img = cardImageUrl(c.image, 'low');
        const done = isImplemented(state.implementedIds, c.id);
        return `<button type="button" class="card-tile${done ? ' is-implemented' : ''}" data-browse="pick-card" data-id="${escapeHtml(c.id)}" ${done ? 'title="Already implemented"' : ''}>
          ${done ? '<span class="impl-badge">Implemented</span>' : ''}
          ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(c.name)}" loading="lazy" onerror="this.src=''; this.classList.add('missing')" />` : '<div class="card-missing">No art</div>'}
          <div class="card-meta">
            <strong>${escapeHtml(c.name)}</strong>
            <small>#${escapeHtml(c.localId)}${c.localId ? ' · ' : ''}${escapeHtml(c.id.length > 18 ? `${c.id.slice(0, 14)}…` : c.id)}</small>
          </div>
        </button>`;
      })
      .join('')}
  </div>`;
}

export async function loadSeries(state: BrowseState): Promise<void> {
  state.loading = true;
  state.error = '';
  state.level = 'series';
  try {
    state.series = await listSeries();
  } catch (e) {
    state.error = e instanceof TcgDexApiError ? e.message : String(e);
    state.series = [];
  } finally {
    state.loading = false;
  }
}

export async function loadSerieSets(state: BrowseState, serieId: string, serieName: string): Promise<void> {
  state.loading = true;
  state.error = '';
  state.activeSerieId = serieId;
  state.activeSerieName = serieName;
  state.level = 'sets';
  state.filter = '';
  try {
    const serie = await getSerie(serieId);
    state.sets = serie.sets || [];
    state.activeSerieName = serie.name || serieName;
  } catch (e) {
    state.error = e instanceof TcgDexApiError ? e.message : String(e);
    state.sets = [];
  } finally {
    state.loading = false;
  }
}

export async function loadSetCards(state: BrowseState, setId: string): Promise<void> {
  state.loading = true;
  state.error = '';
  state.level = 'cards';
  try {
    const set = await getSet(setId);
    state.activeSet = set;
    state.cards = set.cards || [];
  } catch (e) {
    state.error = e instanceof TcgDexApiError ? e.message : String(e);
    state.activeSet = null;
    state.cards = [];
  } finally {
    state.loading = false;
  }
}

export async function runSearch(state: BrowseState, query: string): Promise<void> {
  state.searchQuery = query;
  state.loading = true;
  state.error = '';
  state.level = 'search';
  try {
    state.cards = await searchCardsByName(query);
  } catch (e) {
    state.error = e instanceof TcgDexApiError ? e.message : String(e);
    state.cards = [];
  } finally {
    state.loading = false;
  }
}

export async function pickCardToDraft(cardId: string): Promise<{
  draft: CardDraft;
  meta: BrowseSourceMeta;
}> {
  const card = await getCard(cardId);
  const draft = mapTcgDexCardToDraft(card);
  return {
    draft,
    meta: {
      tcgDexId: card.id,
      imageUrl: cardImageUrl(card.image, 'high') || cardImageUrl(card.image, 'low'),
      setName: card.set?.name,
      rarity: card.rarity,
    },
  };
}
