import type {
  AttackDraft,
  CardDraft,
  EnergyShort,
  PowerDraft,
  PowerTypeName,
  ReprintCandidate,
  StageName,
  WeaknessValue,
} from './types';
import {
  ENERGY_LABELS,
  ENERGY_SHORTS,
  POWER_TYPES,
  STAGES,
} from './types';
import { getPrefabById, prefabsForScope } from './prefabs/catalog';
import {
  MissingPrefabError,
  createManualSelected,
  matchEffectText,
  matchedToSelected,
} from './prefabs/matcher';
import { generateCardSource, parseEnergyCost } from './generator/generateCard';
import {
  createBrowseState,
  ensureImplementedLoaded,
  loadSerieSets,
  loadSeries,
  loadSetCards,
  pickCardToDraft,
  renderBrowse,
  runSearch,
} from './tcgdex/browse';
import type { BrowseSourceMeta } from './tcgdex/mapCardToDraft';
import {
  cardImageUrl,
  findCardsByNameAndSet,
  findReprintCandidates,
  TcgDexApiError,
  resetDataSource,
} from './tcgdex/client';
import { clearImplementedCache } from './data/implemented';

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyAttack(): AttackDraft {
  return {
    id: uid('atk'),
    enabled: true,
    name: '',
    cost: 'C',
    damage: '0',
    damageCalculation: '',
    text: '',
    selectedPrefabs: [],
  };
}

function emptyPower(): PowerDraft {
  return {
    id: uid('pwr'),
    name: '',
    powerType: 'ABILITY',
    text: '',
    useWhenInPlay: false,
    useFromHand: false,
    useFromHandToBench: false,
    useFromDiscard: false,
    exemptFromAbilityLock: false,
    exemptFromInitialize: false,
    abilityLock: false,
    barrage: false,
    knocksOutSelf: false,
    isFossil: false,
    selectedPrefabs: [],
  };
}

function defaultDraft(): CardDraft {
  return {
    className: '',
    extends: 'PokemonCard',
    stage: 'BASIC',
    evolvesFrom: '',
    tags: '',
    hp: '60',
    cardType: 'C',
    weaknessType: '',
    weaknessValue: 'x2',
    resistanceType: '',
    resistanceValue: '-20',
    retreat: 'C',
    hasPowers: false,
    hasAttacks: true,
    powers: [emptyPower()],
    attacks: [emptyAttack()],
    regulationMark: '',
    set: '',
    setNumber: '',
    name: '',
    trainerType: 'ITEM',
    trainerText: '',
    trainerPrefabs: [],
    energyType: 'BASIC',
    provides: 'C',
    blendedEnergies: '',
    blendedEnergyCount: '1',
    energyText: '',
  };
}

let draft = defaultDraft();
let outputCode = '';
let outputError = '';
let statusMessage = '';
let view: 'browse' | 'editor' = 'browse';
let browse = createBrowseState();
let browseScrollY = 0;
let sourceMeta: BrowseSourceMeta | null = null;
let imageModalOpen = false;
let imageModalUrl = '';
let imageModalAlt = '';
let reprintCandidates: Array<ReprintCandidate & { imageUrl?: string }> = [];
let selectedReprintKey = '';
let saveAsReprint = false;
let reprintLoading = false;
let reprintError = '';
let reprintLookupVersion = 0;

const app = document.querySelector<HTMLDivElement>('#app')!;

window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && imageModalOpen) {
    imageModalOpen = false;
    imageModalUrl = '';
    render();
  }
});

function reprintKey(candidate: ReprintCandidate): string {
  return `${candidate.sourcePath}:${candidate.className}`;
}

function selectedReprintCandidate(): (ReprintCandidate & { imageUrl?: string }) | undefined {
  return reprintCandidates.find(candidate => reprintKey(candidate) === selectedReprintKey);
}

function clearReprintState(): void {
  reprintLookupVersion++;
  reprintCandidates = [];
  selectedReprintKey = '';
  saveAsReprint = false;
  reprintLoading = false;
  reprintError = '';
}

async function refreshReprintCandidates(): Promise<void> {
  const name = draft.name.trim();
  const set = draft.set.trim().toUpperCase();
  const lookupVersion = ++reprintLookupVersion;
  reprintCandidates = [];
  selectedReprintKey = '';
  saveAsReprint = false;
  reprintError = '';
  if (!name || !set) {
    reprintLoading = false;
    render();
    return;
  }

  reprintLoading = true;
  render();
  try {
    const candidates = await findReprintCandidates(set, name, draft.setNumber);
    const cardsBySet = new Map<string, Awaited<ReturnType<typeof findCardsByNameAndSet>>>();
    await Promise.all(
      [...new Set(candidates.map(candidate => candidate.set))].map(async candidateSet => {
        cardsBySet.set(candidateSet, await findCardsByNameAndSet(name, candidateSet));
      })
    );
    if (lookupVersion !== reprintLookupVersion) return;
    reprintCandidates = candidates.map(candidate => ({
      ...candidate,
      imageUrl: cardImageUrl(
        cardsBySet.get(candidate.set)?.find(card => card.localId === candidate.setNumber)?.image,
        'high'
      ),
    }));
    selectedReprintKey = reprintCandidates.length > 0 ? reprintKey(reprintCandidates[0]) : '';
    saveAsReprint = reprintCandidates.length === 1;
  } catch (error) {
    if (lookupVersion !== reprintLookupVersion) return;
    reprintError = error instanceof Error ? error.message : String(error);
  } finally {
    if (lookupVersion === reprintLookupVersion) {
      reprintLoading = false;
      render();
    }
  }
}

