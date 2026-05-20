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
