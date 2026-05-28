<script lang="ts">
  import BoardSlot from './BoardSlot.svelte';
  import type { PlayerView, PokemonSlotView } from '../game/types';

  type Props = {
    player: PlayerView;
    slots?: PokemonSlotView[];
    opponent?: boolean;
    canPlayToBenchArea: (player: PlayerView) => boolean;
    canPlayOnBoard?: boolean;
    clickBoardPlay: (event: MouseEvent) => void;
    canPlaceSetupBench: (player: PlayerView) => boolean;
    playToBenchArea: (player: PlayerView) => void;
    placeSetupBench: () => void;
    allowBenchDrop: (event: DragEvent, player: PlayerView) => void;
    dropToBenchArea: (player: PlayerView, event: DragEvent) => void;
    isPlayableTarget: (slot: PokemonSlotView) => boolean;
    isBoardPromptSelectable: (slot: PokemonSlotView) => boolean;
    isBoardPromptSelected: (slot: PokemonSlotView) => boolean;
    boardSlotDelta: (slot: PokemonSlotView) => number;
    clickSlot: (slot: PokemonSlotView) => void;
    allowDrop: (event: DragEvent, slot: PokemonSlotView) => void;
    dropToSlot: (slot: PokemonSlotView, event: DragEvent) => void;
  };

  let {
    player,
    slots = [],
    opponent = false,
    canPlayToBenchArea,
    canPlayOnBoard = false,
    clickBoardPlay,
    canPlaceSetupBench,
    playToBenchArea,
    placeSetupBench,
    allowBenchDrop,
    dropToBenchArea,
    isPlayableTarget,
    isBoardPromptSelectable,
    isBoardPromptSelected,
    boardSlotDelta,
    clickSlot,
    allowDrop,
    dropToSlot,
  }: Props = $props();

  let canDropToBench = $derived(canPlayToBenchArea(player) || canPlaceSetupBench(player));

  function playToBench() {
    if (canPlaceSetupBench(player)) {
      placeSetupBench();
      return;
    }
    if (canPlayToBenchArea(player)) {
      playToBenchArea(player);
    }
  }
</script>

<div class="bench-zone" class:opponent class:empty={slots.length === 0}>
  <button
    type="button"
    class="bench-drop-surface"
    class:can-drop={canDropToBench}
    tabindex="-1"
    aria-hidden="true"
    aria-label={`Play a Basic Pokemon to ${player.name}'s bench`}
    title={`Play a Basic Pokemon to ${player.name}'s bench`}
    onclick={playToBench}
    ondragover={(event) => allowBenchDrop(event, player)}
    ondrop={(event) => dropToBenchArea(player, event)}
  ></button>
  <div class="bench-row" class:opponent>
    {#each slots as slot}
      <BoardSlot
        {slot}
        canDrop={isPlayableTarget(slot)}
        promptSelectable={isBoardPromptSelectable(slot)}
        promptSelected={isBoardPromptSelected(slot)}
        slotDelta={boardSlotDelta(slot)}
        onclick={() => clickSlot(slot)}
        ondragover={(event) => allowDrop(event, slot)}
        ondrop={(event) => dropToSlot(slot, event)}
      />
    {/each}
  </div>
</div>

<style>
  .bench-zone {
    position: relative;
    grid-area: bottom-bench;
    align-self: end;
    z-index: 1;
    transform-style: preserve-3d;
    display: grid;
    justify-content: center;
    align-content: center;
    width: min(100%, calc((var(--bench-card-w) * 6) + (var(--bench-gap) * 5) + (var(--board-card-w) * 0.3)));
    min-height: var(--bench-row-h);
    justify-self: center;
    padding: 0 calc(var(--board-card-w) * 0.15);
    border-radius: 7px;
    border: 1px solid transparent;
    background: transparent;
    box-shadow: none;
  }

  .bench-zone.opponent {
    grid-area: top-bench;
    align-self: end;
    align-content: center;
  }

  .bench-zone:not(.opponent) {
    align-content: center;
  }

  :global(.debug-zones) .bench-zone {
    border-color: rgba(16, 185, 129, 0.86);
    background: rgba(16, 185, 129, 0.08);
    box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.46);
  }

  .bench-zone.empty {
    min-height: var(--bench-row-h);
  }

  .bench-drop-surface {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: block;
    padding: 0;
    border-radius: 7px;
    border: 1px dashed transparent;
    background: transparent;
    transform: translateZ(12px);
    pointer-events: none;
  }

  :global(.debug-zones) .bench-drop-surface {
    border-color: rgba(5, 150, 105, 0.82);
    background: rgba(5, 150, 105, 0.08);
  }

  .bench-drop-surface.can-drop {
    border-color: transparent;
    background: var(--selection-bg);
    box-shadow: var(--glow-playable-shadow);
    pointer-events: auto;
    cursor: pointer;
  }

  .bench-row {
    position: relative;
    z-index: 2;
    transform: translateZ(16px);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--bench-gap);
    width: 100%;
    min-height: var(--bench-row-h);
    height: 100%;
    pointer-events: none;
  }

  .bench-row :global(.board-slot) {
    --slot-card-w: var(--bench-card-w);
    width: var(--bench-card-w);
    pointer-events: auto;
  }

  .bench-row.opponent :global(.card-tile) {
    transform: rotate(180deg);
  }

  .bench-row.opponent :global(.energy-badges) {
    inset: calc(var(--slot-card-w) * -0.095) 0 auto auto;
    justify-content: flex-end;
    transform: rotate(180deg);
  }

  .bench-row.opponent :global(.tool-card-preview) {
    inset: auto auto var(--tool-preview-top) 0;
    transform: rotate(180deg);
  }

  .bench-row.opponent :global(.pokemon-status) {
    inset: auto auto 0 0;
    align-items: start;
    justify-items: start;
  }

  .bench-row.opponent :global(.damage-counter-value) {
    transform: rotate(180deg);
  }
</style>
