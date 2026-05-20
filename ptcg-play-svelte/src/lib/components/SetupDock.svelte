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
