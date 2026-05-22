<script lang="ts">
  import type { Snippet } from 'svelte';

  type Anchor = 'top' | 'bottom';

  type Props = {
    title: string;
    hint?: string;
    anchor?: Anchor;
    icon?: Snippet;
    meta?: Snippet;
    actions?: Snippet;
  };

  let { title, hint, anchor = 'bottom', icon, meta, actions }: Props = $props();
</script>

<aside class="prompt-strip" data-anchor={anchor} role="status" aria-live="polite">
  {#if icon}
    <span class="prompt-strip-icon">{@render icon()}</span>
  {/if}
  <div class="prompt-strip-text">
    <strong>{title}</strong>
    {#if hint}<span>{hint}</span>{/if}
  </div>
  {#if meta}
    <div class="prompt-strip-meta">{@render meta()}</div>
  {/if}
  {#if actions}
    <div class="prompt-strip-actions">{@render actions()}</div>
  {/if}
</aside>

<style>
  .prompt-strip {
    position: absolute;
    left: 50%;
    z-index: 14;
    display: flex;
    align-items: center;
    gap: 14px;
    width: max-content;
    max-width: min(720px, calc(100vw - 220px));
    padding: 10px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--surface-glass-border);
    background: var(--surface-glass-bg);
    color: var(--text-primary);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: blur(var(--backdrop-blur));
    transform: translateX(-50%);
  }

  .prompt-strip[data-anchor='bottom'] {
    bottom: calc(var(--board-bottom-inset, 0px) + 18px);
  }

  .prompt-strip[data-anchor='top'] {
    top: calc(var(--prompt-strip-anchor-y, calc(var(--board-top-inset, 0px) + var(--board-content-inset-y, 0px))) - var(--prompt-strip-gap, 16px));
    transform: translate(-50%, -100%);
  }

  .prompt-strip-icon {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: var(--radius-pill);
    background: var(--accent-tint);
    color: var(--accent-base);
    flex-shrink: 0;
  }

  .prompt-strip-text {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .prompt-strip-text strong {
    color: var(--accent-strong);
    font-size: 14px;
    font-weight: 800;
    line-height: 1.15;
  }

  .prompt-strip-text span {
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 1.2;
  }

  .prompt-strip-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    border-radius: var(--radius-pill);
    background: var(--surface-inset-bg);
    border: 1px solid var(--surface-inset-border);
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .prompt-strip-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .prompt-strip-actions :global(button) {
    border-radius: var(--radius-sm);
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 700;
  }
</style>