async function ensureSeriesLoaded() {
  if (browse.series.length > 0 || browse.loading) return;
  await ensureImplementedLoaded(browse);
  await loadSeries(browse);
  render();
}

function energyOptions(selected: string, includeEmpty = false): string {
  const opts = ENERGY_SHORTS.map(
    e => `<option value="${e}" ${selected === e ? 'selected' : ''}>${ENERGY_LABELS[e]}</option>`
  );
  if (includeEmpty) {
    opts.unshift(`<option value="" ${selected === '' ? 'selected' : ''}>(none)</option>`);
  }
  return opts.join('');
}

function renderPrefabPicker(
  kind: 'attack' | 'power' | 'trainer',
  itemId: string,
  selected: AttackDraft['selectedPrefabs']
): string {
  const catalog = prefabsForScope(kind);
  const options = catalog
    .map(p => `<option value="${p.id}">${p.name} — ${p.description}</option>`)
    .join('');

  const rows = selected
    .map(sel => {
      const prefab = getPrefabById(sel.prefabId);
      if (!prefab) return '';
      const paramFields = prefab.params
        .map(p => {
          const val = sel.params[p.key] ?? '';
          return `<label class="param">${p.label}
            <input data-action="prefab-param" data-kind="${kind}" data-item="${itemId}" data-sel="${sel.id}" data-key="${p.key}" value="${escapeAttr(val)}" />
          </label>`;
        })
        .join('');
      return `<div class="prefab-row">
        <div class="prefab-row-head">
          <strong>${prefab.name}</strong>
          <span class="badge">${sel.source}</span>
          <button type="button" class="danger" data-action="remove-prefab" data-kind="${kind}" data-item="${itemId}" data-sel="${sel.id}">Remove</button>
        </div>
        <p class="muted">${escapeHtml(prefab.description)}</p>
        <div class="param-row">${paramFields || '<span class="muted">No parameters</span>'}</div>
      </div>`;
    })
    .join('');

  return `<div class="prefab-panel">
    <h4>reduceEffect prefabs</h4>
    ${rows || '<p class="muted">No prefabs selected yet. Match from text or add manually.</p>'}
    <div class="row">
      <select data-role="prefab-select" data-kind="${kind}" data-item="${itemId}">
        <option value="">Add prefab…</option>
        ${options}
      </select>
      <button type="button" data-action="add-prefab" data-kind="${kind}" data-item="${itemId}">Add</button>
      <button type="button" data-action="match-prefabs" data-kind="${kind}" data-item="${itemId}">Match from text</button>
    </div>
  </div>`;
}

function renderAttack(attack: AttackDraft, index: number): string {
  return `<section class="card-block" data-attack-id="${attack.id}">
    <div class="block-head">
      <h3>Attack ${index + 1}</h3>
      <button type="button" class="danger" data-action="remove-attack" data-id="${attack.id}" ${draft.attacks.length <= 1 ? 'disabled' : ''}>Remove</button>
    </div>
    <div class="grid-3">
      <label>Name<input data-field="attack" data-id="${attack.id}" data-key="name" value="${escapeAttr(attack.name)}" /></label>
      <label>Cost (e.g. RCC)<input data-field="attack" data-id="${attack.id}" data-key="cost" value="${escapeAttr(attack.cost)}" placeholder="RCC" /></label>
      <label>Damage<input type="number" data-field="attack" data-id="${attack.id}" data-key="damage" value="${escapeAttr(attack.damage)}" /></label>
    </div>
    <div class="grid-2">
      <label>Damage calculation
        <select data-field="attack" data-id="${attack.id}" data-key="damageCalculation">
          <option value="" ${attack.damageCalculation === '' ? 'selected' : ''}>(none)</option>
          <option value="+" ${attack.damageCalculation === '+' ? 'selected' : ''}>+</option>
          <option value="x" ${attack.damageCalculation === 'x' ? 'selected' : ''}>x</option>
          <option value="-" ${attack.damageCalculation === '-' ? 'selected' : ''}>-</option>
        </select>
      </label>
      <label>Parsed cost preview
        <input readonly value="${parseEnergyCost(attack.cost).join(', ') || '(empty)'}" />
      </label>
    </div>
    <label>Attack text
      <textarea data-field="attack" data-id="${attack.id}" data-key="text" rows="3" placeholder="Flip a coin. If heads, the Defending Pokemon is now Paralyzed.">${escapeHtml(attack.text)}</textarea>
    </label>
    ${attack.matchError ? `<div class="error-box">${escapeHtml(attack.matchError)}</div>` : ''}
    ${renderPrefabPicker('attack', attack.id, attack.selectedPrefabs)}
  </section>`;
}

