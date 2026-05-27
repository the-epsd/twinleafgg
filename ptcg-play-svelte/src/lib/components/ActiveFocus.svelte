<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { CardTarget, PokemonSlotView } from '../game/types';

  type Props = {
    slot: PokemonSlotView;
    benchTargets?: PokemonSlotView[];
    busy?: boolean;
    promptActive?: boolean;
    canAct?: boolean;
    canRetreatToSlot: (from: PokemonSlotView, to: PokemonSlotView) => boolean;
    close: () => void;
    useAbility: (name: string, target: CardTarget) => void;
    attack: (name: string) => void;
    retreat: (benchIndex: number) => void;
  };

  let {
    slot,
    benchTargets = [],
    busy = false,
    promptActive = false,
    canAct = false,
    canRetreatToSlot,
    close,
    useAbility,
    attack,
    retreat,
  }: Props = $props();

  let pokemon = $derived(slot.pokemon);
  let isActive = $derived(slot.slot === 'active');
  let actionsDisabled = $derived(busy || promptActive || !canAct);
  let printedHp = $derived(typeof pokemon?.hp === 'number' && Number.isFinite(pokemon.hp) ? pokemon.hp : 0);
  let displayHp = $derived(slot.hp || printedHp);
  let hpIncreased = $derived(!!displayHp && !!printedHp && displayHp > printedHp);
  let hpDecreased = $derived(!!displayHp && !!printedHp && displayHp < printedHp);
</script>

{#if pokemon}
  <button
    type="button"
    class="active-focus-backdrop"
    aria-label="Close Pokemon actions"
    onclick={close}
  ></button>
  <section class="active-focus" aria-label={`${pokemon.name} actions`}>
    <div class="focus-card">
      <CardTile card={pokemon} />
    </div>
    <div class="focus-content">
      <div class="focus-title">
        <div>
          <strong>{pokemon.name}</strong>
          <span>
            {slot.slot === 'active' ? 'Active' : `Bench ${slot.index + 1}`}
            · <span class="focus-hp" class:hp-increased={hpIncreased} class:hp-decreased={hpDecreased}>{Math.max(0, displayHp - slot.damage)}/{displayHp} HP</span>
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
        {#if pokemon.powers?.length}
          <div class="action-group">
            <span>Abilities</span>
            {#each pokemon.powers as power}
              <button disabled={actionsDisabled} title={power.text ?? power.name} onclick={() => useAbility(power.name, slot.target)}>
                {power.name}
              </button>
            {/each}
          </div>
        {/if}

        {#if isActive && pokemon.attacks?.length}
          <div class="action-group">
            <span>Attacks</span>
            {#each pokemon.attacks as item}
              <button disabled={actionsDisabled} title={item.text ?? item.name} onclick={() => attack(item.name)}>
                {item.name} {item.damage ? `(${item.damage})` : ''}
              </button>
            {/each}
          </div>
        {/if}

        {#if isActive && benchTargets.length}
          <div class="action-group">
            <span>Retreat</span>
            {#each benchTargets as bench}
              <button disabled={actionsDisabled || !canRetreatToSlot(slot, bench)} onclick={() => retreat(bench.index)}>
                To bench {bench.index + 1}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
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
    position: absolute;
    z-index: 11;
    left: 50%;
    top: 50%;
    width: min(720px, calc(100vw - 190px));
    max-height: min(78vh, 620px);
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: minmax(120px, 0.42fr) minmax(0, 1fr);
    gap: 14px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--surface-glass-border);
    background: var(--surface-glass-bg);
    color: var(--text-secondary);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: blur(var(--backdrop-blur));
  }

  .focus-card {
    display: grid;
    place-items: center;
  }

  .focus-card :global(.card-tile) {
    width: min(190px, 22vw);
  }

  .focus-content {
    min-width: 0;
    display: grid;
    align-content: start;
    gap: 12px;
  }

  .focus-title {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: start;
  }

  .focus-title strong,
  .focus-title span {
    display: block;
  }

  .focus-title strong {
    color: var(--text-primary);
    font-size: 17px;
  }

  .focus-title span,
  .action-group > span {
    color: var(--text-muted);
    font-size: 11px;
  }

  .focus-title span .focus-hp {
    display: inline;
    font-size: inherit;
  }

  .focus-title span .hp-increased {
    color: #15803d;
  }

  .focus-title span .hp-decreased {
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
    display: flex;
    align-items: stretch;
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-group {
    min-width: min(210px, 100%);
    display: grid;
    gap: 6px;
    align-content: start;
  }

  .action-group button {
    border-radius: 5px;
    padding: 8px 10px;
    border-color: var(--button-border);
    background: var(--button-bg);
    color: var(--button-text);
    box-shadow: 0 8px 18px rgba(12, 15, 19, 0.12);
    font-size: 11px;
    font-weight: 750;
    text-align: left;
  }

  @media (max-width: 980px) {
    .active-focus {
      width: min(94vw, 720px);
      grid-template-columns: 104px minmax(0, 1fr);
    }

    .focus-card :global(.card-tile) {
      width: 104px;
    }
  }
</style>
