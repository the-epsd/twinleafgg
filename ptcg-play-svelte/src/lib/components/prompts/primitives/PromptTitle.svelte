<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    subtitle?: string;
    icon?: Snippet;
    trailing?: Snippet;
  };

  let { title, subtitle, icon, trailing }: Props = $props();
</script>

<header class="prompt-title">
  <div class="prompt-title-text">
    {#if icon}
      <span class="prompt-title-icon">{@render icon()}</span>
    {/if}
    <div class="prompt-title-stack">
      <strong>{title}</strong>
      {#if subtitle}<span>{subtitle}</span>{/if}
    </div>
  </div>
  {#if trailing}
    <div class="prompt-title-trailing">{@render trailing()}</div>
  {/if}
</header>

<style>
  .prompt-title {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
    color: var(--text-secondary);
  }

  .prompt-title-text {
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }

  .prompt-title-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-pill);
    background: var(--accent-tint);
    color: var(--accent-base);
    flex-shrink: 0;
  }

  .prompt-title-stack {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  .prompt-title strong {
    color: var(--accent-strong);
    font-size: 18px;
    font-weight: 800;
    line-height: 1.15;
  }

  .prompt-title span {
    color: var(--text-secondary);
    font-size: 13px;
  }

  .prompt-title-trailing {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }
</style>