function renderPower(power: PowerDraft, index: number): string {
  const powerTypeOpts = POWER_TYPES.map(
    t => `<option value="${t}" ${power.powerType === t ? 'selected' : ''}>${t}</option>`
  ).join('');

  const bools: Array<[keyof PowerDraft, string]> = [
    ['useWhenInPlay', 'useWhenInPlay'],
    ['useFromHand', 'useFromHand'],
    ['useFromHandToBench', 'useFromHandToBench'],
    ['useFromDiscard', 'useFromDiscard'],
    ['exemptFromAbilityLock', 'exemptFromAbilityLock'],
    ['exemptFromInitialize', 'exemptFromInitialize'],
    ['abilityLock', 'abilityLock'],
    ['barrage', 'barrage'],
    ['knocksOutSelf', 'knocksOutSelf'],
    ['isFossil', 'isFossil'],
  ];

  const boolHtml = bools
    .map(
      ([key, label]) =>
        `<label class="check"><input type="checkbox" data-field="power-bool" data-id="${power.id}" data-key="${key}" ${power[key] ? 'checked' : ''} /> ${label}</label>`
    )
    .join('');

  return `<section class="card-block" data-power-id="${power.id}">
    <div class="block-head">
      <h3>Power ${index + 1}</h3>
      <button type="button" class="danger" data-action="remove-power" data-id="${power.id}" ${draft.powers.length <= 1 ? 'disabled' : ''}>Remove</button>
    </div>
    <div class="grid-2">
      <label>Name<input data-field="power" data-id="${power.id}" data-key="name" value="${escapeAttr(power.name)}" /></label>
      <label>Power type<select data-field="power" data-id="${power.id}" data-key="powerType">${powerTypeOpts}</select></label>
    </div>
    <div class="checks">${boolHtml}</div>
    <label>Power text
      <textarea data-field="power" data-id="${power.id}" data-key="text" rows="3">${escapeHtml(power.text)}</textarea>
    </label>
    ${power.matchError ? `<div class="error-box">${escapeHtml(power.matchError)}</div>` : ''}
    ${renderPrefabPicker('power', power.id, power.selectedPrefabs)}
  </section>`;
}

function renderPokemonFields(): string {
  const stageOpts = STAGES.map(
    s => `<option value="${s}" ${draft.stage === s ? 'selected' : ''}>${s}</option>`
  ).join('');

  return `
    <div class="grid-3">
      <label>Stage<select data-root="stage">${stageOpts}</select></label>
      <label>Card type<select data-root="cardType">${energyOptions(draft.cardType)}</select></label>
      <label>HP<input type="number" data-root="hp" value="${escapeAttr(draft.hp)}" /></label>
    </div>
    <div class="grid-2">
      <label>Evolves from<input data-root="evolvesFrom" value="${escapeAttr(draft.evolvesFrom)}" placeholder="optional" /></label>
      <label>Tags (comma CardTag names)<input data-root="tags" value="${escapeAttr(draft.tags)}" placeholder="POKEMON_ex, MEGA" /></label>
    </div>
    <div class="grid-3">
      <label>Weakness type<select data-root="weaknessType">${energyOptions(draft.weaknessType, true)}</select></label>
      <label>Weakness value
        <select data-root="weaknessValue">
          <option value="x2" ${draft.weaknessValue === 'x2' ? 'selected' : ''}>2x</option>
          <option value="+20" ${draft.weaknessValue === '+20' ? 'selected' : ''}>+20</option>
          <option value="+30" ${draft.weaknessValue === '+30' ? 'selected' : ''}>+30</option>
        </select>
      </label>
      <label>Retreat (C per cost)<input data-root="retreat" value="${escapeAttr(draft.retreat)}" placeholder="CCC" /></label>
    </div>
    <div class="grid-2">
      <label>Resistance type<select data-root="resistanceType">${energyOptions(draft.resistanceType, true)}</select></label>
      <label>Resistance value<input data-root="resistanceValue" value="${escapeAttr(draft.resistanceValue)}" placeholder="-20" /></label>
    </div>

    <div class="toggle-row">
      <label class="check"><input type="checkbox" data-root="hasPowers" ${draft.hasPowers ? 'checked' : ''} /> Has powers / abilities</label>
      <label class="check"><input type="checkbox" data-root="hasAttacks" ${draft.hasAttacks ? 'checked' : ''} /> Has attacks</label>
    </div>

  `;
}

function renderPokemonEffects(): string {
  return `
    ${
      draft.hasPowers
        ? `<section class="section effects-section">
            <div class="block-head"><h2>Powers</h2>
              <button type="button" data-action="add-power">Add power</button>
            </div>
            ${draft.powers.map(renderPower).join('')}
          </section>`
        : ''
    }

    ${
      draft.hasAttacks
        ? `<section class="section effects-section">
            <div class="block-head"><h2>Attacks</h2>
              <button type="button" data-action="add-attack">Add attack</button>
            </div>
            ${draft.attacks.map(renderAttack).join('')}
          </section>`
        : ''
    }
  `;
}

function renderTrainerFields(): string {
  return `
    <div class="grid-2">
      <label>Trainer type
        <select data-root="trainerType">
          ${(['ITEM', 'SUPPORTER', 'STADIUM', 'TOOL'] as const)
            .map(t => `<option value="${t}" ${draft.trainerType === t ? 'selected' : ''}>${t}</option>`)
            .join('')}
        </select>
      </label>
      <label>Tags (comma CardTag names)<input data-root="tags" value="${escapeAttr(draft.tags)}" placeholder="ACE_SPEC" /></label>
    </div>
    <label>Text<textarea data-root="trainerText" rows="4">${escapeHtml(draft.trainerText)}</textarea></label>
    ${renderPrefabPicker('trainer', 'trainer-effect', draft.trainerPrefabs)}
    ${draft.trainerServerEffect ? `<p class="muted">Fallback matched ${escapeHtml(draft.trainerServerEffect.source)} (${Math.round(draft.trainerServerEffect.similarity * 100)}% text similarity).</p>` : ''}
    <p class="muted">Trainer effects try shared prefabs first, then reuse a similar Trainer reducer from the server codebase.</p>
  `;
}

