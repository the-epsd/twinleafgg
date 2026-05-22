<script lang="ts">
  type Props = {
    label: string;
    current: number;
    max: number;
    min?: number;
  };

  let { label, current, max, min }: Props = $props();

  let display = $derived(
    min !== undefined && min !== max
      ? `${current}/${min}${min !== max ? '-' : ''}${min !== max ? max : ''}`
      : `${current}/${max}`,
  );
</script>

<div class="prompt-meta" aria-live="polite">
  <span class="prompt-meta-label">{label}</span>
  <strong class="prompt-meta-value">{display}</strong>
</div>

<style>
  .prompt-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    background: var(--surface-inset-bg);
    border: 1px solid var(--surface-inset-border);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .prompt-meta-value {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0;
    text-transform: none;
  }
</style>
