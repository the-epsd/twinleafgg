<script lang="ts">
  import BoardSlot from './lib/components/BoardSlot.svelte';
  import CardTile from './lib/components/CardTile.svelte';
  import Hand from './lib/components/Hand.svelte';
  import PlayerSummary from './lib/components/PlayerSummary.svelte';
  import PromptPanel from './lib/components/PromptPanel.svelte';
  import ZoneViewer from './lib/components/ZoneViewer.svelte';
  import { parseDeckList, SAMPLE_DECK } from './lib/game/deckImport';
  import { localGameApi } from './lib/game/httpClient';
  import { labelFor } from './lib/game/labels';
  import { canPlayCardToPlayArea, canPlayCardToSlot, canRetreatToSlot } from './lib/game/playTargets';
  import { SlotType, targetFor, type CardTarget, type GameView, type PlayerView, type PokemonSlotView } from './lib/game/types';

  let deck1Text = SAMPLE_DECK;
  let deck2Text = SAMPLE_DECK;
  let game: GameView | null = null;
  let error = '';
  let busy = false;
  let resolvingPrompt = false;
  let selectedHand: { playerIndex: number; handIndex: number } | null = null;
  let activeFocusOpen = false;
  let followActive = true;
  let viewIndex = 0;
  let openZone:
    | { playerIndex: number; zone: 'discard' | 'lostZone' | 'stadium' | 'playZone'; title: string; faceDown?: boolean }
    | null = null;

  $: activePlayer = game?.players[game.activePlayerIndex];
  $: if (game && followActive) {
    viewIndex = game.activePlayerIndex;
  }
  $: bottomPlayer = game?.players[viewIndex] ?? game?.players[0];
  $: topPlayer = game?.players.find((player) => player.index !== bottomPlayer?.index);
  $: currentPrompt = game?.prompts[0];
  $: gameFinished = game?.phase === 7;
  $: winnerName =
    game?.winner === 0 || game?.winner === 1
      ? game.players[game.winner]?.name
      : game?.winner === 3
        ? 'Draw'
        : undefined;
  $: canAct = (playerIndex: number) => game?.activePlayerIndex === playerIndex && !currentPrompt && !gameFinished;
  $: selectedCard = selectedHand && game ? game.players[selectedHand.playerIndex]?.hand[selectedHand.handIndex] : undefined;
  $: currentStadium = game ? game.players.flatMap((player) => player.stadium)[0] : undefined;
  $: viewedCards = openZone && game ? (game.players[openZone.playerIndex]?.[openZone.zone] ?? []) : [];
  $: activeActionPokemon = activePlayer?.active.pokemon;
  $: activeBenchTargets = activePlayer?.bench.filter((slot) => !slot.empty) ?? [];
  $: actionableBenchPowers = activePlayer?.bench.filter((slot) => !slot.empty && slot.pokemon?.powers?.length) ?? [];
  $: canOpenActiveFocus = !!game && !!activeActionPokemon && canAct(activePlayer?.index ?? -1);
  $: if (currentPrompt || gameFinished || !canOpenActiveFocus) {
    activeFocusOpen = false;
  }

  async function startGame() {
    const p1 = parseDeckList(deck1Text);
    const p2 = parseDeckList(deck2Text);
    if (p1.errors.length || p2.errors.length) {
      error = [...p1.errors.map((e) => `Player 1: ${e}`), ...p2.errors.map((e) => `Player 2: ${e}`)].join('\n');
      return;
    }

    busy = true;
    error = '';
    selectedHand = null;
    const res = await localGameApi.start(p1.cards, p2.cards);
    busy = false;
    applyResponse(res);
  }

  function applyResponse(res: Awaited<ReturnType<typeof localGameApi.state>>) {
    if (res.ok) {
      game = res.view;
      error = '';
      selectedHand = null;
      activeFocusOpen = false;
      return;
    }
    error = res.error;
    if (res.view) {
      game = res.view;
    }
  }

  async function playToTarget(target: CardTarget) {
    if (!selectedHand || !game || !canAct(selectedHand.playerIndex)) {
      return;
    }
    busy = true;
    const res = await localGameApi.playCard(selectedHand.playerIndex, selectedHand.handIndex, target);
    busy = false;
    applyResponse(res);
  }

  function playToSlot(slot: PokemonSlotView) {
    if (!isPlayableTarget(slot)) {
      return;
    }
    void playToTarget(slot.target);
  }

  function clickSlot(slot: PokemonSlotView) {
    if (isPlayableTarget(slot)) {
      playToSlot(slot);
      return;
    }

    if (slot.slot === 'active' && slot.ownerIndex === game?.activePlayerIndex && !slot.empty && canOpenActiveFocus) {
      activeFocusOpen = true;
    }
  }

  async function attack(name: string) {
    if (!game || !activePlayer) return;
    busy = true;
    const res = await localGameApi.attack(game.activePlayerIndex, name);
    busy = false;
    applyResponse(res);
  }

  async function useAbility(name: string, target: CardTarget) {
    if (!game || !activePlayer) return;
    busy = true;
    const res = await localGameApi.useAbility(game.activePlayerIndex, name, target);
    busy = false;
    applyResponse(res);
  }

  async function useStadium() {
    if (!game || !activePlayer) return;
    busy = true;
    const res = await localGameApi.useStadium(game.activePlayerIndex);
    busy = false;
    applyResponse(res);
  }

  async function concede() {
    if (!game || !activePlayer || gameFinished) return;
    busy = true;
    const res = await localGameApi.concede(game.activePlayerIndex);
    busy = false;
    applyResponse(res);
  }

  async function passTurn() {
    if (!game) return;
    busy = true;
    const res = await localGameApi.passTurn(game.activePlayerIndex);
    busy = false;
    applyResponse(res);
  }

  async function retreat(to: number) {
    if (!game) return;
    busy = true;
    const res = await localGameApi.retreat(game.activePlayerIndex, to);
    busy = false;
    applyResponse(res);
  }

  async function resolvePrompt(value: unknown) {
    if (!currentPrompt) return;
    resolvingPrompt = true;
    const res = await localGameApi.resolvePrompt(currentPrompt.id, value);
    resolvingPrompt = false;
    applyResponse(res);
  }

  function selectHandCard(playerIndex: number, handIndex: number) {
    if (!canAct(playerIndex)) {
      return;
    }
    selectedHand =
      selectedHand?.playerIndex === playerIndex && selectedHand.handIndex === handIndex
        ? null
        : { playerIndex, handIndex };
    activeFocusOpen = false;
  }

  function onHandDrag(playerIndex: number, handIndex: number, event: DragEvent) {
    selectHandCard(playerIndex, handIndex);
    event.dataTransfer?.setData('text/plain', `${playerIndex}:${handIndex}`);
  }

  function allowDrop(event: DragEvent, slot: PokemonSlotView) {
    if (isPlayableTarget(slot)) {
      event.preventDefault();
    }
  }

  function allowPlayAreaDrop(event: DragEvent, player: PlayerView) {
    if (canPlayToArea(player)) {
      event.preventDefault();
    }
  }

  function allowBenchDrop(event: DragEvent, player: PlayerView) {
    if (canPlayToBenchArea(player)) {
      event.preventDefault();
    }
  }

  function switchSides() {
    followActive = false;
    viewIndex = topPlayer?.index ?? 0;
  }

  function resetGame() {
    game = null;
    error = '';
    selectedHand = null;
    openZone = null;
    resolvingPrompt = false;
    activeFocusOpen = false;
    busy = false;
    followActive = true;
    viewIndex = 0;
  }

  function dropToSlot(slot: PokemonSlotView, event: DragEvent) {
    event.preventDefault();
    playToSlot(slot);
  }

  function dropToPlayArea(player: PlayerView, event: DragEvent) {
    event.preventDefault();
    playToArea(player);
  }

  function dropToBenchArea(player: PlayerView, event: DragEvent) {
    event.preventDefault();
    playToBenchArea(player);
  }

  function isPlayableTarget(slot: PokemonSlotView) {
    return canPlayCardToSlot(selectedCard, selectedHand?.playerIndex, slot);
  }

  function occupiedBench(player: PlayerView) {
    return player.bench.filter((slot) => !slot.empty);
  }

  function benchAreaTarget(player: PlayerView) {
    return player.bench.find((slot) => slot.empty && isPlayableTarget(slot));
  }

  function canPlayToBenchArea(player: PlayerView) {
    return !!benchAreaTarget(player);
  }

  function playToBenchArea(player: PlayerView) {
    const target = benchAreaTarget(player);
    if (!target) {
      return;
    }
    playToSlot(target);
  }

  function canPlayToArea(player: PlayerView) {
    return canAct(player.index) && canPlayCardToPlayArea(selectedCard, selectedHand?.playerIndex);
  }

  function playToArea(player: PlayerView) {
    if (!canPlayToArea(player)) {
      return;
    }
    void playToTarget(targetFor(game?.activePlayerIndex ?? player.index, player.index, SlotType.ACTIVE));
  }

  function showZone(
    playerIndex: number,
    zone: 'discard' | 'lostZone' | 'stadium' | 'playZone',
    title: string,
    faceDown = false,
  ) {
    openZone = { playerIndex, zone, title, faceDown };
  }