function renderEnergyFields(): string {
  return `
    <div class="grid-2">
      <label>Energy type
        <select data-root="energyType">
          <option value="BASIC" ${draft.energyType === 'BASIC' ? 'selected' : ''}>BASIC</option>
          <option value="SPECIAL" ${draft.energyType === 'SPECIAL' ? 'selected' : ''}>SPECIAL</option>
        </select>
      </label>
      <label>Provides (e.g. CC)<input data-root="provides" value="${escapeAttr(draft.provides)}" /></label>
      <label>Choosable types (blend/unit, e.g. FDY)<input data-root="blendedEnergies" value="${escapeAttr(draft.blendedEnergies)}" placeholder="optional — listed in provides at check time" /></label>
      <label>Choosable unit count<input type="number" min="1" data-root="blendedEnergyCount" value="${escapeAttr(draft.blendedEnergyCount)}" /></label>
    </div>
    <label>Tags (comma CardTag names)<input data-root="tags" value="${escapeAttr(draft.tags)}" placeholder="ACE_SPEC" /></label>
    <label>Text<textarea data-root="energyText" rows="3">${escapeHtml(draft.energyText)}</textarea></label>
    ${draft.energyServerEffect ? `<p class="muted">Fallback matched ${escapeHtml(draft.energyServerEffect.source)} (${Math.round(draft.energyServerEffect.similarity * 100)}% text similarity).</p>` : ''}
  `;
}

function computedFullName(): string {
  const name = draft.name.trim();
  const set = draft.set.trim();
  if (!name) return '(name + set)';
  return set ? `${name} ${set}` : name;
}

function computedClassName(): string {
  if (draft.className.trim()) return draft.className.trim();
  return (
    draft.name
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') || '(from name)'
  );
}

function renderReprintSection(): string {
  const selected = selectedReprintCandidate();
  const name = draft.name.trim();
  const set = draft.set.trim();
  let content = '';
  if (!name || !set) {
    content = '<p class="muted">Enter a card name and set to check for existing reprint sources.</p>';
  } else if (reprintLoading) {
    content = '<p class="muted">Checking the set for an existing card with this name…</p>';
  } else if (reprintError) {
    content = `<p class="muted">${escapeHtml(reprintError)}</p>`;
  } else if (reprintCandidates.length === 0) {
    content = '<p class="muted">No same-set reprint candidate found.</p>';
  } else {
    content = `
      <p class="muted">Found ${reprintCandidates.length} existing card${reprintCandidates.length === 1 ? '' : 's'} with this name. Confirm the source before saving.</p>
      <div class="reprint-options">
        ${reprintCandidates
          .map(candidate => {
            const key = reprintKey(candidate);
            return `<div class="reprint-option${key === selectedReprintKey ? ' is-selected' : ''}">
              <input type="radio" name="reprint-source" data-reprint-candidate="${escapeAttr(key)}" value="${escapeAttr(key)}" ${key === selectedReprintKey ? 'checked' : ''} aria-label="Use ${escapeAttr(candidate.fullName || candidate.name)} as reprint source" />
              ${candidate.imageUrl
                ? `<button type="button" class="reprint-image-button" data-action="open-reprint-image" data-image-url="${escapeAttr(candidate.imageUrl)}" data-image-alt="${escapeAttr(candidate.fullName || candidate.name)}" aria-label="Enlarge ${escapeAttr(candidate.fullName || candidate.name)} image"><img src="${escapeAttr(candidate.imageUrl)}" alt="${escapeAttr(candidate.fullName || candidate.name)}" /></button>`
                : '<div class="reprint-image-missing">No art</div>'}
              <div><strong>${escapeHtml(candidate.fullName || candidate.name)}</strong><small>${escapeHtml(candidate.set)} · #${escapeHtml(candidate.setNumber)} · ${escapeHtml(candidate.sourcePath)}</small></div>
            </div>`;
          })
          .join('')}
      </div>
      <label class="reprint-toggle"><input type="checkbox" data-reprint-enabled ${saveAsReprint ? 'checked' : ''} /> Save as a reprint in <code>other-prints.ts</code></label>
      ${selected ? `<p class="muted">The saved class will inherit <code>${escapeHtml(selected.className)}</code> and override this print’s set metadata.</p>` : ''}
    `;
  }
  return `<section class="reprint-section">
    <div class="block-head"><h3>Possible reprint</h3></div>
    ${content}
  </section>`;
}

type RenderScrollMode = 'preserve' | 'top' | 'browse';

