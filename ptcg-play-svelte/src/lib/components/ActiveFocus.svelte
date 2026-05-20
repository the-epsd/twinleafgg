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
            · {Math.max(0, slot.hp - slot.damage)}/{slot.hp} HP
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
