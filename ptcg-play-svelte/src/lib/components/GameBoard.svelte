<script lang="ts">
  import BoardSlot from './BoardSlot.svelte';
  import CardTile from './CardTile.svelte';
  import type { CardView, PlayerView, PokemonSlotView } from '../game/types';

  export let topPlayer: PlayerView;
  export let bottomPlayer: PlayerView;
  export let topBenchSlots: PokemonSlotView[] = [];
  export let bottomBenchSlots: PokemonSlotView[] = [];
  export let topActiveSlot: PokemonSlotView;
  export let bottomActiveSlot: PokemonSlotView;
  export let currentStadium: CardView | undefined;
  export let currentStadiumOwner: PlayerView | undefined;
  export let canPlayToBenchArea: (player: PlayerView) => boolean;
  export let canPlaceSetupBench: (player: PlayerView) => boolean;
  export let playToBenchArea: (player: PlayerView) => void;
  export let placeSetupBench: () => void;
  export let allowBenchDrop: (event: DragEvent, player: PlayerView) => void;
  export let dropToBenchArea: (player: PlayerView, event: DragEvent) => void;
  export let isPlayableTarget: (slot: PokemonSlotView) => boolean;
  export let isBoardPromptSelectable: (slot: PokemonSlotView) => boolean;
  export let isBoardPromptSelected: (slot: PokemonSlotView) => boolean;
  export let clickSlot: (slot: PokemonSlotView) => void;
  export let allowDrop: (event: DragEvent, slot: PokemonSlotView) => void;
  export let dropToSlot: (slot: PokemonSlotView, event: DragEvent) => void;
  export let canPlaceSetupActive: (slot: PokemonSlotView) => boolean;
  export let placeSetupActive: () => void;
  export let showZone: (
    playerIndex: number,
    zone: 'discard' | 'lostZone' | 'stadium' | 'playZone',
    title: string,
    faceDown?: boolean,
  ) => void;
  export let canPlayOnBoard = false;
  export let allowBoardPlayDrop: (event: DragEvent) => void;
  export let dropToBoardPlay: (event: DragEvent) => void;
  export let boardTilt = 8;
  export let boardPerspective = 1250;
  export let boardScaleY = 98;
  export let boardLift = 0;

  $: boardPerspectiveStyle = [
    `--board-tilt: ${boardTilt}deg`,
    `--board-perspective: ${boardPerspective}px`,
    `--board-scale-y: ${boardScaleY / 100}`,
    `--board-lift: ${boardLift}px`,
  ].join('; ');
</script>

<section
  class="playmat"
  class:can-play-on-board={canPlayOnBoard}
  style={boardPerspectiveStyle}
  role="presentation"
  on:dragover={allowBoardPlayDrop}
  on:drop={dropToBoardPlay}
