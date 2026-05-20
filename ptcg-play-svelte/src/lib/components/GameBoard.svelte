<script lang="ts">
  import ActiveDuel from './ActiveDuel.svelte';
  import BenchZone from './BenchZone.svelte';
  import CenterPiles from './CenterPiles.svelte';
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

  function showLostZone(player: PlayerView) {
    showZone(player.index, 'lostZone', `${player.name} lost zone`);
  }

  function showDiscard(player: PlayerView) {
    showZone(player.index, 'discard', `${player.name} discard`);
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

    <CenterPiles
      {topPlayer}
      {bottomPlayer}
      {boardTilt}
      {projectedHoverPile}
      bind:topLostPileElement
      bind:topDiscardPileElement
      bind:bottomLostPileElement
      bind:bottomDiscardPileElement
      {showLostZone}
      {showDiscard}
    />

    <ActiveDuel
      {topPlayer}
      {bottomPlayer}
      {topActiveSlot}
      {bottomActiveSlot}
      {currentStadium}
      {currentStadiumOwner}
      {isPlayableTarget}
      {isBoardPromptSelectable}
      {isBoardPromptSelected}
      {clickSlot}
      {allowDrop}
      {dropToSlot}
      {canPlaceSetupActive}
      {placeSetupActive}
      {showZone}
    />

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

<style>
  .playmat {
    --active-w: calc(var(--card-w) * 1.48);
    --active-h: calc(var(--active-w) * 1.397);
    --bench-card-w: calc(var(--card-w) * 1.24);
    --bench-row-h: calc(var(--bench-card-w) * 1.42);
    --pile-w: calc(var(--card-w) * 1.28);
    --prize-card-w: calc(var(--card-w) * 0.96);
    --bench-gap: calc(var(--card-w) * 0.18);
    position: absolute;
    inset: var(--board-top-inset) var(--board-right-rail) var(--board-bottom-inset) 0;
    min-width: 0;
    perspective: var(--board-perspective, 1250px);
    perspective-origin: 50% 68%;
    transform-style: preserve-3d;
  }

  .playmat.has-projected-pile-hover {
    cursor: pointer;
  }

  :global(.debug-zones) .playmat {
    outline: 2px solid rgba(37, 99, 235, 0.9);
    outline-offset: -2px;
    background: rgba(37, 99, 235, 0.05);
  }

  .game-board-plane {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows:
      minmax(calc(var(--bench-row-h) + (var(--card-w) * 0.22)), 0.85fr)
      minmax(calc((var(--active-h) * 2) + (var(--card-w) * 0.24)), 1.45fr)
      minmax(calc(var(--bench-row-h) + (var(--card-w) * 0.22)), 0.85fr);
    gap: calc(var(--card-w) * 0.12);
    align-items: center;
    padding: calc(var(--card-w) * 0.16) var(--board-edge-pad-x);
    background: rgba(226, 228, 232, 0.56);
    overflow: visible;
    transform: rotateX(var(--board-tilt, 8deg)) scaleY(var(--board-scale-y, 0.94)) translateY(var(--board-lift, 0px));
    transform-origin: 50% 58%;
    transform-style: preserve-3d;
    will-change: transform;
  }

  :global(.debug-zones) .game-board-plane {
    outline: 2px solid rgba(14, 165, 233, 0.9);
    outline-offset: -4px;
    background:
      linear-gradient(rgba(14, 165, 233, 0.08), rgba(14, 165, 233, 0.08)),
      rgba(226, 228, 232, 0.56);
  }

  .game-board-plane::before {
    content: "";
    position: absolute;
    inset: var(--board-outline-pad-y) var(--board-edge-pad-x);
    z-index: 0;
    border: 2px solid rgba(44, 54, 64, 0.28);
    border-radius: 18px;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.34),
      0 10px 26px rgba(23, 30, 38, 0.08);
    pointer-events: none;
  }

  .game-board-plane::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    width: clamp(180px, min(21vw, 32vh), 300px);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    background: url("/assets/twinleaf-board-center.png") center / contain no-repeat;
    opacity: 0.34;
    pointer-events: none;
  }

  .game-board-plane.can-play-on-board {
    cursor: pointer;
  }

  .game-board-plane.can-play-on-board::before {
    border-color: rgba(41, 161, 139, 0.72);
    background: rgba(41, 161, 139, 0.05);
    box-shadow:
      inset 0 0 0 2px rgba(41, 161, 139, 0.14),
      0 10px 26px rgba(23, 30, 38, 0.08);
  }

  @media (max-width: 980px) {
    .game-board-plane {
      padding-inline: 12px;
    }
  }
</style>
