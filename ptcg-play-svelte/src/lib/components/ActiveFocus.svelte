<script lang="ts">
  import CardTile from './CardTile.svelte';
  import { normalizedTypeName, pokemonTypeIconSrc, pokemonTypeLabelFor } from '../game/energyIcons';
  import type { AttackView, AvailableActionsView, CardTarget, CardView, PokemonSlotView } from '../game/types';

  type Props = {
    slot: PokemonSlotView;
    availableActions?: AvailableActionsView;
    benchTargets?: PokemonSlotView[];
    busy?: boolean;
    promptActive?: boolean;
    canAct?: boolean;
    canRetreatToSlot: (from: PokemonSlotView, to: PokemonSlotView) => boolean;
    close: () => void;
    useAbility: (name: string, target: CardTarget) => void;
    attack: (name: string) => void;
    startRetreat: () => void;
  };

  let {
    slot,
    availableActions,
    benchTargets = [],
    busy = false,
    promptActive = false,
    canAct = false,
    canRetreatToSlot,
    close,
    useAbility,
    attack,
    startRetreat,
  }: Props = $props();

  let pokemon = $derived(slot.pokemon);
  let inspectingAttachments = $state(false);
  let isActive = $derived(slot.slot === 'active');
  let actionsDisabled = $derived(busy || promptActive || !canAct);
  let printedHp = $derived(typeof pokemon?.hp === 'number' && Number.isFinite(pokemon.hp) ? pokemon.hp : 0);
  let displayHp = $derived(slot.hp || printedHp);
  let remainingHp = $derived(Math.max(0, displayHp - slot.damage));
  let hpIncreased = $derived(!!displayHp && !!printedHp && displayHp > printedHp);
  let hpDecreased = $derived(!!displayHp && !!printedHp && displayHp < printedHp);
  let focusTypeIcon = $derived(pokemonTypeIconSrc(pokemon?.cardType));
  let focusTypeLabel = $derived(pokemonTypeLabelFor(pokemon?.cardType));
  let detailAttachments = $derived(attachedCards());
  let slotActions = $derived(slot.slot === 'active'
    ? availableActions?.active
    : availableActions?.bench.find((item) => item.index === slot.index));
  let retreatCost = $derived(costTokens(slot.retreat, slot.energy));
  let canPayRetreat = $derived(availableActions?.active?.retreat ? availableActions.active.retreat.legal : retreatCost.every((token) => token.paid));
  let retreatReason = $derived(availableActions?.active?.retreat.reason);
  let hasRetreatTarget = $derived(isActive && benchTargets.some(canRetreatToBench));

  function attackAction(name: string) {
    return availableActions?.active?.attacks.find((item) => item.name === name);
  }

  function abilityAction(name: string) {
    return slotActions?.abilities.find((item) => item.name === name);
  }

  function actionTitle(text: string | undefined, name: string, reason?: string) {
    return [text ?? name, reason].filter(Boolean).join('\n');
  }

  function canRetreatToBench(bench: PokemonSlotView) {
    const retreatAction = availableActions?.active?.retreat;
    if (retreatAction) {
      return retreatAction.targets.includes(bench.index);
    }
    return canRetreatToSlot(slot, bench);
  }

  function normalizeCost(rawCost: unknown): unknown[] {
    return Array.isArray(rawCost) ? rawCost : [];
  }

  function costTokens(rawCost: unknown, attachedEnergy: CardView[]) {
    const usedEnergy = new Set<number>();
    return normalizeCost(rawCost).map((cost, index) => {
      const type = normalizedTypeName(cost) ?? 'colorless';
      const paidBy = findEnergyForCost(type, attachedEnergy, usedEnergy);
      if (paidBy !== -1) {
        usedEnergy.add(paidBy);
      }
      return {
        key: `${index}-${type}`,
        type,
        paid: paidBy !== -1,
        icon: pokemonTypeIconSrc(type) ?? '/assets/energy-icons/colorless.webp',
        label: pokemonTypeLabelFor(type),
      };
    });
  }

  function findEnergyForCost(type: string, attachedEnergy: CardView[], usedEnergy: Set<number>) {
    if (type !== 'colorless') {
      return attachedEnergy.findIndex((energy, index) => !usedEnergy.has(index) && attachedEnergyType(energy) === type);
    }
    return attachedEnergy.findIndex((_, index) => !usedEnergy.has(index));
  }

  function attachedEnergyType(card: CardView) {
    const name = `${card.name} ${card.fullName}`;
    if (/\bGrass Energy\b/i.test(name)) return 'grass';
    if (/\bFire Energy\b/i.test(name)) return 'fire';
    if (/\bWater Energy\b/i.test(name)) return 'water';
    if (/\bLightning Energy\b/i.test(name)) return 'lightning';
    if (/\bPsychic Energy\b/i.test(name)) return 'psychic';
    if (/\bFighting Energy\b/i.test(name)) return 'fighting';
    if (/\bDark(?:ness)? Energy\b/i.test(name)) return 'darkness';
    if (/\bMetal Energy\b/i.test(name)) return 'metal';
    if (/\bFairy Energy\b/i.test(name)) return 'fairy';
    if (/\bColorless Energy\b/i.test(name)) return 'colorless';
    return normalizedTypeName(card.energyType);
  }

  function attackCost(attack: AttackView) {
    return costTokens(attack.cost, slot.energy);
  }

  function canPayAttack(attack: AttackView) {
    return attackAction(attack.name)?.legal ?? attackCost(attack).every((token) => token.paid);
  }

  function sameCard(left: CardView | undefined, right: CardView | undefined) {
    if (!left || !right) {
      return false;
    }
    if (left.id !== undefined && right.id !== undefined) {
      return left.id === right.id;
    }
    return left.name === right.name && left.fullName === right.fullName;
  }

  function isAttachedPokemonCard(card: CardView) {
    return card.hp !== undefined || card.stage !== undefined || !!card.evolvesFrom;
  }

  function attachedCards() {
    const stackedPokemon = slot.cards.filter((card) => isAttachedPokemonCard(card) && !sameCard(card, pokemon));
    return [...stackedPokemon, ...slot.tools, ...slot.energy];
  }

  function attachmentClass(index: number) {
    return `peek-${Math.min(index, 4)}`;
  }
