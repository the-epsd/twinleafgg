<script lang="ts">
  import type { Snippet } from 'svelte';
  import PromptTitle from './PromptTitle.svelte';

  type Variant = 'default' | 'search' | 'compact';

  type Props = {
    title: string;
    subtitle?: string;
    variant?: Variant;
    icon?: Snippet;
    headerExtra?: Snippet;
    warning?: string;
    collapsible?: boolean;
    children?: Snippet;
    actions?: Snippet;
  };

  let {
    title,
    subtitle,
    variant = 'default',
    icon,
    headerExtra,
    warning,
    collapsible = true,
    children,
    actions,
  }: Props = $props();

  let collapsed = $state(false);
</script>

{#if collapsed}
  <section class="prompt-panel prompt-panel-collapsed">
    <button type="button" class="primary" onclick={() => (collapsed = false)}>
      Show {title}
    </button>
  </section>
{:else}
  <section class="prompt-panel" data-variant={variant}>
    <PromptTitle {title} {subtitle} {icon}>
      {#snippet trailing()}
        {#if headerExtra}{@render headerExtra()}{/if}
      {/snippet}
    </PromptTitle>

    {#if warning}
      <p class="prompt-warning">{warning}</p>
    {/if}

    {#if children}
      <div class="prompt-body">
        {@render children()}
      </div>
    {/if}

    {#if actions || collapsible}
      <div class="prompt-actions">
        <div class="prompt-actions-left">
          {#if collapsible}
            <button type="button" onclick={() => (collapsed = true)}>Hide</button>
          {/if}
        </div>
        <div class="prompt-actions-main">
          {#if actions}{@render actions()}{/if}
        </div>
      </div>
    {/if}
  </section>
{/if}

<style>
  .prompt-panel {
    display: grid;
    gap: 12px;
    max-height: inherit;
    padding: 14px;
    overflow: auto;
    border: 1px solid var(--surface-glass-border);
    border-radius: var(--radius-md);
    background: var(--surface-glass-bg);
    box-shadow: var(--surface-glass-shadow);
    color: var(--text-primary);
    backdrop-filter: blur(var(--backdrop-blur));
  }

  .prompt-panel[data-variant='search'] {
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    gap: 14px;
    height: auto;
    max-height: inherit;
    padding: 16px;
    overflow: hidden;
  }

  .prompt-panel[data-variant='compact'] {
    padding: 10px 12px;
    gap: 8px;
  }

  .prompt-body {
    display: grid;
    gap: 10px;
    min-height: 0;
  }

  .prompt-panel[data-variant='search'] .prompt-body {
    min-height: 0;
    overflow: hidden;
  }

  .prompt-panel-collapsed {
    width: max-content;
    justify-self: center;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    overflow: visible;
  }

  .prompt-panel-collapsed button {
    min-width: clamp(96px, calc(var(--card-w) * 1.45), 150px);
    min-height: clamp(40px, calc(var(--card-w) * 0.54), 56px);
    padding: clamp(9px, calc(var(--card-w) * 0.14), 14px) clamp(14px, calc(var(--card-w) * 0.24), 24px);
    border-radius: var(--radius-md);
    font-size: clamp(14px, calc(var(--card-w) * 0.17), 18px);
    font-weight: 800;
    box-shadow: 0 12px 32px rgba(23, 30, 38, 0.2);
  }

  .prompt-warning {
    margin: 0;
    color: var(--warning-text);
    font-size: 13px;
  }

  .prompt-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
  }

  .prompt-actions-left,
  .prompt-actions-main {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .prompt-actions-main {
    justify-content: flex-end;
    margin-left: auto;
  }

  .prompt-actions-left button {
    border-radius: var(--radius-sm);
  }
</style>
