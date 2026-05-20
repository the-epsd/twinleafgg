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
