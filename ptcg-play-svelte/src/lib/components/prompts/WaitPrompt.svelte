<script lang="ts">
  import { labelFor } from '../../game/labels';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();
</script>

<section class="prompt-panel">
  <div class="prompt-title">
    <div>
      <strong>{labelFor(prompt.className)}</strong>
      <span>{labelFor(prompt.message || prompt.type)}</span>
    </div>
  </div>
  {#if !prompt.supported}
    <p class="prompt-warning">{prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.'}</p>
  {/if}

  <button disabled={resolving} onclick={() => onresolve(null)}>Continue</button>
</section>