function render(scrollMode: RenderScrollMode = 'preserve') {
  const scrollY =
    scrollMode === 'top' ? 0 : scrollMode === 'browse' ? browseScrollY : window.scrollY;
  const active = document.activeElement as HTMLElement | null;
  const activeKey =
    active?.getAttribute('data-output') ||
    active?.getAttribute('data-root') ||
    active?.getAttribute('data-key') ||
    active?.getAttribute('data-action') ||
    '';
  const activeId = active?.getAttribute('data-id') || active?.getAttribute('data-item') || '';
  const selStart =
    active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
      ? active.selectionStart
      : null;
  const selEnd =
    active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
      ? active.selectionEnd
      : null;
  const selectedReprint = selectedReprintCandidate();
  const canSave = Boolean(outputCode || (saveAsReprint && selectedReprint));

  const heroActions =
    view === 'browse'
      ? `<button type="button" data-action="show-editor">Blank card form</button>
         <button type="button" data-action="reload-browse">Reload catalog</button>`
      : `<button type="button" data-action="show-browse">← Browse cards</button>
         <button type="button" class="primary" data-action="generate">Generate card</button>
         <button type="button" data-action="save" ${canSave ? '' : 'disabled'}>${saveAsReprint && selectedReprint ? 'Save reprint to other-prints.ts' : 'Save to ptcg-server'}</button>
         <button type="button" data-action="copy" ${outputCode ? '' : 'disabled'}>Copy output</button>
         <button type="button" data-action="reset">Reset form</button>`;

  const sourceBanner =
    view === 'editor' && sourceMeta
      ? `<div class="source-banner">
          ${sourceMeta.imageUrl ? `<button type="button" class="source-image-button" data-action="open-image-modal" aria-label="Enlarge card image"><img src="${escapeAttr(sourceMeta.imageUrl)}" alt="Reference card" /></button>` : ''}
          <div>
            <strong>Loaded from local catalog</strong>
            <p class="muted">${escapeHtml(sourceMeta.tcgDexId)}${sourceMeta.setName ? ` · ${escapeHtml(sourceMeta.setName)}` : ''}${sourceMeta.rarity ? ` · ${escapeHtml(sourceMeta.rarity)}` : ''}</p>
            <p class="muted">Art is reference only — generated <code>cardImage</code> stays <code>assets/cardback.png</code>. Match prefabs from attack/power text before generating.</p>
          </div>
        </div>`
      : '';

  const body =
    view === 'browse'
      ? renderBrowse(browse)
      : `<main class="layout">
      <form class="form" id="card-form">
        ${sourceBanner}
        <section class="section identity-section">
          <h2>Identity</h2>
          <div class="grid-3">
            <label>Class name<input data-root="className" value="${escapeAttr(draft.className)}" placeholder="${escapeAttr(computedClassName())}" /></label>
            <label>Extends
              <select data-root="extends">
                <option value="PokemonCard" ${draft.extends === 'PokemonCard' ? 'selected' : ''}>PokemonCard</option>
                <option value="TrainerCard" ${draft.extends === 'TrainerCard' ? 'selected' : ''}>TrainerCard</option>
                <option value="EnergyCard" ${draft.extends === 'EnergyCard' ? 'selected' : ''}>EnergyCard</option>
              </select>
            </label>
            <label>Name<input data-root="name" value="${escapeAttr(draft.name)}" /></label>
          </div>
          <div class="grid-3">
            <label>Set<input data-root="set" value="${escapeAttr(draft.set)}" placeholder="TEF" /></label>
            <label>Set number<input data-root="setNumber" value="${escapeAttr(draft.setNumber)}" /></label>
            <label>Regulation mark<input data-root="regulationMark" value="${escapeAttr(draft.regulationMark)}" placeholder="H" /></label>
          </div>
          <div class="grid-2">
            <label>cardImage<input readonly value="assets/cardback.png" /></label>
            <label>fullName (name + set)<input readonly value="${escapeAttr(computedFullName())}" /></label>
          </div>
          ${
            draft.extends === 'PokemonCard'
              ? renderPokemonFields()
              : ''
          }
        </section>

        ${
          draft.extends === 'PokemonCard'
            ? renderPokemonEffects()
            : draft.extends === 'TrainerCard'
              ? renderTrainerFields()
              : renderEnergyFields()
        }
      </form>

      <aside class="output">
        <div class="block-head">
          <h2>Generated TypeScript</h2>
        </div>
        <textarea
          class="generated-code"
          data-output="generated-code"
          aria-label="Generated TypeScript"
          spellcheck="false"
          placeholder="Click “Generate card” to emit source."
        >${escapeHtml(outputCode)}</textarea>
        ${renderReprintSection()}
        <details class="catalog-help">
          <summary>Available attack/ability prefab patterns</summary>
          <ul>
            ${prefabsForScope('attack')
              .concat(prefabsForScope('power').filter((p) => p.scope === 'power'))
              .map(
                (p) =>
                  `<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.exampleTexts[0] || p.description)}</li>`
              )
              .join('')}
          </ul>
        </details>
      </aside>
    </main>`;

  app.innerHTML = `
    <header class="hero">
      <div>
        <p class="eyebrow">Local only · PTCG Elite · pokemon-tcg-data</p>
        <h1>${view === 'browse' ? 'Browse cards' : 'Card Builder'}</h1>
        <p class="lede">${
          view === 'browse'
            ? 'Pick a series → set → card to pre-fill the generator. Effect text can be matched to prefabs when available.'
            : 'Scaffold card TypeScript from form fields. Attack/ability effects emit reduceEffect code when a matching prefab exists.'
        }</p>
      </div>
      <div class="hero-actions">
        ${heroActions}
      </div>
    </header>

    ${statusMessage ? `<div class="status-box">${escapeHtml(statusMessage)}</div>` : ''}
    ${outputError ? `<div class="error-box">${escapeHtml(outputError)}</div>` : ''}

    ${body}
    ${
      imageModalOpen && imageModalUrl
        ? `<div class="image-modal-backdrop" data-image-modal role="dialog" aria-modal="true" aria-label="Card image preview">
            <div class="image-modal">
              <button type="button" class="modal-close" data-action="close-image-modal" aria-label="Close image preview">×</button>
              <img src="${escapeAttr(imageModalUrl)}" alt="${escapeAttr(imageModalAlt || 'Card image enlarged')}" />
            </div>
          </div>`
        : ''
    }
  `;

  bindEvents();
  if (view === 'browse') bindBrowseEvents();

  // Restore focus roughly
  if (activeKey && view === 'editor') {
    const candidates = Array.from(
      app.querySelectorAll<HTMLElement>(
        `[data-output="${activeKey}"], [data-root="${activeKey}"], [data-key="${activeKey}"]`
      )
    );
    const el =
      (activeId
        ? candidates.find(
            c =>
              c.getAttribute('data-id') === activeId || c.getAttribute('data-item') === activeId
          )
        : candidates[0]) || candidates[0];
    if (el && 'focus' in el) {
      (el as HTMLInputElement).focus();
      if (
        selStart !== null &&
        (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)
      ) {
        try {
          el.setSelectionRange(selStart, selEnd ?? selStart);
        } catch {
          /* ignore */
        }
      }
    }
  }
  window.scrollTo(0, scrollY);
}

