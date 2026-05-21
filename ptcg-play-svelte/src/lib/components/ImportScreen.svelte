<script lang="ts">
  type PlayMode = 'local' | 'remote';

  type OnlineOpponent = {
    clientId: number;
    user: {
      name: string;
    };
  };

  type OnlineGame = {
    gameId: number;
    phase: number;
    players: { name: string }[];
  };

  type Props = {
    mode: PlayMode;
    deck1Text: string;
    deck2Text: string;
    displayName: string;
    busy?: boolean;
    onlineBusy?: boolean;
    connected?: boolean;
    error?: string;
    onlineError?: string;
    opponents?: OnlineOpponent[];
    games?: OnlineGame[];
    setMode: (mode: PlayMode) => void;
    startGame: () => void;
    connectOnline: () => void;
    disconnectOnline: () => void;
    inviteOnline: (clientId: number) => void;
    joinOnlineGame: (gameId: number) => void;
  };

  let {
    mode,
    deck1Text = $bindable(),
    deck2Text = $bindable(),
    displayName = $bindable(),
    busy = false,
    onlineBusy = false,
    connected = false,
    error = '',
    onlineError = '',
    opponents = [],
    games = [],
    setMode,
    startGame,
    connectOnline,
    disconnectOnline,
    inviteOnline,
    joinOnlineGame,
  }: Props = $props();

  function handleStart() {
    startGame();
  }

  function phaseLabel(phase: number) {
    if (phase === 0) return 'Waiting';
    if (phase === 1) return 'Setup';
    if (phase === 7) return 'Finished';
    return 'In progress';
  }
</script>

<section class="import-screen">
  <div class="mode-tabs" role="tablist" aria-label="Play mode">
    <button class:active={mode === 'local'} type="button" onclick={() => setMode('local')}>Local</button>
    <button class:active={mode === 'remote'} type="button" onclick={() => setMode('remote')}>Online</button>
  </div>

  {#if mode === 'local'}
    <div class="deck-import two-column">
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
  {:else}
    <div class="online-layout">
      <div class="online-main">
        <label>
          Display name
          <input bind:value={displayName} spellcheck="false" />
        </label>
        <label>
          Your deck
          <textarea bind:value={deck1Text} spellcheck="false"></textarea>
        </label>
        <div class="online-actions">
          {#if connected}
            <button type="button" onclick={disconnectOnline}>Disconnect</button>
          {:else}
            <button class="primary" type="button" disabled={onlineBusy || !displayName.trim()} onclick={connectOnline}>
              {onlineBusy ? 'Connecting...' : 'Connect'}
            </button>
          {/if}
        </div>
      </div>

      <div class="online-side">
        <section class="online-panel">
          <h2>Online</h2>
          {#if !connected}
            <p class="empty">Not connected</p>
          {:else if opponents.length === 0}
            <p class="empty">No opponents online</p>
          {:else}
            <div class="list">
              {#each opponents as opponent}
                <button type="button" disabled={onlineBusy} onclick={() => inviteOnline(opponent.clientId)}>
                  <span>{opponent.user.name}</span>
                  <strong>Invite</strong>
                </button>
              {/each}
            </div>
          {/if}
        </section>

        <section class="online-panel">
          <h2>Your games</h2>
          {#if !connected || games.length === 0}
            <p class="empty">No active games</p>
          {:else}
            <div class="list">
              {#each games as game}
                <button type="button" disabled={onlineBusy} onclick={() => joinOnlineGame(game.gameId)}>
                  <span>#{game.gameId} {phaseLabel(game.phase)}</span>
                  <strong>{game.players.map((player) => player.name).join(' vs ') || 'Open'}</strong>
                </button>
              {/each}
            </div>
          {/if}
        </section>
      </div>
    </div>
    {#if onlineError || error}
      <pre class="error">{onlineError || error}</pre>
    {/if}
  {/if}
</section>

<style>
  .import-screen {
    min-height: 100vh;
    display: grid;
    gap: 14px;
    align-content: center;
    padding: 72px 24px 24px;
  }

  .mode-tabs {
    justify-self: center;
    display: inline-grid;
    grid-template-columns: repeat(2, minmax(92px, 1fr));
    gap: 4px;
    padding: 4px;
    border-radius: 8px;
    border: 1px solid rgba(26, 31, 39, 0.12);
    background: #eef1f4;
  }

  .mode-tabs button {
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #44505e;
  }

  .mode-tabs button.active {
    background: #ffffff;
    color: #1d232b;
    box-shadow: 0 1px 4px rgba(23, 30, 38, 0.12);
  }

  .deck-import {
    display: grid;
    gap: 16px;
  }

  .deck-import.two-column {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .deck-import label,
  .online-main label {
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

  input {
    min-height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(26, 31, 39, 0.18);
    background: #f7f8fa;
    color: #1d232b;
    padding: 0 12px;
  }

  .online-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
    gap: 16px;
    align-items: start;
  }

  .online-main {
    display: grid;
    gap: 12px;
  }

  .online-main textarea {
    min-height: 48vh;
  }

  .online-actions {
    display: flex;
    gap: 8px;
  }

  .online-side {
    display: grid;
    gap: 12px;
  }

  .online-panel {
    display: grid;
    gap: 10px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(26, 31, 39, 0.12);
    background: #f7f8fa;
  }

  .online-panel h2 {
    margin: 0;
    font-size: 13px;
  }

  .list {
    display: grid;
    gap: 8px;
  }

  .list button {
    display: flex;
    min-width: 0;
    justify-content: space-between;
    gap: 12px;
    text-align: left;
    border-radius: 6px;
    background: #ffffff;
  }

  .list span,
  .list strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty {
    margin: 0;
    color: #657181;
    font-size: 13px;
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
    .deck-import.two-column,
    .online-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