>
  <div
    class="game-board-plane"
    class:can-play-on-board={canPlayOnBoard}
    role="presentation"
    on:dragover={allowBoardPlayDrop}
    on:drop={dropToBoardPlay}
  >
    <div class="bench-zone opponent" class:empty={topBenchSlots.length === 0}>
      <button
        type="button"
        class="bench-drop-surface"
        class:can-drop={canPlayToBenchArea(topPlayer) || canPlaceSetupBench(topPlayer)}
        disabled={!canPlayToBenchArea(topPlayer) && !canPlaceSetupBench(topPlayer)}
        aria-label={`Play a Pokemon to ${topPlayer.name}'s bench`}
        title={`Play a Pokemon to ${topPlayer.name}'s bench`}
        on:click={() => (canPlaceSetupBench(topPlayer) ? placeSetupBench() : playToBenchArea(topPlayer))}
        on:dragover={(event) => allowBenchDrop(event, topPlayer)}
        on:drop={(event) => dropToBenchArea(topPlayer, event)}
      ></button>
      <div class="bench-row opponent">
        {#each topBenchSlots as slot}
          <BoardSlot
            {slot}
            canDrop={isPlayableTarget(slot)}
            promptSelectable={isBoardPromptSelectable(slot)}
            promptSelected={isBoardPromptSelected(slot)}
            on:click={() => clickSlot(slot)}
            on:dragover={(event) => allowDrop(event, slot)}
            on:drop={(event) => dropToSlot(slot, event)}
          />
        {/each}
      </div>
    </div>

    <div class="center-stack">
      <div class="field-piles top-piles">
        <div class="left-piles">
          <button
            type="button"
            class="stack-pile lost-pile"
            title={`${topPlayer.name} lost zone`}
            on:click={() => showZone(topPlayer.index, 'lostZone', `${topPlayer.name} lost zone`)}
          >
            {topPlayer.lostZone.length} L
          </button>
          <div class="prize-grid" title={`${topPlayer.name} prizes`} aria-label={`${topPlayer.name} prizes`}>
            {#each Array(6) as _, index}
              <span class:claimed={index >= topPlayer.prizesLeft} style={`--row: ${Math.floor(index / 2)}; --col: ${index % 2};`}></span>
            {/each}
          </div>
        </div>
        <div class="right-field">
          <div class="right-piles">
            <span class="stack-pile deck-pile" title={`${topPlayer.name} deck`}>{topPlayer.deckCount}</span>
            <button
              type="button"
              class="stack-pile discard-pile"
              title={`${topPlayer.name} discard`}
              on:click={() => showZone(topPlayer.index, 'discard', `${topPlayer.name} discard`)}
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
            title={`${bottomPlayer.name} lost zone`}
            on:click={() => showZone(bottomPlayer.index, 'lostZone', `${bottomPlayer.name} lost zone`)}
          >
            {bottomPlayer.lostZone.length} L
          </button>
          <div class="prize-grid" title={`${bottomPlayer.name} prizes`} aria-label={`${bottomPlayer.name} prizes`}>
            {#each Array(6) as _, index}
              <span class:claimed={index >= bottomPlayer.prizesLeft} style={`--row: ${Math.floor(index / 2)}; --col: ${index % 2};`}></span>
            {/each}
          </div>
        </div>
        <div class="right-field">
          <div class="right-piles">
            <span class="stack-pile deck-pile" title={`${bottomPlayer.name} deck`}>{bottomPlayer.deckCount}</span>
            <button
              type="button"
              class="stack-pile discard-pile"
              title={`${bottomPlayer.name} discard`}
              on:click={() => showZone(bottomPlayer.index, 'discard', `${bottomPlayer.name} discard`)}
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
        on:click={() => (canPlaceSetupActive(topPlayer.active) ? placeSetupActive() : clickSlot(topPlayer.active))}
        on:dragover={(event) => allowDrop(event, topPlayer.active)}
        on:drop={(event) => dropToSlot(topPlayer.active, event)}
      />

      {#if currentStadium && currentStadiumOwner?.index === topPlayer.index}
        <button
          type="button"
          class="stadium-card top-stadium-card"
          title={currentStadium.fullName}
          on:click={() => showZone(topPlayer.index, 'stadium', `${topPlayer.name} stadium`)}
        >
          <CardTile card={currentStadium} compact />
        </button>
      {/if}

      <BoardSlot
        slot={bottomActiveSlot}
        active
        placement="bottom-active-slot"
        canDrop={isPlayableTarget(bottomPlayer.active) || canPlaceSetupActive(bottomPlayer.active)}
        promptSelectable={isBoardPromptSelectable(bottomPlayer.active)}
        promptSelected={isBoardPromptSelected(bottomPlayer.active)}
        on:click={() => (canPlaceSetupActive(bottomPlayer.active) ? placeSetupActive() : clickSlot(bottomPlayer.active))}
        on:dragover={(event) => allowDrop(event, bottomPlayer.active)}
        on:drop={(event) => dropToSlot(bottomPlayer.active, event)}
      />

      {#if currentStadium && currentStadiumOwner?.index === bottomPlayer.index}
        <button
          type="button"
          class="stadium-card bottom-stadium-card"
          title={currentStadium.fullName}
          on:click={() => showZone(bottomPlayer.index, 'stadium', `${bottomPlayer.name} stadium`)}
        >
          <CardTile card={currentStadium} compact />
        </button>
      {/if}
    </div>

    <div class="bench-zone" class:empty={bottomBenchSlots.length === 0}>
      <button
        type="button"
        class="bench-drop-surface"
        class:can-drop={canPlayToBenchArea(bottomPlayer) || canPlaceSetupBench(bottomPlayer)}
        disabled={!canPlayToBenchArea(bottomPlayer) && !canPlaceSetupBench(bottomPlayer)}
        aria-label={`Play a Pokemon to ${bottomPlayer.name}'s bench`}
        title={`Play a Pokemon to ${bottomPlayer.name}'s bench`}
        on:click={() => (canPlaceSetupBench(bottomPlayer) ? placeSetupBench() : playToBenchArea(bottomPlayer))}
        on:dragover={(event) => allowBenchDrop(event, bottomPlayer)}
        on:drop={(event) => dropToBenchArea(bottomPlayer, event)}
      ></button>
      <div class="bench-row">
        {#each bottomBenchSlots as slot}
          <BoardSlot
            {slot}
            canDrop={isPlayableTarget(slot)}
            promptSelectable={isBoardPromptSelectable(slot)}
            promptSelected={isBoardPromptSelected(slot)}
            on:click={() => clickSlot(slot)}
            on:dragover={(event) => allowDrop(event, slot)}
            on:drop={(event) => dropToSlot(slot, event)}
          />
        {/each}
      </div>
    </div>
  </div>

</section>
