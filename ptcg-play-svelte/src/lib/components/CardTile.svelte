<script lang="ts">
  import type { CardView } from '../game/types';

  type Props = {
    card?: CardView;
    compact?: boolean;
    selected?: boolean;
    draggable?: boolean;
    disabled?: boolean;
    interactive?: boolean;
    faceDown?: boolean;
    playable?: boolean;
    damage?: number;
    testId?: string;
    onclick?: (event: MouseEvent) => void;
    ondragstart?: (event: DragEvent) => void;
    ondragend?: (event: DragEvent) => void;
  };

  let {
    card,
    compact = false,
    selected = false,
    draggable = false,
    disabled = false,
    interactive = false,
    faceDown = false,
    playable = false,
    damage = 0,
    testId = '',
    onclick,
    ondragstart,
    ondragend,
  }: Props = $props();

  let failedImageUrl = $state('');

  let imageUrl = $derived(faceDown ? '/assets/cardback.png' : card?.imageUrl);
  let lastImageUrl = $state<string | undefined>();
  let showImage = $derived(!!imageUrl && failedImageUrl !== imageUrl);
  let label = $derived(faceDown ? 'Card' : (card?.name ?? 'Empty'));
  let typeClass = $derived(faceDown
    ? 'back'
    : card?.energyType !== undefined || card?.name?.includes('Energy')
      ? 'energy'
      : card?.trainerType !== undefined
        ? 'trainer'
        : card
          ? 'pokemon'
          : 'empty');

  $effect(() => {
    if (imageUrl !== lastImageUrl) {
      failedImageUrl = '';
      lastImageUrl = imageUrl;
    }
  });

  function preventSelection(event: Event) {
    event.preventDefault();
  }
</script>

{#if interactive}
  <button
    type="button"
    class:selected
    class:compact
    class:playable
    class={`card-tile ${typeClass}`}
    draggable={draggable && !disabled}
    {disabled}
    data-testid={testId || undefined}
    title={card?.fullName ?? label}
    {onclick}
    {ondragstart}
    {ondragend}
    onselectstart={preventSelection}
  >
    {#if showImage}
      <img src={imageUrl} alt="" loading="lazy" decoding="async" draggable="false" onerror={() => (failedImageUrl = imageUrl ?? '')} />
    {:else}
      <span class="fallback-name">{label}</span>
      {#if card?.set}
        <span class="fallback-set">{card.set} {card.setNumber}</span>
      {/if}
    {/if}
    {#if damage > 0}
      <span class="damage-counter" class:triple-digit={damage >= 100} title={`${damage} damage`}>
        <span class="damage-counter-value">{damage}</span>
      </span>
    {/if}
  </button>
{:else}
  <div
    class:selected
    class:compact
    class:playable
    class={`card-tile ${typeClass}`}
    data-testid={testId || undefined}
    title={card?.fullName ?? label}
  >
    {#if showImage}
      <img src={imageUrl} alt="" loading="lazy" decoding="async" draggable="false" onerror={() => (failedImageUrl = imageUrl ?? '')} />
    {:else}
      <span class="fallback-name">{label}</span>
      {#if card?.set}
        <span class="fallback-set">{card.set} {card.setNumber}</span>
      {/if}
    {/if}
    {#if damage > 0}
      <span class="damage-counter" class:triple-digit={damage >= 100} title={`${damage} damage`}>
        <span class="damage-counter-value">{damage}</span>
      </span>
    {/if}
  </div>
{/if}

<style>
  .card-tile {
    position: relative;
    z-index: 0;
    width: var(--card-w, clamp(58px, 5.3vw, 88px));
    aspect-ratio: 63 / 88;
    display: grid;
    place-items: center;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 5px;
    background: #f7f8fa;
    box-shadow: 0 3px 8px rgba(23, 30, 38, 0.28);
    transition: transform 120ms ease, box-shadow 120ms ease, outline-color 120ms ease, filter 120ms ease;
  }

  button.card-tile:hover:not(:disabled) {
    z-index: 4;
    transform: translateY(-6px);
    box-shadow: var(--glow-hover-shadow);
    filter: saturate(1.05);
  }

  .card-tile.compact {
    width: var(--card-w, clamp(62px, 5.7vw, 92px));
  }

  .card-tile.selected {
    z-index: 3;
    transform: translateY(-6px);
    outline: 0;
    box-shadow: var(--glow-selected-shadow);
  }

  button.card-tile.selected:hover:not(:disabled) {
    box-shadow: var(--glow-selected-shadow);
  }

  .card-tile.playable {
    outline: 0;
    box-shadow: var(--glow-playable-shadow);
  }

  button.card-tile.selected:disabled {
    opacity: 1;
  }

  .card-tile img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .damage-counter {
    position: absolute;
    top: 32%;
    left: 50%;
    z-index: 10;
    display: inline-grid;
    place-items: center;
    width: clamp(34px, calc(var(--slot-card-w, var(--card-w, 88px)) * 0.38), 66px);
    height: clamp(34px, calc(var(--slot-card-w, var(--card-w, 88px)) * 0.38), 66px);
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
    font-size: clamp(15px, calc(var(--slot-card-w, var(--card-w, 88px)) * 0.19), 30px);
    font-weight: 950;
    line-height: 1;
    -webkit-text-stroke: 1.3px #1f1f1f;
    paint-order: stroke fill;
    transform: translate(-50%, -50%);
    pointer-events: none;
    text-shadow: none;
  }

  .damage-counter-value {
    display: inline-block;
  }

  .damage-counter.triple-digit {
    font-size: clamp(13px, calc(var(--slot-card-w, var(--card-w, 88px)) * 0.165), 26px);
  }

  .fallback-name,
  .fallback-set {
    padding: 0 7px;
    text-align: center;
    line-height: 1.08;
  }

  .fallback-name {
    align-self: end;
    font-size: 11px;
    font-weight: 900;
  }

  .fallback-set {
    align-self: start;
    color: #66707c;
    font-size: 9px;
  }

  .card-tile.energy {
    background: linear-gradient(#fff7cc, #e7c95b);
  }

  .card-tile.trainer {
    background: linear-gradient(#fafafa, #d8dde4);
  }
</style>
