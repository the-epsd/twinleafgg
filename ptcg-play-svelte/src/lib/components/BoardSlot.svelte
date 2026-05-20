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

<style>
  .board-slot {
    position: relative;
    width: var(--card-w);
    min-width: 0;
    aspect-ratio: 63 / 88;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    box-shadow: none;
    display: block;
  }

  :global(.debug-zones) .board-slot {
    outline: 2px solid rgba(34, 197, 94, 0.78);
    outline-offset: 4px;
    background: rgba(34, 197, 94, 0.06);
  }

  .board-slot.active {
    width: var(--active-w);
  }

  .board-slot.empty {
    border: 1px dashed rgba(30, 36, 43, 0.13);
    background: rgba(255, 255, 255, 0.08);
  }

  .board-slot.can-drop,
  .board-slot.prompt-selectable {
    outline: 2px solid rgba(41, 161, 139, 0.82);
    outline-offset: 6px;
    background: rgba(41, 161, 139, 0.12);
  }

  .board-slot.prompt-selected {
    outline-color: #f2b844;
  }

  .board-slot > :global(.card-tile) {
    width: 100%;
    height: 100%;
  }

  .slot-label {
    position: absolute;
    top: -10px;
    left: 50%;
    z-index: 3;
    transform: translateX(-50%);
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    color: #59616b;
    font-size: 10px;
    font-weight: 800;
    opacity: 0;
    transition: opacity 120ms ease;
  }

  .board-slot:hover .slot-label,
  .board-slot.can-drop .slot-label,
  .board-slot.prompt-selectable .slot-label {
    opacity: 1;
  }

  .empty-zone {
    width: 100%;
    height: 100%;
  }

  .slot-badges {
    position: absolute;
    inset: auto -9px -9px auto;
    z-index: 4;
    display: flex;
    gap: 3px;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 120%;
    pointer-events: none;
  }

  .slot-badges span {
    display: inline-grid;
    place-items: center;
    min-width: 19px;
    min-height: 19px;
    padding: 1px 5px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.84);
    box-shadow: 0 2px 10px rgba(23, 30, 38, 0.12);
    font-size: 9px;
    font-weight: 800;
  }

  .pokemon-status {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 6;
    display: grid;
    justify-items: end;
    gap: clamp(2px, calc(var(--card-w) * 0.025), 5px);
    max-width: 100%;
    pointer-events: none;
  }

  .pokemon-hp-bubble {
    display: inline-flex;
    align-items: center;
    gap: clamp(2px, calc(var(--card-w) * 0.03), 5px);
    min-height: clamp(18px, calc(var(--card-w) * 0.16), 26px);
    padding: clamp(1px, calc(var(--card-w) * 0.018), 3px) clamp(3px, calc(var(--card-w) * 0.04), 6px) clamp(1px, calc(var(--card-w) * 0.018), 3px) clamp(6px, calc(var(--card-w) * 0.055), 10px);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.94);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(241, 244, 247, 0.96));
    box-shadow:
      0 5px 13px rgba(21, 28, 36, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    color: #111820;
    font-size: clamp(11px, calc(var(--card-w) * 0.105), 16px);
    font-weight: 950;
    line-height: 1;
    white-space: nowrap;
    letter-spacing: 0;
  }

  .pokemon-hp-bubble img {
    width: clamp(13px, calc(var(--card-w) * 0.12), 19px);
    height: clamp(13px, calc(var(--card-w) * 0.12), 19px);
    object-fit: contain;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.28));
  }

  .damage-counter {
    display: inline-grid;
    place-items: center;
    width: clamp(27px, calc(var(--card-w) * 0.27), 40px);
    height: clamp(27px, calc(var(--card-w) * 0.27), 40px);
    padding: 0;
    border-radius: 999px;
    border: 1px solid rgba(128, 76, 18, 0.46);
    background:
      radial-gradient(circle at 34% 24%, rgba(255, 232, 121, 0.9), transparent 34%),
      linear-gradient(180deg, #ffb03d 0%, #f39023 54%, #c97018 100%);
    box-shadow:
      0 3px 8px rgba(95, 48, 13, 0.28),
      inset 0 2px 2px rgba(255, 236, 155, 0.7),
      inset 0 -2px 3px rgba(128, 60, 10, 0.34);
    color: #fff8df;
    font-size: clamp(12px, calc(var(--card-w) * 0.14), 18px);
    font-weight: 950;
    line-height: 1;
    -webkit-text-stroke: clamp(1px, calc(var(--card-w) * 0.012), 1.5px) #1f1f1f;
    paint-order: stroke fill;
    text-shadow: none;
  }

  .energy-badges {
    --energy-gap: 2px;
    --energy-icon-size: calc((var(--card-w) - (var(--energy-gap) * 3)) / 4);
    position: absolute;
    left: 0;
    bottom: -10px;
    z-index: 5;
    width: 100%;
    min-height: var(--energy-icon-size);
    display: flex;
    align-items: center;
    gap: var(--energy-gap);
    pointer-events: none;
  }

  .board-slot.active .energy-badges {
    --energy-icon-size: calc((var(--active-w) - (var(--energy-gap) * 3)) / 4);
  }

  .energy-badges img {
    flex: 0 0 var(--energy-icon-size);
    width: var(--energy-icon-size);
    height: var(--energy-icon-size);
    border-radius: 999px;
    object-fit: contain;
    filter: drop-shadow(0 3px 4px rgba(23, 30, 38, 0.38));
  }

  .energy-badges img.pending-energy {
    opacity: 0.5;
  }

  .energy-badges.stacked-energy {
    display: block;
  }

  .energy-badges.stacked-energy img {
    position: absolute;
    left: var(--energy-offset);
    bottom: 0;
    z-index: var(--energy-z);
  }
</style>