</script>

<main>
  {#if !game}
    <header class="app-header">
      <div>
        <h1>Twinleaf Local</h1>
        <p>Manual-prompt, two-deck self-play client.</p>
      </div>
    </header>

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
      <button class="primary" disabled={busy} on:click={startGame}>
        {busy ? 'Starting...' : 'Start local game'}
      </button>
      {#if error}
        <pre class="error">{error}</pre>
      {/if}
    </section>
  {:else if bottomPlayer && topPlayer}
    <section class="table-shell">
      <div class="game-status">
        <strong>{winnerName ? `${winnerName} wins` : game.phaseLabel}</strong>
        <span>Turn {game.turn}</span>
        {#if !gameFinished}
          <span>{activePlayer?.name}</span>
        {/if}
      </div>

      <div class="table-toolbar">
        <label>
          <input type="checkbox" bind:checked={followActive} />
          Follow active player
        </label>
        <button on:click={switchSides}>Switch sides</button>
        <button on:click={resetGame}>Change decks</button>
        {#if error}
          <span class="inline-error">{labelFor(error)}</span>
        {/if}
      </div>

      {#if currentPrompt}
        <div class="prompt-dock">
          <PromptPanel game={game} prompt={currentPrompt} resolving={resolvingPrompt} on:resolve={(event) => resolvePrompt(event.detail)} />
        </div>
      {/if}

      <div class="board">
        <section class="player-panel top">
          <PlayerSummary player={topPlayer} active={game.activePlayerIndex === topPlayer.index} />
          <Hand
            player={topPlayer}
            selectedHand={selectedHand}
            disabled={!canAct(topPlayer.index)}
            concealed
            onSelect={selectHandCard}
            onDrag={onHandDrag}
          />
        </section>

        <section class="playmat">
          <div class="bench-zone opponent" class:empty={occupiedBench(topPlayer).length === 0}>
            <button
              type="button"
              class="bench-drop-surface"
              class:can-drop={canPlayToBenchArea(topPlayer)}
              disabled={!canPlayToBenchArea(topPlayer)}
              aria-label={`Play a Pokemon to ${topPlayer.name}'s bench`}
              title={`Play a Pokemon to ${topPlayer.name}'s bench`}
              on:click={() => playToBenchArea(topPlayer)}
              on:dragover={(event) => allowBenchDrop(event, topPlayer)}
              on:drop={(event) => dropToBenchArea(topPlayer, event)}
            ></button>
            <div class="bench-row opponent">
              {#each occupiedBench(topPlayer) as slot}
                <BoardSlot
                  {slot}
                  canDrop={isPlayableTarget(slot)}
                  on:click={() => clickSlot(slot)}
                  on:dragover={(event) => allowDrop(event, slot)}
                  on:drop={(event) => dropToSlot(slot, event)}
                />
              {/each}
            </div>
          </div>
          <div class="active-duel">
            <BoardSlot
              slot={topPlayer.active}
              active
              canDrop={isPlayableTarget(topPlayer.active)}
              on:click={() => clickSlot(topPlayer.active)}
              on:dragover={(event) => allowDrop(event, topPlayer.active)}
              on:drop={(event) => dropToSlot(topPlayer.active, event)}
            />
            <div class="center-stack">
              <div class="field-piles top-piles">
                <div class="left-piles">
                  <button
                    type="button"
                    class="stack-pile lost-pile"
                    title={`${topPlayer.name} lost zone`}
                    on:click={() => showZone(topPlayer.index, 'lostZone', `${topPlayer.name} lost zone`)}
                  >
                    {topPlayer.lostZone.length} L
                  </button>
                  <span class="stack-pile prize-pile" title={`${topPlayer.name} prizes`}>{topPlayer.prizesLeft}</span>
                </div>
                <div class="right-field">
                  <button
                    type="button"
                    class="play-card-zone top-play-zone"
                    class:can-drop={canPlayToArea(topPlayer)}
                    disabled={!canPlayToArea(topPlayer)}
                    aria-label={`Play selected card for ${topPlayer.name}`}
                    title={`Play selected card for ${topPlayer.name}`}
                    on:click={() => playToArea(topPlayer)}
                    on:dragover={(event) => allowPlayAreaDrop(event, topPlayer)}
                    on:drop={(event) => dropToPlayArea(topPlayer, event)}
                  ></button>
                  <div class="right-piles">
                    <span class="stack-pile deck-pile" title={`${topPlayer.name} deck`}>{topPlayer.deckCount}</span>
                    <button
                      type="button"
                      class="stack-pile discard-pile"
                      title={`${topPlayer.name} discard`}
                      on:click={() => showZone(topPlayer.index, 'discard', `${topPlayer.name} discard`)}
                    >
                      {topPlayer.discard.length}
                    </button>
                  </div>
                </div>
              </div>
              {#if currentStadium}
                <button
                  type="button"
                  class="stadium-marker"
                  title={currentStadium.fullName}
                  on:click={() => {
                    const owner = game.players.find((player) => player.stadium.length)?.index ?? bottomPlayer.index;
                    showZone(owner, 'stadium', 'Stadium');
                  }}
                >
                  {currentStadium.name}
                </button>
              {/if}
              <div class="field-piles bottom-piles">
                <div class="left-piles">
                  <button
                    type="button"
                    class="stack-pile lost-pile"
                    title={`${bottomPlayer.name} lost zone`}
                    on:click={() => showZone(bottomPlayer.index, 'lostZone', `${bottomPlayer.name} lost zone`)}
                  >
                    {bottomPlayer.lostZone.length} L
                  </button>
                  <span class="stack-pile prize-pile" title={`${bottomPlayer.name} prizes`}>{bottomPlayer.prizesLeft}</span>
                </div>
                <div class="right-field">
                  <button
                    type="button"
                    class="play-card-zone bottom-play-zone"
                    class:can-drop={canPlayToArea(bottomPlayer)}
                    disabled={!canPlayToArea(bottomPlayer)}
                    aria-label={`Play selected card for ${bottomPlayer.name}`}
                    title={`Play selected card for ${bottomPlayer.name}`}
                    on:click={() => playToArea(bottomPlayer)}
                    on:dragover={(event) => allowPlayAreaDrop(event, bottomPlayer)}
                    on:drop={(event) => dropToPlayArea(bottomPlayer, event)}
                  ></button>
                  <div class="right-piles">
                    <span class="stack-pile deck-pile" title={`${bottomPlayer.name} deck`}>{bottomPlayer.deckCount}</span>
                    <button
                      type="button"
                      class="stack-pile discard-pile"
                      title={`${bottomPlayer.name} discard`}
                      on:click={() => showZone(bottomPlayer.index, 'discard', `${bottomPlayer.name} discard`)}
                    >
                      {bottomPlayer.discard.length}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <BoardSlot
              slot={bottomPlayer.active}
              active
              canDrop={isPlayableTarget(bottomPlayer.active)}
              on:click={() => clickSlot(bottomPlayer.active)}
              on:dragover={(event) => allowDrop(event, bottomPlayer.active)}
              on:drop={(event) => dropToSlot(bottomPlayer.active, event)}
            />
          </div>
          <div class="bench-zone" class:empty={occupiedBench(bottomPlayer).length === 0}>
            <button
              type="button"
              class="bench-drop-surface"
              class:can-drop={canPlayToBenchArea(bottomPlayer)}
              disabled={!canPlayToBenchArea(bottomPlayer)}
              aria-label={`Play a Pokemon to ${bottomPlayer.name}'s bench`}
              title={`Play a Pokemon to ${bottomPlayer.name}'s bench`}
              on:click={() => playToBenchArea(bottomPlayer)}
              on:dragover={(event) => allowBenchDrop(event, bottomPlayer)}
              on:drop={(event) => dropToBenchArea(bottomPlayer, event)}
            ></button>
            <div class="bench-row">
              {#each occupiedBench(bottomPlayer) as slot}
                <BoardSlot
                  {slot}
                  canDrop={isPlayableTarget(slot)}
                  on:click={() => clickSlot(slot)}
                  on:dragover={(event) => allowDrop(event, slot)}
                  on:drop={(event) => dropToSlot(slot, event)}
                />
              {/each}
            </div>
          </div>
        </section>

        <section class="player-panel bottom">
          <PlayerSummary player={bottomPlayer} active={game.activePlayerIndex === bottomPlayer.index} />
          <Hand
            player={bottomPlayer}
            selectedHand={selectedHand}
            disabled={!canAct(bottomPlayer.index)}
            onSelect={selectHandCard}
            onDrag={onHandDrag}
          />
        </section>

        {#if activeFocusOpen && activePlayer && activeActionPokemon}
          <button
            type="button"
            class="active-focus-backdrop"
            aria-label="Close active actions"
            on:click={() => (activeFocusOpen = false)}
          ></button>
          <section class="active-focus" aria-label={`${activeActionPokemon.name} actions`}>
            <div class="focus-card">
              <CardTile card={activeActionPokemon} />
            </div>
            <div class="focus-content">
              <div class="focus-title">
                <div>
                  <strong>{activeActionPokemon.name}</strong>
                  <span>
                    {Math.max(0, activePlayer.active.hp - activePlayer.active.damage)}/{activePlayer.active.hp} HP
                    · {activePlayer.active.energy.length} Energy
                    {#if activePlayer.active.tools.length}
                      · {activePlayer.active.tools.length} Tool
                    {/if}
                  </span>
                </div>
                <button type="button" class="focus-close" on:click={() => (activeFocusOpen = false)} aria-label="Close active actions">
                  Close
                </button>
              </div>

              <div class="focus-actions">
                {#if activeActionPokemon.powers?.length}
                  <div class="action-group">
                    <span>Abilities</span>
                    {#each activeActionPokemon.powers as power}
                      <button disabled={busy || !!currentPrompt} title={power.text ?? power.name} on:click={() => useAbility(power.name, activePlayer.active.target)}>
                        {power.name}
                      </button>
                    {/each}
                  </div>
                {/if}

                {#if activeActionPokemon.attacks?.length}
                  <div class="action-group">
                    <span>Attacks</span>
                    {#each activeActionPokemon.attacks as item}
                      <button disabled={busy || !!currentPrompt} title={item.text ?? item.name} on:click={() => attack(item.name)}>
                        {item.name} {item.damage ? `(${item.damage})` : ''}
                      </button>
                    {/each}
                  </div>
                {/if}

                {#if activeBenchTargets.length}
                  <div class="action-group">
                    <span>Retreat</span>
                    {#each activeBenchTargets as bench}
                      <button disabled={busy || !!currentPrompt || !canRetreatToSlot(activePlayer.active, bench)} on:click={() => retreat(bench.index)}>
                        To bench {bench.index + 1}
                      </button>
                    {/each}
                  </div>
                {/if}

                {#if currentStadium || actionableBenchPowers.length}
                  <div class="action-group">
                    <span>Other</span>
                    {#if currentStadium}
                      <button disabled={busy || !!currentPrompt} on:click={useStadium}>
                        Use {currentStadium.name}
                      </button>
                    {/if}
                    {#each actionableBenchPowers as bench}
                      {#each bench.pokemon?.powers ?? [] as power}
                        <button disabled={busy || !!currentPrompt} title={power.text ?? power.name} on:click={() => useAbility(power.name, bench.target)}>
                          {power.name} B{bench.index + 1}
                        </button>
                      {/each}
                    {/each}
                  </div>
                {/if}

                <div class="action-group turn-actions">
                  <span>Turn</span>
                  <button disabled={busy || !!currentPrompt || gameFinished} on:click={passTurn}>Pass turn</button>
                  <button disabled={busy || !!currentPrompt || gameFinished} on:click={concede}>Concede</button>
                </div>
              </div>
            </div>
          </section>
        {/if}

        <aside class="log-panel">
          <h2>Log</h2>
          {#each game.logs.slice(-18).reverse() as log}
            <p>{labelFor(log.message)}</p>
          {/each}
        </aside>

        <ZoneViewer
          open={!!openZone}
          title={openZone?.title ?? ''}
          cards={viewedCards}
          faceDown={openZone?.faceDown ?? false}
          on:close={() => (openZone = null)}
        />
      </div>
    </section>
  {/if}
</main>
