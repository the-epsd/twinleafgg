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
    testId = '',
    onclick,
    ondragstart,
    ondragend,
  }: Props = $props();

  let failedImageUrl = $state('');

  let imageUrl = $derived(faceDown ? '/assets/cardback.png' : card?.imageUrl);
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
  </div>
{/if}
