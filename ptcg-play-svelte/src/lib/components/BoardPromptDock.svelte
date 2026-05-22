<script lang="ts">
  import { labelFor } from '../game/labels';
  import type { PromptView } from '../game/types';

  type Props = {
    prompt: PromptView;
    maxSelections?: number;
    canConfirm?: boolean;
    resolving?: boolean;
    confirm: () => void;
  };

  let { prompt, maxSelections = 1, canConfirm = false, resolving = false, confirm }: Props = $props();
</script>

<div class="board-prompt-dock">
  <strong>{labelFor(prompt.message || prompt.type)}</strong>
  <span>Select Pokemon on the board.</span>
  {#if maxSelections > 1}
    <button class="primary" disabled={!canConfirm || resolving} onclick={confirm}>
      Confirm selection
    </button>
  {/if}
</div>

<style>
  .board-prompt-dock {
    position: absolute;
    left: calc((100vw - var(--board-right-rail)) / 2);
    top: calc((var(--board-top-inset) + 100vh - var(--board-bottom-inset)) / 2);
    z-index: 12;
    width: min(520px, calc(100vw - 220px));
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 6px 14px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid var(--surface-glass-border);
    background: var(--surface-glass-bg);
    color: var(--text-secondary);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: blur(var(--backdrop-blur));
    transform: translate(-50%, -50%);
  }

  .board-prompt-dock strong {
    color: var(--accent-strong);
    font-size: 15px;
  }

  .board-prompt-dock span {
    grid-column: 1;
    font-size: 12px;
  }

  .board-prompt-dock button {
    grid-row: 1 / span 2;
    grid-column: 2;
    border-radius: 6px;
    padding: 9px 12px;
    font-size: 12px;
  }
</style>
