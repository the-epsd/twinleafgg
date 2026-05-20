<script lang="ts">
  type Props = {
    deck1Text: string;
    deck2Text: string;
    busy?: boolean;
    error?: string;
    startGame: () => void;
  };

  let { deck1Text = $bindable(), deck2Text = $bindable(), busy = false, error = '', startGame }: Props = $props();

  function handleStart() {
    startGame();
  }
</script>

<section class="import-screen">
  <div class="deck-import">
    <label>
      Player 1 deck
      <textarea bind:value={deck1Text} spellcheck="false"></textarea>
    </label>
    <label>
      Player 2 deck
      <textarea bind:value={deck2Text} spellcheck="false"></textarea>
    </label>
  </div>
  <button class="primary" disabled={busy} onclick={handleStart}>
    {busy ? 'Starting...' : 'Start local game'}
  </button>
  {#if error}
    <pre class="error">{error}</pre>
  {/if}
</section>