</script>

{#if pokemon}
  <button
    type="button"
    class="active-focus-backdrop"
    aria-label="Close Pokemon actions"
    onclick={close}
  ></button>
  <section class="active-focus" class:inspecting={inspectingAttachments} aria-label={`${pokemon.name} actions`}>
    {#if inspectingAttachments}
      <div class="attachment-inspector" role="dialog" aria-modal="false" aria-label={`${pokemon.name} attached cards`}>
        <div class="attachment-inspector-topline">
          <div>
            <strong>Attached to {pokemon.name}</strong>
            <span>{detailAttachments.length} card{detailAttachments.length === 1 ? '' : 's'}</span>
          </div>
          <button type="button" class="focus-close" onclick={() => (inspectingAttachments = false)} aria-label="Close attached cards">
            Close
          </button>
        </div>
        <div class="attachment-rail">
          <div class="attachment-rail-card main-card" title={pokemon.fullName || pokemon.name}>
            <CardTile card={pokemon} />
          </div>
          {#each detailAttachments as card, index (`inspect-${card.id ?? card.fullName}-${index}`)}
            <div class="attachment-rail-card" title={card.fullName || card.name}>
              <CardTile card={card} />
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="focus-card-column">
        <div class="focus-card-stack">
          {#if detailAttachments.length}
            {#each detailAttachments as card, index (`${card.id ?? card.fullName}-${index}`)}
              <div class={`attached-card ${attachmentClass(index)}`} title={card.fullName || card.name}>
                <CardTile card={card} />
              </div>
            {/each}
          {/if}
          <button
            type="button"
            class="focus-card-button"
            class:has-attachments={detailAttachments.length > 0}
            aria-label={detailAttachments.length ? 'Inspect attached cards' : pokemon.name}
            onclick={() => {
              if (detailAttachments.length) {
                inspectingAttachments = true;
              }
            }}
          >
            <CardTile card={pokemon} />
          </button>
        </div>
      </div>
      <div class="focus-content">
        <div class="focus-title">
          <div>
            <div class="focus-name-line">
              <strong>{pokemon.name}</strong>
              <span class="focus-hp-badge" class:hp-increased={hpIncreased} class:hp-decreased={hpDecreased}>
                <span>{remainingHp}</span>
                <span class="hp-divider">/</span>
                <span>{displayHp}</span>
                <span class="hp-label">HP</span>
                {#if focusTypeIcon}
                  <img src={focusTypeIcon} alt={focusTypeLabel} title={focusTypeLabel} />
                {/if}
              </span>
            </div>
            <span class="focus-meta">
              {slot.slot === 'active' ? 'Active' : `Bench ${slot.index + 1}`}
              · {slot.energy.length} Energy
              {#if slot.tools.length}
                · {slot.tools.length} Tool
              {/if}
            </span>
          </div>
          <button type="button" class="focus-close" onclick={close} aria-label="Close Pokemon actions">
            Close
          </button>
        </div>

        <div class="focus-actions">
          <div class="action-stack">
            {#if pokemon.powers?.length}
              <div class="action-group">
                <span>Abilities</span>
                {#each pokemon.powers as power}
                  {@const action = abilityAction(power.name)}
                  <button
                    class="action-card ability-action"
                    class:used={action?.used}
                    class:unavailable={action?.legal === false}
                    disabled={actionsDisabled || action?.legal === false}
                    title={actionTitle(power.text, power.name, action?.reason)}
                    onclick={() => useAbility(power.name, slot.target)}
                  >
                    <span class="ability-name-line">
                      <img
                        class="ability-badge"
                        class:used={action?.used}
                        src="/assets/ui/ability-badge.png"
                        alt={action?.used ? 'Used ability' : 'Ability'}
                      />
                      <strong>{power.name}</strong>
                      {#if action?.used}
                        <span class="action-kind">Used</span>
                      {/if}
                    </span>
                    {#if power.text}
                      <span class="action-text">{power.text}</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}

            {#if isActive && pokemon.attacks?.length}
              <div class="action-group">
                <span>Attacks</span>
                {#each pokemon.attacks as item}
                  {@const cost = attackCost(item)}
                  {@const affordable = canPayAttack(item)}
                  <button
                    class="action-card attack-action"
                    class:unavailable={!affordable}
                    disabled={actionsDisabled || !affordable}
                    title={actionTitle(item.text, item.name)}
                    onclick={() => attack(item.name)}
                  >
                    <span class="action-card-topline">
                      <span class="attack-name-line">
                        <span class="energy-cost" aria-label={`${cost.length} energy cost`}>
                          {#each cost as token (token.key)}
                            <img class:unpaid={!token.paid} src={token.icon} alt={token.label} title={token.label} />
                          {/each}
                        </span>
                        <strong>{item.name}</strong>
                      </span>
                      {#if item.damage}
                        <span class="attack-damage">{item.damage}</span>
                      {/if}
                    </span>
                    {#if item.text}
                      <span class="action-text">{item.text}</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          {#if isActive}
            <div class="retreat-row">
              <button
                class="retreat-button"
                class:unavailable={!canPayRetreat || !hasRetreatTarget}
                disabled={actionsDisabled || !canPayRetreat || !hasRetreatTarget}
                title={retreatReason}
                onclick={startRetreat}
              >
                <span class="energy-cost" aria-label={`${retreatCost.length} retreat cost`}>
                  {#each retreatCost as token (token.key)}
                    <img class:unpaid={!token.paid} src={token.icon} alt={token.label} title={token.label} />
                  {/each}
                </span>
                <strong>Retreat</strong>
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </section>
{/if}

<style>
  .active-focus-backdrop {
    position: absolute;
    inset: 0;
    z-index: 6;
    width: auto;
    height: auto;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: var(--overlay-backdrop-bg);
  }

  .active-focus {
    --focus-card-w: min(150px, 14vw);
    --focus-card-h: calc(var(--focus-card-w) * 1.397);
    --focus-attach-w: calc(var(--focus-card-w) * 0.86);
    --focus-attachment-peek: calc(var(--focus-card-w) * 0.14);
    --focus-stack-w: calc(var(--focus-card-w) + (var(--focus-attachment-peek) * 5));
    position: absolute;
    z-index: 11;
    left: 50%;
    top: 50%;
    width: min(900px, calc(100vw - 120px));
    max-height: min(78vh, 620px);
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: var(--focus-stack-w) minmax(0, 1fr);
    gap: 18px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--surface-glass-border);
    background: var(--surface-glass-bg);
    color: var(--text-secondary);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: blur(var(--backdrop-blur));
  }

  .active-focus.inspecting {
    width: min(760px, calc(100vw - 150px));
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding: 12px;
  }

  .focus-card-column {
    display: grid;
    align-content: start;
    justify-items: start;
    min-width: 0;
  }

  .focus-card-stack {
    position: relative;
    width: var(--focus-stack-w);
    height: var(--focus-card-h);
    margin-top: 2px;
  }

  .focus-card-button {
    position: absolute;
    z-index: 5;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
    width: var(--focus-card-w);
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
  }

  .focus-card-button.has-attachments {
    cursor: pointer;
  }

  .focus-card-button.has-attachments:hover :global(.card-tile) {
    transform: translateY(-3px);
    box-shadow: var(--glow-hover-shadow);
  }

  .focus-card-button :global(.card-tile) {
    width: var(--focus-card-w);
  }

  .attached-card {
    --attached-card-w: var(--focus-attach-w);
    position: absolute;
    z-index: 1;
    left: 0;
    top: 50%;
    width: var(--attached-card-w);
    transform-origin: 50% 50%;
    filter: saturate(0.96) brightness(0.98);
    pointer-events: none;
    transition:
      transform var(--transition-fast),
      left var(--transition-fast),
      top var(--transition-fast),
      filter var(--transition-fast);
  }

  .attached-card :global(.card-tile) {
    width: var(--attached-card-w);
    box-shadow: 0 5px 12px rgba(23, 30, 38, 0.24);
  }

  .attached-card:nth-child(1) {
    z-index: 4;
  }

  .attached-card:nth-child(2) {
    z-index: 3;
  }

  .attached-card:nth-child(3) {
    z-index: 2;
  }

  .attached-card:nth-child(n + 4) {
    z-index: 1;
  }

  .attached-card.peek-0 {
    transform: translateX(calc(var(--focus-card-w) - var(--attached-card-w) + var(--focus-attachment-peek))) translateY(-50%);
  }

  .attached-card.peek-1 {
    transform: translateX(calc(var(--focus-card-w) - var(--attached-card-w) + (var(--focus-attachment-peek) * 2))) translateY(-50%);
  }

  .attached-card.peek-2 {
    transform: translateX(calc(var(--focus-card-w) - var(--attached-card-w) + (var(--focus-attachment-peek) * 3))) translateY(-50%);
  }

  .attached-card.peek-3 {
    transform: translateX(calc(var(--focus-card-w) - var(--attached-card-w) + (var(--focus-attachment-peek) * 4))) translateY(-50%);
  }

  .attached-card.peek-4 {
    transform: translateX(calc(var(--focus-card-w) - var(--attached-card-w) + (var(--focus-attachment-peek) * 5))) translateY(-50%);
  }

  .focus-content {
    min-width: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    align-content: start;
    gap: 12px;
  }

  .attachment-inspector {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .attachment-inspector-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .attachment-inspector-topline strong {
    display: block;
    color: var(--text-primary);
    font-size: 15px;
    font-weight: 850;
  }

  .attachment-inspector-topline span {
    display: block;
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 11px;
  }

  .attachment-rail {
    --rail-card-w: min(156px, 17vw);
    display: flex;
    gap: 14px;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: visible;
    padding: 4px 4px 14px;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }

  .attachment-rail-card {
    flex: 0 0 auto;
    width: var(--rail-card-w);
    scroll-snap-align: start;
  }

  .attachment-rail-card :global(.card-tile) {
    width: var(--rail-card-w);
  }

  .attachment-rail-card.main-card {
    flex-basis: var(--rail-card-w);
  }

  .focus-title {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: start;
  }

  .focus-title strong,
  .focus-meta {
    display: block;
  }

  .focus-title strong {
    color: var(--text-primary);
    font-size: 17px;
  }

  .focus-name-line {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .focus-name-line > strong {
    min-width: 0;
  }

  .focus-hp-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 28px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--slot-status-border);
    background: var(--slot-status-bg);
    color: var(--slot-status-text);
    box-shadow: var(--slot-status-shadow);
    padding: 4px 7px 4px 9px;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    white-space: nowrap;
  }

  .focus-hp-badge .hp-divider,
  .focus-hp-badge .hp-label {
    color: currentColor;
    opacity: 0.62;
    font-size: 10px;
    font-weight: 850;
  }

  .focus-hp-badge img {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-pill);
    box-shadow: 0 1px 3px rgba(12, 15, 19, 0.24);
  }

  .focus-meta,
  .action-group > span {
    color: var(--text-muted);
    font-size: 11px;
  }

  .focus-hp-badge.hp-increased {
    color: #15803d;
  }

  .focus-hp-badge.hp-decreased {
    color: #b91c1c;
  }

  .focus-close {
    border-radius: 5px;
    padding: 6px 8px;
    border-color: var(--button-border);
    background: var(--button-bg);
    color: var(--button-text);
    font-size: 10px;
    font-weight: 800;
  }

  .focus-actions {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 12px;
    min-height: 0;
  }

  .action-stack {
    display: grid;
    gap: 11px;
    align-content: start;
  }

  .action-group {
    display: grid;
    gap: 7px;
    align-content: start;
  }

  .action-card {
    display: grid;
    gap: 6px;
    border-radius: 7px;
    padding: 9px 10px;
    border-color: var(--button-border);
    background: var(--button-bg);
    color: var(--button-text);
    box-shadow: 0 8px 18px rgba(12, 15, 19, 0.12);
    font-size: 12px;
    line-height: 1.25;
    text-align: left;
  }

  .action-card:hover:not(:disabled) {
    border-color: var(--accent-base);
    background: var(--surface-toolbar-bg);
  }

  .action-card:disabled,
  .action-card.unavailable {
    color: var(--text-muted);
    background: var(--surface-inset-bg);
    box-shadow: none;
  }

  .action-card.unavailable strong {
    color: var(--text-muted);
  }

  .action-card-topline {
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .action-card strong {
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 850;
  }

  .ability-name-line,
  .attack-name-line {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .ability-name-line strong,
  .attack-name-line strong {
    min-width: 0;
  }

  .action-text {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.35;
  }

  .action-kind,
  .attack-damage {
    border-radius: var(--radius-pill);
    background: var(--surface-inset-bg);
    color: var(--text-secondary);
    padding: 3px 7px;
    font-size: 10px;
    font-weight: 850;
  }

  .ability-action:not(:disabled) .action-kind {
    background: var(--accent-soft);
    color: var(--accent-strong);
  }

  .ability-badge {
    width: 72px;
    height: auto;
    display: block;
    filter: drop-shadow(0 1px 2px rgba(12, 15, 19, 0.22));
  }

  .ability-badge.used {
    filter: grayscale(1) opacity(0.62);
  }

  .action-card.used .action-kind {
    background: var(--surface-inset-bg);
    color: var(--text-muted);
  }

  .energy-cost {
    display: flex;
    gap: 3px;
    min-width: 0;
  }

  .energy-cost:empty::after {
    content: 'Free';
    border-radius: var(--radius-pill);
    background: var(--surface-inset-bg);
    color: var(--text-secondary);
    padding: 3px 7px;
    font-size: 10px;
    font-weight: 850;
  }

  .energy-cost img {
    width: 18px;
    height: 18px;
    border-radius: var(--radius-pill);
    box-shadow: 0 1px 3px rgba(12, 15, 19, 0.24);
  }

  .energy-cost img.unpaid {
    filter: grayscale(1);
    opacity: 0.34;
  }

  .retreat-row {
    display: flex;
    justify-content: flex-end;
  }

  .retreat-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 34px;
    border-radius: 7px;
    border-color: var(--button-border);
    background: var(--button-bg);
    color: var(--button-text);
    padding: 7px 10px;
    box-shadow: 0 8px 18px rgba(12, 15, 19, 0.12);
    font-size: 12px;
    font-weight: 850;
  }

  .retreat-button:hover:not(:disabled) {
    border-color: var(--accent-base);
    background: var(--surface-toolbar-bg);
  }

  .retreat-button:disabled,
  .retreat-button.unavailable {
    color: var(--text-muted);
    background: var(--surface-inset-bg);
    box-shadow: none;
  }

  @media (max-width: 980px) {
    .active-focus {
      --focus-card-w: 104px;
      width: min(94vw, 720px);
      grid-template-columns: var(--focus-stack-w) minmax(0, 1fr);
    }
  }
</style>
