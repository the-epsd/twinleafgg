<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { PokemonSlotView } from '../game/types';

  export let slot: PokemonSlotView;
  export let active = false;
  export let canDrop = false;
  export let promptSelectable = false;
  export let promptSelected = false;

  $: remainingHp = slot.hp ? Math.max(0, slot.hp - slot.damage) : 0;
</script>

<button
  type="button"
  class:active
  class:empty={slot.empty}
  class:can-drop={canDrop}
  class:prompt-selectable={promptSelectable}
  class:prompt-selected={promptSelected}
  class="board-slot"
  data-testid={`slot-${slot.ownerIndex}-${slot.slot}-${slot.index}`}
  title={slot.pokemon?.fullName ?? (slot.slot === 'active' ? 'Active' : `Bench ${slot.index + 1}`)}
  on:click
  on:dragover
  on:drop
>
  <div class="slot-label">{slot.slot === 'active' ? 'Active' : `B${slot.index + 1}`}</div>

  {#if slot.pokemon}
    <CardTile card={slot.pokemon} />
    <div class="slot-badges">
      {#if slot.hp}
        <span>{remainingHp}/{slot.hp}</span>
      {/if}
      {#if slot.damage}
        <span class="damage">{slot.damage}</span>
      {/if}
      {#if slot.energy.length}
        <span>{slot.energy.length} E</span>
      {/if}
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
