<script lang="ts">
  import CardTile from './CardTile.svelte';
  import { energyIconSrc, pokemonTypeIconSrc, pokemonTypeLabelFor } from '../game/energyIcons';
  import type { PokemonSlotView } from '../game/types';

  type Props = {
    slot: PokemonSlotView;
    active?: boolean;
    canDrop?: boolean;
    promptSelectable?: boolean;
    promptSelected?: boolean;
    placement?: '' | 'top-active-slot' | 'bottom-active-slot';
    onclick?: (event: MouseEvent) => void;
    ondragover?: (event: DragEvent) => void;
    ondrop?: (event: DragEvent) => void;
  };

  let {
    slot,
    active = false,
    canDrop = false,
    promptSelectable = false,
    promptSelected = false,
    placement = '',
    onclick,
    ondragover,
    ondrop,
  }: Props = $props();

  let stackedEnergy = $derived(slot.energy.length > 4);
  let displayHp = $derived(slot.hp || pokemonHp(slot.pokemon));
  let pokemonTypeIcon = $derived(pokemonTypeIconSrc(slot.pokemon?.cardType));
  let pokemonTypeLabel = $derived(pokemonTypeLabelFor(slot.pokemon?.cardType));

  function energyStackStyle(index: number) {
    if (!stackedEnergy) {
      return '';
    }
    const progress = slot.energy.length <= 1 ? 0 : index / (slot.energy.length - 1);
    const offsetPercent = progress * 75;
    const offsetPixels = progress * 1.5;
    return `--energy-offset: calc(${offsetPercent}% + ${offsetPixels}px); --energy-z: ${index + 1};`;
  }

  function hasPendingAttach(card: { pendingAttach?: unknown }) {
    return card.pendingAttach === true;
  }

  function pokemonHp(card: { hp?: unknown } | undefined) {
    return typeof card?.hp === 'number' && Number.isFinite(card.hp) ? card.hp : 0;
  }
</script>

<button
  type="button"
  class:active
  class:empty={slot.empty}
  class:can-drop={canDrop}
  class:prompt-selectable={promptSelectable}
  class:prompt-selected={promptSelected}
  class={`board-slot ${placement}`}
  data-testid={`slot-${slot.ownerIndex}-${slot.slot}-${slot.index}`}
  title={slot.pokemon?.fullName ?? (slot.slot === 'active' ? 'Active' : `Bench ${slot.index + 1}`)}
  {onclick}
  {ondragover}
  {ondrop}
>
  <div class="slot-label">{slot.slot === 'active' ? 'Active' : `B${slot.index + 1}`}</div>

  {#if slot.pokemon}
    <CardTile card={slot.pokemon} />
    {#if displayHp || pokemonTypeIcon || slot.damage}
      <div class="pokemon-status">
        {#if displayHp || pokemonTypeIcon}
          <span class="pokemon-hp-bubble" title={`${displayHp ? `${displayHp} HP` : 'Pokemon'}${pokemonTypeIcon ? ` · ${pokemonTypeLabel}` : ''}`}>
            {#if displayHp}
              <span>{displayHp}</span>
            {/if}
            {#if pokemonTypeIcon}
              <img src={pokemonTypeIcon} alt={pokemonTypeLabel} />
            {/if}
          </span>
        {/if}
        {#if slot.damage}
          <span class="damage-counter" title={`${slot.damage} damage`}>{slot.damage}</span>
        {/if}
      </div>
    {/if}
    {#if slot.energy.length}
      <div class="energy-badges" class:stacked-energy={stackedEnergy} title={`${slot.energy.length} attached energy`}>
        {#each slot.energy as energy, energyIndex}
          <img
            src={energyIconSrc(energy)}
            alt={energy.name || 'Energy'}
            class:pending-energy={hasPendingAttach(energy)}
            style={energyStackStyle(energyIndex)}
          />
        {/each}
      </div>
    {/if}
    <div class="slot-badges" title={displayHp ? `${Math.max(0, displayHp - slot.damage)}/${displayHp} HP remaining` : undefined}>
      {#if slot.tools.length}
        <span>{slot.tools.length} T</span>
      {/if}
      {#if slot.specialConditions.length}
        <span>{slot.specialConditions.length} S</span>
      {/if}
    </div>
  {:else}
    <div class="empty-zone"></div>
  {/if}
</button>
