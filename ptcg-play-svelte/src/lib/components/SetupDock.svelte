<script lang="ts">
  type Props = {
    needsActive?: boolean;
    canConfirm?: boolean;
    resolving?: boolean;
    confirm: () => void;
  };

  let { needsActive = false, canConfirm = false, resolving = false, confirm }: Props = $props();
</script>

<div class="setup-dock">
  <strong>Choose your starting Pokemon</strong>
  <span>
    {needsActive
      ? 'Drag a highlighted Basic to Active, then optionally place Basics on the Bench.'
      : 'Optionally drag highlighted Basics to the Bench, then confirm.'}
  </span>
  <button class="primary" disabled={resolving || !canConfirm} onclick={confirm}>
    Confirm setup
  </button>
</div>

<style>
  .setup-dock {
    position: absolute;
    left: calc((100vw - var(--board-right-rail)) / 2);
    top: 23%;
    z-index: 14;
    width: min(540px, calc(100vw - 220px));
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 16px;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(--surface-glass-border);
    background: var(--surface-glass-bg);
    color: var(--text-secondary);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: blur(var(--backdrop-blur));
    transform: translate(-50%, -50%);
  }

  .setup-dock strong {
    color: var(--accent-strong);
    font-size: 18px;
  }

  .setup-dock span {
    grid-column: 1;
    font-size: 13px;
    line-height: 1.35;
  }

  .setup-dock button {
    grid-row: 1 / span 2;
    grid-column: 2;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 13px;
  }
</style>
