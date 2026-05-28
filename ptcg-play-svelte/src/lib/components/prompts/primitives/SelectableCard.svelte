<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    selected?: boolean;
    blocked?: boolean;
    assigned?: boolean;
    disabled?: boolean;
    title?: string;
    draggable?: boolean;
    children: Snippet;
    label?: Snippet;
    onclick?: (event: MouseEvent) => void;
    ondragstart?: (event: DragEvent) => void;
  };

  let {
    selected = false,
    blocked = false,
    assigned = false,
    disabled = false,
    title,
    draggable = false,
    children,
    label,
    onclick,
    ondragstart,
  }: Props = $props();
</script>

<button
  type="button"
  class="selectable-card"
  class:selected
  class:blocked
  class:assigned
  {disabled}
  {title}
  {draggable}
  {onclick}
  {ondragstart}
>
  {@render children()}
  {#if label}
    <span class="selectable-card-label">{@render label()}</span>
  {/if}
</button>

<style>
  .selectable-card {
    position: relative;
    display: grid;
    gap: 6px;
    justify-items: center;
    align-content: start;
    min-width: 0;
    padding: 4px;
    border-radius: var(--radius-md);
    border: 1px solid var(--surface-inset-border);
    background: var(--surface-inset-bg);
    box-shadow: none;
    color: var(--text-primary);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast),
      border-color var(--transition-fast),
      background var(--transition-fast),
      filter var(--transition-fast);
  }

  .selectable-card :global(.card-tile) {
    width: 100%;
  }

  .selectable-card.blocked {
    opacity: var(--disabled-opacity);
  }

  .selectable-card:hover:not(:disabled) {
    border-color: var(--surface-inset-border);
  }

  .selectable-card.selected {
    z-index: 3;
    outline: 0;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  .selectable-card.selected :global(.card-tile) {
    border-radius: 6% / 4.5%;
    box-shadow: var(--glow-selected-shadow);
  }

  .selectable-card:hover:not(:disabled):not(.selected) {
    z-index: 2;
  }

  .selectable-card:hover:not(:disabled):not(.selected) :global(.card-tile) {
    border-radius: 6% / 4.5%;
    box-shadow:
      var(--glow-falloff),
      0 12px 22px rgba(23, 30, 38, 0.22);
    filter: saturate(1.05);
  }

  .selectable-card.assigned {
    border-color: var(--warning-base);
    background: var(--warning-soft);
  }

  .selectable-card[draggable='true'] {
    cursor: grab;
  }

  .selectable-card[draggable='true']:active {
    cursor: grabbing;
  }

  .selectable-card-label {
    min-width: 0;
    max-width: 100%;
    padding: 3px 8px;
    border-radius: var(--radius-pill);
    background: var(--surface-inset-bg);
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .selectable-card.assigned .selectable-card-label {
    background: var(--warning-soft);
    color: var(--warning-strong);
  }

  .selectable-card.selected .selectable-card-label {
    background: var(--accent-soft);
    color: var(--accent-strong);
  }
</style>
