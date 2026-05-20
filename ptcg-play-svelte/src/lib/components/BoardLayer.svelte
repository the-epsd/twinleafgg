<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<div class="board">
  {@render children()}
</div>

<style>
  .board {
    position: relative;
    min-height: 0;
    height: 100vh;
    display: block;
  }

  @media (max-width: 980px) {
    .board {
      grid-template-columns: 1fr;
    }
  }
</style>