function bindBrowseEvents() {
  app.querySelectorAll<HTMLButtonElement>('[data-browse]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const action = btn.getAttribute('data-browse');
      await handleBrowse(action, btn);
    });
  });

  const searchForm = app.querySelector<HTMLFormElement>('[data-browse-form="search"]');
  searchForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const q = new FormData(searchForm).get('q');
    const query = String(q || '').trim();
    if (!query) return;
    browse.searchOffset = 0;
    browse.searchHasMore = false;
    browse.cards = [];
    statusMessage = '';
    outputError = '';
    browse.loading = true;
    render();
    await runSearch(browse, query);
    render();
  });

  const filterInput = app.querySelector<HTMLInputElement>('[data-browse-filter]');
  filterInput?.addEventListener('input', () => {
    browse.filter = filterInput.value;
    // Re-render body only would be nicer; full render is ok
    const pos = filterInput.selectionStart;
    render();
    const again = app.querySelector<HTMLInputElement>('[data-browse-filter]');
    if (again) {
      again.focus();
      try {
        again.setSelectionRange(pos, pos);
      } catch {
        /* ignore */
      }
    }
  });

  const hideImpl = app.querySelector<HTMLInputElement>('[data-browse-hide-implemented]');
  hideImpl?.addEventListener('change', () => {
    browse.hideImplemented = hideImpl.checked;
    render();
  });
}

async function handleBrowse(action: string | null, btn: HTMLButtonElement) {
  switch (action) {
    case 'search-prev': {
      if (browse.searchOffset <= 0) return;
      browse.loading = true;
      statusMessage = `Searching ${browse.searchQuery}…`;
      outputError = '';
      browse.searchOffset = Math.max(0, browse.searchOffset - browse.searchPageSize);
      render();
      await runSearch(browse, browse.searchQuery);
      render();
      break;
    }
    case 'search-next': {
      if (!browse.searchHasMore) return;
      browse.loading = true;
      statusMessage = `Searching ${browse.searchQuery}…`;
      outputError = '';
      browse.searchOffset += browse.searchPageSize;
      render();
      await runSearch(browse, browse.searchQuery);
      render();
      break;
    }
    case 'go-series':
      browse.level = 'series';
      browse.filter = '';
      browse.error = '';
      if (browse.series.length === 0) {
        browse.loading = true;
        render();
        await loadSeries(browse);
      }
      render();
      break;
    case 'go-sets':
      if (browse.activeSerieId) {
        browse.level = 'sets';
        browse.filter = '';
        render();
      } else {
        browse.level = 'series';
        render();
      }
      break;
    case 'open-serie': {
      const id = btn.getAttribute('data-id')!;
      const name = btn.getAttribute('data-name') || id;
      browse.loading = true;
      render();
      await loadSerieSets(browse, id, name);
      render();
      break;
    }
    case 'open-set': {
      const id = btn.getAttribute('data-id')!;
      browse.loading = true;
      render();
      await loadSetCards(browse, id);
      render();
      break;
    }
    case 'pick-card': {
      const id = btn.getAttribute('data-id')!;
      browseScrollY = window.scrollY;
      browse.loading = true;
      statusMessage = `Loading ${id}…`;
      outputError = '';
      render();
      try {
        const { draft: next, meta } = await pickCardToDraft(id);
        draft = next;
        sourceMeta = meta;
        outputCode = '';
        view = 'editor';
        statusMessage = `Pre-filled from ${id}. Match prefabs, then Generate.`;
        browse.loading = false;
      } catch (err) {
        browse.loading = false;
        statusMessage = '';
        outputError =
          err instanceof TcgDexApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : String(err);
      }
      render(view === 'editor' ? 'top' : 'preserve');
      if (view === 'editor') void refreshReprintCandidates();
      break;
    }
  }
}

function findAttack(id: string): AttackDraft | undefined {
  return draft.attacks.find(a => a.id === id);
}

function findPower(id: string): PowerDraft | undefined {
  return draft.powers.find(p => p.id === id);
}

function findSelectedPrefabs(kind: 'attack' | 'power' | 'trainer', itemId: string): AttackDraft['selectedPrefabs'] | undefined {
  if (kind === 'attack') return findAttack(itemId)?.selectedPrefabs;
  if (kind === 'power') return findPower(itemId)?.selectedPrefabs;
  return draft.trainerPrefabs;
}

