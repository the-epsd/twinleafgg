<script lang="ts">
  import BenchZone from './BenchZone.svelte';
  import BoardSlot from './BoardSlot.svelte';
  import CardTile from './CardTile.svelte';
  import StadiumCard from './StadiumCard.svelte';
  import type { CardView, PlayerView, PokemonSlotView } from '../game/types';

  type ZoneName = 'discard' | 'lostZone' | 'stadium' | 'playZone';

  type Props = {
    topPlayer: PlayerView;
    bottomPlayer: PlayerView;
    topBenchSlots?: PokemonSlotView[];
    bottomBenchSlots?: PokemonSlotView[];
    topActiveSlot: PokemonSlotView;
    bottomActiveSlot: PokemonSlotView;
    currentStadium?: CardView;
    currentStadiumOwner?: PlayerView;
    canPlayToBenchArea: (player: PlayerView) => boolean;
    canPlaceSetupBench: (player: PlayerView) => boolean;
    playToBenchArea: (player: PlayerView) => void;
    placeSetupBench: () => void;
    allowBenchDrop: (event: DragEvent, player: PlayerView) => void;
    dropToBenchArea: (player: PlayerView, event: DragEvent) => void;
    isPlayableTarget: (slot: PokemonSlotView) => boolean;
    isBoardPromptSelectable: (slot: PokemonSlotView) => boolean;
    isBoardPromptSelected: (slot: PokemonSlotView) => boolean;
    clickSlot: (slot: PokemonSlotView) => void;
    allowDrop: (event: DragEvent, slot: PokemonSlotView) => void;
    dropToSlot: (slot: PokemonSlotView, event: DragEvent) => void;
    canPlaceSetupActive: (slot: PokemonSlotView) => boolean;
    placeSetupActive: () => void;
    showZone: (playerIndex: number, zone: ZoneName, title: string, faceDown?: boolean) => void;
    canPlayOnBoard?: boolean;
    clickBoardPlay: (event: MouseEvent) => void;
    allowBoardPlayDrop: (event: DragEvent) => void;
    dropToBoardPlay: (event: DragEvent) => void;
    boardTilt?: number;
    boardPerspective?: number;
    boardScaleY?: number;
    boardLift?: number;
  };

  let {
    topPlayer,
    bottomPlayer,
    topBenchSlots = [],
    bottomBenchSlots = [],
    topActiveSlot,
    bottomActiveSlot,
    currentStadium,
    currentStadiumOwner,
    canPlayToBenchArea,
    canPlaceSetupBench,
    playToBenchArea,
    placeSetupBench,
    allowBenchDrop,
    dropToBenchArea,
    isPlayableTarget,
    isBoardPromptSelectable,
    isBoardPromptSelected,
    clickSlot,
    allowDrop,
    dropToSlot,
    canPlaceSetupActive,
    placeSetupActive,
    showZone,
    canPlayOnBoard = false,
    clickBoardPlay,
    allowBoardPlayDrop,
    dropToBoardPlay,
    boardTilt = 8,
    boardPerspective = 1250,
    boardScaleY = 98,
    boardLift = 0,
  }: Props = $props();

  let topLostPileElement = $state<HTMLButtonElement>();
  let topDiscardPileElement = $state<HTMLButtonElement>();
  let bottomLostPileElement = $state<HTMLButtonElement>();
  let bottomDiscardPileElement = $state<HTMLButtonElement>();
  let projectedHoverPile = $state('');

  type ProjectedPileKey = 'top-lost' | 'top-discard' | 'bottom-lost' | 'bottom-discard';

  function projectedPiles(): Array<[ProjectedPileKey, HTMLButtonElement | undefined, () => void]> {
    return [
      ['top-lost', topLostPileElement, () => showZone(topPlayer.index, 'lostZone', `${topPlayer.name} lost zone`)],
      ['top-discard', topDiscardPileElement, () => showZone(topPlayer.index, 'discard', `${topPlayer.name} discard`)],
      ['bottom-lost', bottomLostPileElement, () => showZone(bottomPlayer.index, 'lostZone', `${bottomPlayer.name} lost zone`)],
      ['bottom-discard', bottomDiscardPileElement, () => showZone(bottomPlayer.index, 'discard', `${bottomPlayer.name} discard`)],
    ];
  }

  function containsPoint(element: HTMLElement | undefined, event: MouseEvent) {
    if (!element) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  function clickProjectedPile(event: MouseEvent) {
    const pile = projectedPiles().find(([, element]) => containsPoint(element, event));
    if (!pile) {
      return false;
    }
    event.preventDefault();
    event.stopPropagation();
    pile[2]();
    return true;
  }

  function updateProjectedPileHover(event: MouseEvent) {
    projectedHoverPile = projectedPiles().find(([, element]) => containsPoint(element, event))?.[0] ?? '';
  }

  function deckPileStyle(deckCount: number, direction: -1 | 1) {
    const layers = visibleDeckLayers(deckCount).length;
    const step = Math.max(0.8, Math.min(1.6, boardTilt * 0.16));
    return [
      `--deck-step-x: ${(direction * step).toFixed(2)}px`,
      `--deck-step-y: ${(-step).toFixed(2)}px`,
      `--deck-top-x: ${(direction * layers * step).toFixed(2)}px`,
      `--deck-top-y: ${(-layers * step).toFixed(2)}px`,
    ].join('; ');
  }

  function visibleDeckLayers(deckCount: number) {
    const count = deckCount <= 0 ? 0 : Math.min(8, Math.max(1, Math.ceil(deckCount / 8)));
    return Array.from({ length: count }, (_, index) => count - index);
  }

  let boardPerspectiveStyle = $derived([
    `--board-tilt: ${boardTilt}deg`,
    `--board-perspective: ${boardPerspective}px`,
    `--board-scale-y: ${boardScaleY / 100}`,
    `--board-lift: ${boardLift}px`,
  ].join('; '));

  function clickBoardSurface(event: MouseEvent) {
    if (clickProjectedPile(event)) {
      return;
    }
    if (!canPlayOnBoard) {
      return;
    }
    if (
      event.target instanceof Element &&
      event.target.closest('button, a, input, textarea, select, .board-slot, .card-tile, .bench-drop-surface, .stack-pile, .stadium-card')
    ) {
      return;
    }
    clickBoardPlay(event);
  }
</script>

<section
  class="playmat"
  class:can-play-on-board={canPlayOnBoard}
  class:has-projected-pile-hover={projectedHoverPile !== ''}
  style={boardPerspectiveStyle}
  role="presentation"
  onclick={clickBoardSurface}
  onmousemove={updateProjectedPileHover}
  onmouseleave={() => (projectedHoverPile = '')}
  ondragover={allowBoardPlayDrop}
  ondrop={dropToBoardPlay}
>
  <div
    class="game-board-plane"
    class:can-play-on-board={canPlayOnBoard}
    role="presentation"
    ondragover={allowBoardPlayDrop}
    ondrop={dropToBoardPlay}
  >
    <BenchZone
      player={topPlayer}
      slots={topBenchSlots}
      opponent
      {canPlayToBenchArea}
      {canPlaceSetupBench}
      {playToBenchArea}
      {placeSetupBench}
      {allowBenchDrop}
      {dropToBenchArea}
      {isPlayableTarget}
      {isBoardPromptSelectable}
      {isBoardPromptSelected}
      {clickSlot}
      {allowDrop}
      {dropToSlot}
    />

    <div class="center-stack">
      <div class="field-piles top-piles">
        <div class="left-piles">
          <button
            type="button"
            class="stack-pile lost-pile"
            class:projected-hover={projectedHoverPile === 'top-lost'}
            title={`${topPlayer.name} lost zone`}
            bind:this={topLostPileElement}
            onclick={() => showZone(topPlayer.index, 'lostZone', `${topPlayer.name} lost zone`)}
          >
            {#if topPlayer.lostZone.length}
              <CardTile card={topPlayer.lostZone[topPlayer.lostZone.length - 1]} compact />
            {/if}
            <span class="pile-count">{topPlayer.lostZone.length}</span>
          </button>
          <div class="prize-grid" title={`${topPlayer.name} prizes`} aria-label={`${topPlayer.name} prizes`}>
            {#each Array(6) as _, index}
              <span class:claimed={index >= topPlayer.prizesLeft} style={`--row: ${Math.floor(index / 2)}; --col: ${index % 2};`}></span>
            {/each}
          </div>
        </div>
        <div class="right-field">
          <div class="right-piles">
            <span class="stack-pile deck-pile" style={deckPileStyle(topPlayer.deckCount, -1)} title={`${topPlayer.name} deck`}>
              {#each visibleDeckLayers(topPlayer.deckCount) as layer, layerIndex}
                <span class="deck-card-layer" style={`--deck-layer: ${layerIndex};`}></span>
              {/each}
              <span class="deck-card-face"></span>
              <span class="pile-count">{topPlayer.deckCount}</span>
            </span>
            <button
              type="button"
              class="stack-pile discard-pile"
              class:projected-hover={projectedHoverPile === 'top-discard'}
              title={`${topPlayer.name} discard`}
              bind:this={topDiscardPileElement}
              onclick={() => showZone(topPlayer.index, 'discard', `${topPlayer.name} discard`)}
            >
              {#if topPlayer.discard.length}
                <CardTile card={topPlayer.discard[topPlayer.discard.length - 1]} compact />
              {/if}
              <span class="pile-count">{topPlayer.discard.length}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="field-piles bottom-piles">
        <div class="left-piles">
          <button
            type="button"
            class="stack-pile lost-pile"
            class:projected-hover={projectedHoverPile === 'bottom-lost'}
            title={`${bottomPlayer.name} lost zone`}
            bind:this={bottomLostPileElement}
            onclick={() => showZone(bottomPlayer.index, 'lostZone', `${bottomPlayer.name} lost zone`)}
          >
            {#if bottomPlayer.lostZone.length}
              <CardTile card={bottomPlayer.lostZone[bottomPlayer.lostZone.length - 1]} compact />
            {/if}
            <span class="pile-count">{bottomPlayer.lostZone.length}</span>
          </button>
          <div class="prize-grid" title={`${bottomPlayer.name} prizes`} aria-label={`${bottomPlayer.name} prizes`}>
            {#each Array(6) as _, index}
              <span class:claimed={index >= bottomPlayer.prizesLeft} style={`--row: ${Math.floor(index / 2)}; --col: ${index % 2};`}></span>
            {/each}
          </div>
        </div>
        <div class="right-field">
          <div class="right-piles">
            <span class="stack-pile deck-pile" style={deckPileStyle(bottomPlayer.deckCount, 1)} title={`${bottomPlayer.name} deck`}>
              {#each visibleDeckLayers(bottomPlayer.deckCount) as layer, layerIndex}
                <span class="deck-card-layer" style={`--deck-layer: ${layerIndex};`}></span>
              {/each}
              <span class="deck-card-face"></span>
              <span class="pile-count">{bottomPlayer.deckCount}</span>
            </span>
            <button
              type="button"
              class="stack-pile discard-pile"
              class:projected-hover={projectedHoverPile === 'bottom-discard'}
              title={`${bottomPlayer.name} discard`}
              bind:this={bottomDiscardPileElement}
              onclick={() => showZone(bottomPlayer.index, 'discard', `${bottomPlayer.name} discard`)}
            >
              {#if bottomPlayer.discard.length}
                <CardTile card={bottomPlayer.discard[bottomPlayer.discard.length - 1]} compact />
              {/if}
              <span class="pile-count">{bottomPlayer.discard.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="active-duel">
      <BoardSlot
        slot={topActiveSlot}
        active
        placement="top-active-slot"
        canDrop={isPlayableTarget(topPlayer.active) || canPlaceSetupActive(topPlayer.active)}
        promptSelectable={isBoardPromptSelectable(topPlayer.active)}
        promptSelected={isBoardPromptSelected(topPlayer.active)}
        onclick={() => (canPlaceSetupActive(topPlayer.active) ? placeSetupActive() : clickSlot(topPlayer.active))}
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
        onclick={() => (canPlaceSetupActive(bottomPlayer.active) ? placeSetupActive() : clickSlot(bottomPlayer.active))}
        ondragover={(event) => allowDrop(event, bottomPlayer.active)}
        ondrop={(event) => dropToSlot(bottomPlayer.active, event)}
      />

      {#if currentStadium && currentStadiumOwner?.index === bottomPlayer.index}
        <StadiumCard card={currentStadium} owner={bottomPlayer} placement="bottom" {showZone} />
      {/if}
    </div>

    <BenchZone
      player={bottomPlayer}
      slots={bottomBenchSlots}
      {canPlayToBenchArea}
      {canPlaceSetupBench}
      {playToBenchArea}
      {placeSetupBench}
      {allowBenchDrop}
      {dropToBenchArea}
      {isPlayableTarget}
      {isBoardPromptSelectable}
      {isBoardPromptSelected}
      {clickSlot}
      {allowDrop}
      {dropToSlot}
    />
  </div>

</section>
