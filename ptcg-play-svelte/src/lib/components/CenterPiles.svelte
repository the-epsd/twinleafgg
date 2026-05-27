<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { PlayerView } from '../game/types';

  type Props = {
    topPlayer: PlayerView;
    bottomPlayer: PlayerView;
    boardTilt?: number;
    projectedHoverPile?: string;
    topLostPileElement?: HTMLButtonElement;
    topDiscardPileElement?: HTMLButtonElement;
    bottomLostPileElement?: HTMLButtonElement;
    bottomDiscardPileElement?: HTMLButtonElement;
    showLostZone: (player: PlayerView) => void;
    showDiscard: (player: PlayerView) => void;
  };

  let {
    topPlayer,
    bottomPlayer,
    boardTilt = 8,
    projectedHoverPile = '',
    topLostPileElement = $bindable(),
    topDiscardPileElement = $bindable(),
    bottomLostPileElement = $bindable(),
    bottomDiscardPileElement = $bindable(),
    showLostZone,
    showDiscard,
  }: Props = $props();

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
</script>

<div class="center-stack">
  <div class="field-piles top-piles">
    <div class="left-piles">
      <button
        type="button"
        class="stack-pile lost-pile"
        class:projected-hover={projectedHoverPile === 'top-lost'}
        title={`${topPlayer.name} lost zone`}
        bind:this={topLostPileElement}
        onclick={() => showLostZone(topPlayer)}
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
          {#if topPlayer.deckCount > 0}
            <span class="deck-card-face"></span>
          {/if}
          <span class="pile-count">{topPlayer.deckCount}</span>
        </span>
        <button
          type="button"
          class="stack-pile discard-pile"
          class:projected-hover={projectedHoverPile === 'top-discard'}
          title={`${topPlayer.name} discard`}
          bind:this={topDiscardPileElement}
          onclick={() => showDiscard(topPlayer)}
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
        onclick={() => showLostZone(bottomPlayer)}
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
          {#if bottomPlayer.deckCount > 0}
            <span class="deck-card-face"></span>
          {/if}
          <span class="pile-count">{bottomPlayer.deckCount}</span>
        </span>
        <button
          type="button"
          class="stack-pile discard-pile"
          class:projected-hover={projectedHoverPile === 'bottom-discard'}
          title={`${bottomPlayer.name} discard`}
          bind:this={bottomDiscardPileElement}
          onclick={() => showDiscard(bottomPlayer)}
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

<style>
  .center-stack {
    z-index: 2;
    display: contents;
    color: var(--text-primary);
    font-size: 12px;
    opacity: 0.96;
    pointer-events: none;
  }

  :global(.debug-zones) .center-stack {
    color: var(--text-primary);
  }

  .field-piles {
    display: contents;
    pointer-events: none;
  }

  :global(.debug-zones) .field-piles {
    outline: 2px dashed rgba(168, 85, 247, 0.84);
    outline-offset: 3px;
    background: rgba(168, 85, 247, 0.06);
  }

  .top-piles {
    align-items: start;
  }

  .bottom-piles {
    align-items: end;
  }

  .left-piles,
  .right-piles {
    display: grid;
    gap: calc(var(--card-w) * 0.12);
    pointer-events: none;
  }

  :global(.debug-zones) .left-piles,
  :global(.debug-zones) .right-piles,
  :global(.debug-zones) .right-field {
    outline: 2px solid rgba(234, 88, 12, 0.78);
    outline-offset: 3px;
    background: rgba(234, 88, 12, 0.06);
  }

  .top-piles .left-piles {
    grid-area: top-right;
    align-self: start;
    justify-self: end;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  .top-piles .right-piles {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  .top-piles .right-field {
    grid-area: top-left;
    align-self: start;
    justify-self: start;
  }

  .bottom-piles .left-piles {
    grid-area: bottom-left;
    align-self: end;
    justify-self: start;
    justify-items: center;
  }

  .bottom-piles .right-field {
    grid-area: bottom-right;
    align-self: end;
    justify-self: end;
  }

  .right-field {
    display: grid;
    align-items: center;
    pointer-events: none;
  }

  .left-piles {
    justify-items: center;
  }

  .right-piles {
    justify-items: center;
  }

  .stack-pile {
    position: relative;
    width: var(--pile-w);
    aspect-ratio: 63 / 88;
    height: auto;
    display: grid;
    place-items: center;
    padding: 0;
    border-radius: 5px;
    color: var(--pile-text);
    font-weight: 800;
    background: var(--pile-bg);
    border: 1px solid var(--pile-border);
    box-shadow: 0 4px 10px rgba(23, 30, 38, 0.14);
    font-size: calc(var(--pile-w) * 0.25);
  }

  :global(.debug-zones) .stack-pile {
    outline: 2px solid rgba(220, 38, 38, 0.72);
    outline-offset: 3px;
  }

  .stack-pile.projected-hover {
    border-color: rgba(55, 150, 132, 0.85);
  }

  button.stack-pile {
    pointer-events: none;
  }

  .deck-pile {
    --deck-step-x: 1.35px;
    --deck-step-y: -1.35px;
    --deck-top-x: 0px;
    --deck-top-y: 0px;
    z-index: 1;
    isolation: isolate;
    color: #f7f8ff;
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    overflow: visible;
    transform-style: preserve-3d;
  }

  .deck-card-face,
  .deck-card-layer {
    position: absolute;
    display: block;
    pointer-events: none;
  }

  .deck-card-face,
  .deck-card-layer {
    inset: 0;
    border-radius: inherit;
    background:
      var(--cardback-shade),
      url("/assets/cardback.png") center / cover no-repeat;
  }

  .deck-card-face {
    z-index: 6;
    transform: translate(var(--deck-top-x), var(--deck-top-y));
    box-shadow:
      0 3px 8px rgba(23, 30, 38, 0.12),
      0 0 0 1px rgba(18, 21, 26, 0.2);
  }

  .deck-card-layer {
    z-index: var(--deck-layer);
    opacity: calc(0.5 + (var(--deck-layer) * 0.08));
    filter: brightness(0.86) saturate(0.9);
    transform: translate(
      calc(var(--deck-step-x) * var(--deck-layer)),
      calc(var(--deck-step-y) * var(--deck-layer))
    );
    box-shadow: none;
  }

  .top-piles .discard-pile :global(.card-tile),
  .top-piles .prize-grid {
    transform: rotate(180deg);
  }

  .top-piles .deck-card-face {
    transform: translate(var(--deck-top-x), var(--deck-top-y)) rotate(180deg);
  }

  .top-piles .deck-card-layer {
    transform: translate(
      calc(var(--deck-step-x) * var(--deck-layer)),
      calc(var(--deck-step-y) * var(--deck-layer))
    ) rotate(180deg);
  }

  .discard-pile {
    color: var(--discard-text);
    background: var(--discard-bg);
    overflow: visible;
  }

  .discard-pile :global(.card-tile) {
    width: 100%;
    height: 100%;
  }

  .pile-count {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 3;
    min-width: 24px;
    min-height: 24px;
    display: grid;
    place-items: center;
    transform: translate(-50%, -50%);
    padding: 2px 6px;
    border-radius: 999px;
    background: var(--pile-count-bg);
    border: 1px solid var(--pile-count-border);
    color: var(--pile-count-text);
    box-shadow: 0 3px 10px rgba(23, 30, 38, 0.16);
    font-size: calc(var(--pile-w) * 0.18);
    font-weight: 850;
    transition: transform 160ms ease;
  }

  .deck-pile .pile-count {
    right: auto;
    bottom: auto;
    z-index: 7;
    transform: translate(calc(-50% + var(--deck-top-x)), calc(-50% + var(--deck-top-y)));
  }

  .lost-pile {
    width: calc(var(--prize-card-w) * 1.397);
    aspect-ratio: 88 / 63;
    margin-block: calc(var(--card-w) * 0.08);
    color: var(--lost-text);
    background: var(--lost-bg);
    border-color: var(--lost-border);
    box-shadow: none;
    font-size: calc(var(--card-w) * 0.17);
    overflow: visible;
  }

  .lost-pile :global(.card-tile) {
    width: var(--prize-card-w);
    height: calc(var(--prize-card-w) * 1.397);
    transform: rotate(-90deg);
  }

  .prize-grid {
    position: relative;
    width: calc(var(--prize-card-w) * 1.98);
    height: calc((var(--prize-card-w) * 1.397) + (var(--prize-card-w) * 1.42));
    pointer-events: none;
  }

  :global(.debug-zones) .prize-grid {
    outline: 2px solid rgba(250, 204, 21, 0.9);
    outline-offset: 4px;
    background: rgba(250, 204, 21, 0.08);
  }

  .prize-grid span {
    position: absolute;
    left: calc(var(--col) * var(--prize-card-w) * 0.98);
    top: calc(var(--row) * var(--prize-card-w) * 0.71);
    width: var(--prize-card-w);
    aspect-ratio: 63 / 88;
    border-radius: 4px;
    border: 1px solid var(--prize-border);
    background:
      var(--cardback-shade),
      url("/assets/cardback.png") center / cover no-repeat;
    box-shadow: 0 3px 8px rgba(23, 30, 38, 0.16);
  }

  .prize-grid span.claimed {
    visibility: hidden;
  }
</style>