function bindEvents() {
  const imageModal = app.querySelector<HTMLDivElement>('[data-image-modal]');
  imageModal?.addEventListener('click', event => {
    if (event.target === imageModal) {
      imageModalOpen = false;
      render();
    }
  });

  app.querySelectorAll<HTMLInputElement>('[data-reprint-candidate]').forEach(input => {
    input.addEventListener('change', () => {
      selectedReprintKey = input.value;
      saveAsReprint = true;
      render();
    });
  });

  const reprintToggle = app.querySelector<HTMLInputElement>('[data-reprint-enabled]');
  reprintToggle?.addEventListener('change', () => {
    saveAsReprint = reprintToggle.checked;
    render();
  });

  const generatedCode = app.querySelector<HTMLTextAreaElement>('[data-output="generated-code"]');
  generatedCode?.addEventListener('input', () => {
    outputCode = generatedCode.value;
  });

  app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-root]').forEach(el => {
    const key = el.getAttribute('data-root')!;
    const handler = () => {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        (draft as any)[key] = el.checked;
      } else {
        (draft as any)[key] = el.value;
      }
      if (key === 'extends' || key === 'hasPowers' || key === 'hasAttacks') {
        render();
      }
      if (key === 'name' || key === 'set' || key === 'setNumber') {
        void refreshReprintCandidates();
      }
    };
    el.addEventListener('change', handler);
    if (!(el instanceof HTMLSelectElement) && !(el instanceof HTMLInputElement && el.type === 'checkbox')) {
      el.addEventListener('input', () => {
        (draft as any)[key] = el.value;
      });
    }
  });

  app.querySelectorAll<HTMLElement>('[data-field="attack"]').forEach(el => {
    const id = el.getAttribute('data-id')!;
    const key = el.getAttribute('data-key')!;
    const apply = () => {
      const attack = findAttack(id);
      if (!attack) return;
      (attack as any)[key] = (el as HTMLInputElement).value;
      if (key === 'cost') render();
    };
    el.addEventListener('change', apply);
    el.addEventListener('input', () => {
      const attack = findAttack(id);
      if (!attack) return;
      (attack as any)[key] = (el as HTMLInputElement).value;
    });
  });

  app.querySelectorAll<HTMLElement>('[data-field="power"]').forEach(el => {
    const id = el.getAttribute('data-id')!;
    const key = el.getAttribute('data-key')!;
    el.addEventListener('change', () => {
      const power = findPower(id);
      if (!power) return;
      (power as any)[key] = (el as HTMLInputElement).value;
    });
    el.addEventListener('input', () => {
      const power = findPower(id);
      if (!power) return;
      (power as any)[key] = (el as HTMLInputElement).value;
    });
  });

  app.querySelectorAll<HTMLInputElement>('[data-field="power-bool"]').forEach(el => {
    el.addEventListener('change', () => {
      const power = findPower(el.getAttribute('data-id')!);
      if (!power) return;
      (power as any)[el.getAttribute('data-key')!] = el.checked;
    });
  });

  app.querySelectorAll<HTMLInputElement>('[data-action="prefab-param"]').forEach(el => {
    el.addEventListener('input', () => {
      const kind = el.getAttribute('data-kind') as 'attack' | 'power' | 'trainer';
      const itemId = el.getAttribute('data-item')!;
      const selId = el.getAttribute('data-sel')!;
      const key = el.getAttribute('data-key')!;
      const selected = findSelectedPrefabs(kind, itemId);
      const sel = selected?.find(s => s.id === selId);
      if (sel) sel.params[key] = el.value;
    });
  });

  app.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const action = btn.getAttribute('data-action');
      handleAction(action, btn);
    });
  });
}

