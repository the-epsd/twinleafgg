<script lang="ts">
  import type { CardView } from '../game/types';

  export let card: CardView | undefined;
  export let compact = false;
  export let selected = false;
  export let draggable = false;
  export let disabled = false;
  export let interactive = false;
  export let faceDown = false;
  export let playable = false;
  export let testId = '';

  let failedImageUrl = '';

  $: imageUrl = faceDown ? '/assets/cardback.png' : card?.imageUrl;
  $: showImage = !!imageUrl && failedImageUrl !== imageUrl;
  $: label = faceDown ? 'Card' : (card?.name ?? 'Empty');
  $: typeClass = faceDown
    ? 'back'
    : card?.energyType !== undefined || card?.name?.includes('Energy')
      ? 'energy'
      : card?.trainerType !== undefined
        ? 'trainer'
        : card
          ? 'pokemon'
          : 'empty';
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
    on:dragstart
    on:dragend
    on:click
    on:selectstart|preventDefault
  >
    {#if showImage}
      <img src={imageUrl} alt="" loading="lazy" decoding="async" draggable="false" on:error={() => (failedImageUrl = imageUrl ?? '')} />
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
      <img src={imageUrl} alt="" loading="lazy" decoding="async" draggable="false" on:error={() => (failedImageUrl = imageUrl ?? '')} />
    {:else}
      <span class="fallback-name">{label}</span>
      {#if card?.set}
        <span class="fallback-set">{card.set} {card.setNumber}</span>
      {/if}
    {/if}
  </div>
{/if}
