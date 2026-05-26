<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import { labelFor } from '../../game/labels';
  import { promptTitle } from '../../game/promptCopy';
  import { promptOptions } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let options = $derived(promptOptions(prompt));
  let values = $derived(Array.isArray(prompt.fields.values) ? prompt.fields.values : []);
  let mulliganDrawValues = $derived(getMulliganDrawValues(prompt, values));
  let isMulliganDrawPrompt = $derived(mulliganDrawValues.length > 0);
  let minMulliganDraw = $derived(isMulliganDrawPrompt ? Math.min(...mulliganDrawValues.map((item) => item.value)) : 0);
  let maxMulliganDraw = $derived(isMulliganDrawPrompt ? Math.max(...mulliganDrawValues.map((item) => item.value)) : 0);
  let mulliganDrawAmount = $state(0);
  let mulliganDrawKey = $state('');

  $effect(() => {
    const key = `${prompt.id}:${mulliganDrawValues.map((item) => item.value).join(',')}`;
    if (isMulliganDrawPrompt && mulliganDrawKey !== key) {
      const defaultIndex = normalizeSelectionLimit(options.defaultValue, 0);
      mulliganDrawAmount = mulliganDrawValues.find((item) => item.index === defaultIndex)?.value ?? maxMulliganDraw;
      mulliganDrawKey = key;
    } else if (!isMulliganDrawPrompt && mulliganDrawKey) {
      mulliganDrawKey = '';
      mulliganDrawAmount = 0;
    }
  });

  function submitMulliganDraw() {
    const option = mulliganDrawValues.find((item) => item.value === Number(mulliganDrawAmount));
    if (option) {
      onresolve(option.index);
    }
  }

  function parseMulliganDrawValue(value: unknown) {
    if (typeof value !== 'string') {
      return null;
    }
    const match = /^Draw\s+(\d+)\s+card\(s\)$/i.exec(value.trim());
    return match ? Number(match[1]) : null;
  }

  function getMulliganDrawValues(currentPrompt: PromptView, rawValues: unknown[]) {
    if (currentPrompt.message !== 'WANT_TO_DRAW_CARDS') {
      return [];
    }
    const parsed = rawValues.map((value, index) => {
      const drawValue = parseMulliganDrawValue(value);
      return drawValue === null ? null : { value: drawValue, index };
    });
    return parsed.every(Boolean) ? (parsed as Array<{ value: number; index: number }>) : [];
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
</script>

<PromptPanel
  title={isMulliganDrawPrompt ? 'Draw extra cards?' : promptTitle(prompt, 'Choose')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#if isMulliganDrawPrompt}
    <div class="mulligan-slider">
      <div class="mulligan-slider-meta">
        <span>Mulligan</span>
        <strong>Draw {mulliganDrawAmount} card{Number(mulliganDrawAmount) === 1 ? '' : 's'}</strong>
      </div>
      <input
        type="range"
        min={minMulliganDraw}
        max={maxMulliganDraw}
        step="1"
        bind:value={mulliganDrawAmount}
        aria-label={`Draw ${mulliganDrawAmount} cards`}
      />
      <div class="mulligan-slider-scale" aria-hidden="true">
        <span>{minMulliganDraw}</span>
        <span>{maxMulliganDraw}</span>
      </div>
    </div>
  {:else if values.length}
    <div class="prompt-grid">
      {#each values as value, index}
        <button disabled={resolving} onclick={() => onresolve(index)}>{labelFor(value)}</button>
      {/each}
    </div>
  {/if}

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    {#if isMulliganDrawPrompt}
      <button class="primary" disabled={resolving} onclick={submitMulliganDraw}>Confirm</button>
    {/if}
  {/snippet}
</PromptPanel>