async function handleAction(action: string | null, btn: HTMLButtonElement) {
  switch (action) {
    case 'show-browse':
      imageModalOpen = false;
      imageModalUrl = '';
      clearReprintState();
      view = 'browse';
      statusMessage = '';
      outputError = '';
      render('browse');
      void ensureSeriesLoaded();
      break;
    case 'show-editor':
      imageModalOpen = false;
      imageModalUrl = '';
      clearReprintState();
      browseScrollY = window.scrollY;
      view = 'editor';
      sourceMeta = null;
      statusMessage = '';
      render('top');
      break;
    case 'reload-browse':
      imageModalOpen = false;
      imageModalUrl = '';
      clearReprintState();
      browse = createBrowseState();
      view = 'browse';
      statusMessage = '';
      outputError = '';
      clearImplementedCache();
      render();
      void (async () => {
        await resetDataSource();
        await ensureImplementedLoaded(browse);
        await loadSeries(browse);
        render();
      })();
      break;
    case 'add-attack':
      draft.attacks.push(emptyAttack());
      render();
      break;
    case 'remove-attack': {
      const id = btn.getAttribute('data-id')!;
      draft.attacks = draft.attacks.filter(a => a.id !== id);
      if (draft.attacks.length === 0) draft.attacks.push(emptyAttack());
      render();
      break;
    }
    case 'add-power':
      draft.powers.push(emptyPower());
      render();
      break;
    case 'remove-power': {
      const id = btn.getAttribute('data-id')!;
      draft.powers = draft.powers.filter(p => p.id !== id);
      if (draft.powers.length === 0) draft.powers.push(emptyPower());
      render();
      break;
    }
    case 'add-prefab': {
      const kind = btn.getAttribute('data-kind') as 'attack' | 'power' | 'trainer';
      const itemId = btn.getAttribute('data-item')!;
      const select = app.querySelector<HTMLSelectElement>(
        `select[data-role="prefab-select"][data-kind="${kind}"][data-item="${itemId}"]`
      );
      const prefabId = select?.value;
      if (!prefabId) return;
      const created = createManualSelected(prefabId);
      if (!created) return;
      const selected = findSelectedPrefabs(kind, itemId);
      selected?.push(created);
      render();
      break;
    }
    case 'remove-prefab': {
      const kind = btn.getAttribute('data-kind') as 'attack' | 'power' | 'trainer';
      const itemId = btn.getAttribute('data-item')!;
      const selId = btn.getAttribute('data-sel')!;
      const selected = findSelectedPrefabs(kind, itemId);
      if (selected) {
        selected.splice(0, selected.length, ...selected.filter(s => s.id !== selId));
      }
      render();
      break;
    }
    case 'match-prefabs': {
      const kind = btn.getAttribute('data-kind') as 'attack' | 'power' | 'trainer';
      const itemId = btn.getAttribute('data-item')!;
      const item = kind === 'attack' ? findAttack(itemId) : kind === 'power' ? findPower(itemId) : undefined;
      const text = kind === 'trainer' ? draft.trainerText : item?.text;
      if (!text) return;
      try {
        const matched = matchEffectText(text, kind);
        if (kind === 'trainer') {
          draft.trainerPrefabs = matchedToSelected(matched);
          draft.trainerServerEffect = undefined;
        } else if (item) {
          item.selectedPrefabs = matchedToSelected(matched);
          item.matchError = undefined;
          item.serverEffect = undefined;
        }
        statusMessage = matched.length
          ? `Matched ${matched.length} prefab(s).`
          : 'No effect text — nothing to match (plain damage attack is OK).';
        outputError = '';
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (kind === 'trainer') {
          draft.trainerPrefabs = [];
        } else if (item) {
          item.matchError = msg;
          item.selectedPrefabs = [];
        }
        statusMessage = '';
        outputError = msg;
      }
      render();
      break;
    }
    case 'generate': {
      // Sync latest input values that may not have blurred
      syncAllInputs();
      try {
        outputCode = await generateCardSource(draft);
        outputError = '';
        statusMessage = 'Generated successfully.';
      } catch (err) {
        outputCode = '';
        outputError = err instanceof MissingPrefabError
          ? err.message
          : err instanceof Error
            ? err.message
            : String(err);
        statusMessage = '';
      }
      render();
      break;
    }
    case 'open-image-modal':
      if (!sourceMeta?.imageUrl) return;
      imageModalOpen = true;
      imageModalUrl = sourceMeta.imageUrl;
      imageModalAlt = 'Reference card enlarged';
      render();
      app.querySelector<HTMLButtonElement>('[data-action="close-image-modal"]')?.focus();
      break;
    case 'open-reprint-image': {
      const imageUrl = btn.getAttribute('data-image-url');
      if (!imageUrl) return;
      imageModalOpen = true;
      imageModalUrl = imageUrl;
      imageModalAlt = btn.getAttribute('data-image-alt') || 'Reprint source card enlarged';
      render();
      app.querySelector<HTMLButtonElement>('[data-action="close-image-modal"]')?.focus();
      break;
    }
    case 'close-image-modal':
      imageModalOpen = false;
      imageModalUrl = '';
      render();
      break;
    case 'copy':
      if (outputCode) {
        navigator.clipboard.writeText(outputCode).then(() => {
          statusMessage = 'Copied to clipboard.';
          render();
        });
      }
      break;
    case 'save': {
      syncAllInputs();
      const selected = selectedReprintCandidate();
      const reprint = saveAsReprint && selected
        ? {
            className: draft.className || computedClassName().replace(/[^A-Za-z0-9]/g, ''),
            sourceClassName: selected.className,
            sourcePath: selected.sourcePath,
            name: draft.name,
            set: draft.set,
            setNumber: draft.setNumber,
            fullName: computedFullName(),
            regulationMark: draft.regulationMark,
          }
        : undefined;
      if (!outputCode && !reprint) return;
      const save = async (overwrite: boolean) => {
        const response = await fetch('/save-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            set: draft.set,
            className: draft.className || draft.name.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
            source: outputCode,
            overwrite,
            ...(reprint ? { reprint } : {}),
          }),
        });
        const result = (await response.json()) as { message?: string; error?: string };
        if (response.status === 409 && !overwrite) {
          if (window.confirm('That card file already exists. Overwrite it?')) {
            await save(true);
          }
          return;
        }
        if (!response.ok) throw new Error(result.error || `Save failed (${response.status})`);
        statusMessage = result.message || 'Saved to ptcg-server.';
        outputError = '';
        render();
      };
      void save(false).catch(err => {
        outputError = err instanceof Error ? err.message : String(err);
        statusMessage = '';
        render();
      });
      break;
    }
    case 'reset':
      imageModalOpen = false;
      imageModalUrl = '';
      clearReprintState();
      draft = defaultDraft();
      sourceMeta = null;
      outputCode = '';
      outputError = '';
      statusMessage = '';
      render();
      break;
  }
}

function syncAllInputs() {
  app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-root]').forEach(el => {
    const key = el.getAttribute('data-root')!;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      (draft as any)[key] = el.checked;
    } else {
      (draft as any)[key] = el.value;
    }
  });
  app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-field="attack"]').forEach(el => {
    const attack = findAttack(el.getAttribute('data-id')!);
    if (attack) (attack as any)[el.getAttribute('data-key')!] = el.value;
  });
  app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-field="power"]').forEach(el => {
    const power = findPower(el.getAttribute('data-id')!);
    if (power) (power as any)[el.getAttribute('data-key')!] = el.value;
  });
  app.querySelectorAll<HTMLInputElement>('[data-field="power-bool"]').forEach(el => {
    const power = findPower(el.getAttribute('data-id')!);
    if (power) (power as any)[el.getAttribute('data-key')!] = el.checked;
  });
  app.querySelectorAll<HTMLInputElement>('[data-action="prefab-param"]').forEach(el => {
    const kind = el.getAttribute('data-kind') as 'attack' | 'power' | 'trainer';
    const selected = findSelectedPrefabs(kind, el.getAttribute('data-item')!);
    const sel = selected?.find(s => s.id === el.getAttribute('data-sel'));
    if (sel) sel.params[el.getAttribute('data-key')!] = el.value;
  });

  const generatedCode = app.querySelector<HTMLTextAreaElement>('[data-output="generated-code"]');
  if (generatedCode) outputCode = generatedCode.value;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

// Silence unused type imports used only for casts in comments
void (0 as unknown as EnergyShort | PowerTypeName | StageName | WeaknessValue);

render();
void ensureSeriesLoaded();
