<script lang="ts">
  import BoardSlot from './BoardSlot.svelte';
  import StadiumCard from './StadiumCard.svelte';
  import type { CardView, PlayerView, PokemonSlotView } from '../game/types';

  type ZoneName = 'discard' | 'lostZone' | 'stadium' | 'playZone';

  type Props = {
    topPlayer: PlayerView;
    bottomPlayer: PlayerView;
    topActiveSlot: PokemonSlotView;
    bottomActiveSlot: PokemonSlotView;
    currentStadium?: CardView;
    currentStadiumOwner?: PlayerView;
    isPlayableTarget: (slot: PokemonSlotView) => boolean;
    isBoardPromptSelectable: (slot: PokemonSlotView) => boolean;
    isBoardPromptSelected: (slot: PokemonSlotView) => boolean;
    boardSlotDelta: (slot: PokemonSlotView) => number;
    clickSlot: (slot: PokemonSlotView) => void;
    allowDrop: (event: DragEvent, slot: PokemonSlotView) => void;
    dropToSlot: (slot: PokemonSlotView, event: DragEvent) => void;
    canPlaceSetupActive: (slot: PokemonSlotView) => boolean;
    placeSetupActive: () => void;
    showZone: (playerIndex: number, zone: ZoneName, title: string, faceDown?: boolean) => void;
  };

  let {
    topPlayer,
    bottomPlayer,
    topActiveSlot,
    bottomActiveSlot,
    currentStadium,
    currentStadiumOwner,
    isPlayableTarget,
    isBoardPromptSelectable,
    isBoardPromptSelected,
    boardSlotDelta,
    clickSlot,
    allowDrop,
    dropToSlot,
    canPlaceSetupActive,
    placeSetupActive,
    showZone,
  }: Props = $props();

  function clickActive(slot: PokemonSlotView) {
    if (canPlaceSetupActive(slot)) {
      placeSetupActive();
      return;
    }
    clickSlot(slot);
  }
</script>

<div class="active-duel">
  <BoardSlot
    slot={topActiveSlot}
    active
    placement="top-active-slot"
    canDrop={isPlayableTarget(topPlayer.active) || canPlaceSetupActive(topPlayer.active)}
    promptSelectable={isBoardPromptSelectable(topPlayer.active)}
    promptSelected={isBoardPromptSelected(topPlayer.active)}
    slotDelta={boardSlotDelta(topPlayer.active)}
    onclick={() => clickActive(topPlayer.active)}
    ondragover={(event) => allowDrop(event, topPlayer.active)}
    ondrop={(event) => dropToSlot(topPlayer.active, event)}
  />

  {#if currentStadium && currentStadiumOwner?.index === topPlayer.index}
    <StadiumCard card={currentStadium} owner={topPlayer} placement="top" {showZone} />
  {/if}

  <BoardSlot
    slot={bottomActiveSlot}
    active
    placement="bottom-active-slot"
    canDrop={isPlayableTarget(bottomPlayer.active) || canPlaceSetupActive(bottomPlayer.active)}
    promptSelectable={isBoardPromptSelectable(bottomPlayer.active)}
    promptSelected={isBoardPromptSelected(bottomPlayer.active)}
    slotDelta={boardSlotDelta(bottomPlayer.active)}
    onclick={() => clickActive(bottomPlayer.active)}
    ondragover={(event) => allowDrop(event, bottomPlayer.active)}
    ondrop={(event) => dropToSlot(bottomPlayer.active, event)}
  />

  {#if currentStadium && currentStadiumOwner?.index === bottomPlayer.index}
    <StadiumCard card={currentStadium} owner={bottomPlayer} placement="bottom" {showZone} />
  {/if}
</div>

<style>
  .active-duel {
    position: relative;
    grid-area: battle;
    align-self: stretch;
    justify-self: stretch;
    z-index: 3;
    transform-style: preserve-3d;
    pointer-events: none;
    display: grid;
    grid-template-rows: var(--active-h) minmax(calc(var(--card-w) * 0.24), 1fr) var(--active-h);
    grid-template-columns: minmax(0, 1fr) var(--active-w) minmax(0, 1fr);
    align-items: center;
    justify-items: center;
    row-gap: 0;
    column-gap: 0;
    min-height: 0;
  }

  :global(.debug-zones) .active-duel {
    outline: 2px solid rgba(245, 158, 11, 0.86);
    outline-offset: 4px;
    background: rgba(245, 158, 11, 0.06);
  }

  .active-duel > :global(.board-slot.active:not(.empty):not(.can-drop):not(.prompt-selectable):not(.prompt-selected)) {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7), 0 12px 26px rgba(23, 30, 38, 0.22);
  }

  .active-duel :global(.top-active-slot) {
    grid-row: 1;
    grid-column: 2;
  }

  .active-duel :global(.bottom-active-slot) {
    grid-row: 3;
    grid-column: 2;
  }

  .active-duel :global(.top-active-slot),
  .active-duel :global(.bottom-active-slot) {
    position: relative;
    z-index: 4;
    transform: translateZ(32px);
    pointer-events: auto;
  }

  .active-duel :global(.top-active-slot .card-tile) {
    transform: rotate(180deg);
  }

  .active-duel :global(.top-active-slot .energy-badges) {
    inset: calc(var(--slot-card-w) * -0.095) 0 auto auto;
    justify-content: flex-end;
    transform: rotate(180deg);
  }

  .active-duel :global(.top-active-slot .tool-card-preview) {
    inset: auto auto var(--tool-preview-top) 0;
    transform: rotate(180deg);
  }

  .active-duel :global(.top-active-slot .pokemon-status) {
    inset: auto auto 0 0;
    align-items: start;
    justify-items: start;
  }

  .active-duel :global(.top-active-slot .damage-counter-value) {
    transform: rotate(180deg);
  }

  @media (max-width: 980px) {
    .active-duel {
      grid-template-rows: var(--active-w) minmax(58px, auto) var(--active-w);
    }
  }
</style>
