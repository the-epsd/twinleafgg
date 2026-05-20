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

<style>
  .import-screen {
    min-height: 100vh;
    display: grid;
    gap: 16px;
    align-content: center;
    padding: 72px 24px 24px;
  }

  .deck-import {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .deck-import label {
    display: grid;
    gap: 8px;
    color: #29313c;
    font-weight: 800;
  }

  textarea {
    width: 100%;
    min-height: 54vh;
    resize: vertical;
    border-radius: 8px;
    border: 1px solid rgba(26, 31, 39, 0.18);
    background: #f7f8fa;
    color: #1d232b;
    padding: 12px;
  }

  .error {
    margin: 0;
    padding: 12px;
    border-radius: 8px;
    background: #fff0f1;
    border: 1px solid #d87883;
    color: #7d2732;
    white-space: pre-wrap;
  }

  @media (max-width: 980px) {
    .deck-import {
      grid-template-columns: 1fr;
    }
  }
</style>
