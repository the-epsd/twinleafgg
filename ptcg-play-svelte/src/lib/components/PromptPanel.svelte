<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { labelFor } from '../game/labels';
  import { SlotType, targetFor, type CardTarget, type GameView, type PromptView } from '../game/types';
  import CardTile from './CardTile.svelte';

  export let game: GameView;
  export let prompt: PromptView;
  export let resolving = false;

  const dispatch = createEventDispatcher<{ resolve: unknown }>();
  let jsonResult = '';
  let selectedIndexes: number[] = [];
  let selectedTargets: CardTarget[] = [];
  let sourceTarget: CardTarget | null = null;
  let damageAmount = 10;
  let attachEnergyIndex = 0;
  let autoContinueKey = '';
  let autoContinueTimer: ReturnType<typeof setTimeout> | undefined;

  $: fields = prompt.fields ?? {};
  $: options = (fields.options as any) ?? {};
  $: cards = extractCards(fields);
  $: prizeChoices = extractPrizes(fields, prompt.playerIndex);
  $: selectableTargets = getSelectableTargets(game, prompt);
  $: selectionPoolSize = cards.length || prizeChoices.length || selectableTargets.length || 1;
  $: maxSelections = normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize));
  $: minSelections = normalizeSelectionLimit(
    options.min,
    prompt.className === 'ChoosePrizePrompt'
      ? normalizeSelectionLimit(options.count, 1)
      : prompt.className === 'ChooseEnergyPrompt'
        ? normalizeSelectionLimit((fields.cost as any[])?.length, 1)
        : prompt.className.includes('Shuffle')
          ? cards.length
          : 0,
  );
  $: blockedIndexes = new Set<number>(Array.isArray(options.blocked) ? options.blocked : []);
  $: selectedIndexes = selectedIndexes.filter((index) => isIndexSelectable(index)).slice(0, maxSelections);
  $: autoContinuePrompt = ['AlertPrompt', 'ShowCardsPrompt', 'ConfirmCardsPrompt', 'ShowMulliganPrompt'].includes(prompt.className);
  $: {
    const key = `${prompt.id}:${prompt.className}`;
    if (autoContinuePrompt && !resolving && autoContinueKey !== key) {
      clearAutoContinue();
      autoContinueKey = key;
      autoContinueTimer = setTimeout(() => submit(true), 3000);
    } else if (!autoContinuePrompt && autoContinueKey) {
      clearAutoContinue();
    }
  }

  onDestroy(clearAutoContinue);

  function clearAutoContinue() {
    if (autoContinueTimer) {
      clearTimeout(autoContinueTimer);
      autoContinueTimer = undefined;
    }
    autoContinueKey = '';
  }

  function toggleIndex(index: number) {
    if (!isIndexSelectable(index)) {
      return;
    }
    selectedIndexes = selectedIndexes.includes(index)
      ? selectedIndexes.filter((item) => item !== index)
      : maxSelections <= 1
        ? [index]
        : selectedIndexes.length < maxSelections
          ? [...selectedIndexes, index]
          : selectedIndexes;
  }

  function toggleTarget(target: CardTarget) {
    const exists = selectedTargets.some((item) => sameTarget(item, target));
    if (exists) {
      selectedTargets = selectedTargets.filter((item) => !sameTarget(item, target));
      return;
    }
    if (maxSelections <= 1) {
      selectedTargets = [target];
      return;
    }
    if (selectedTargets.length < maxSelections) {
      selectedTargets = [...selectedTargets, target];
    }
  }

  function sameTarget(a: CardTarget, b: CardTarget) {
    return a.player === b.player && a.slot === b.slot && a.index === b.index;
  }

  function submit(value: unknown) {
    clearAutoContinue();
    dispatch('resolve', value);
    selectedIndexes = [];
    selectedTargets = [];
    sourceTarget = null;
    jsonResult = '';
  }

  function submitJson() {
    try {
      submit(jsonResult.trim() ? JSON.parse(jsonResult) : null);
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
    }
  }

  function submitSelectedIndexes() {
    if (selectedIndexes.length < minSelections) {
      return;
    }
    submit(selectedIndexes);
  }

  function submitSelectedTargets() {
    if (selectedTargets.length < minSelections) {
      return;
    }
    submit(selectedTargets);
  }

  function submitAttachEnergy() {
    if (selectedTargets.length === 0) {
      return;
    }
    submit([{ to: selectedTargets[0], index: attachEnergyIndex }]);
  }

  function submitDiscardEnergy() {
    if (!sourceTarget) {
      return;
    }
    submit([{ from: sourceTarget, index: attachEnergyIndex }]);
  }

  function submitMoveEnergy() {
    if (!sourceTarget || selectedTargets.length === 0) {
      return;
    }
    submit([{ from: sourceTarget, to: selectedTargets[0], index: attachEnergyIndex }]);
  }

  function submitDamage() {
    if (selectedTargets.length === 0) {
      return;
    }
    submit(selectedTargets.map((target) => ({ target, damage: damageAmount })));
  }

  function submitMoveDamage() {
    if (!sourceTarget || selectedTargets.length === 0) {
      return;
    }
    submit(selectedTargets.map((target) => ({ from: sourceTarget, to: target })));
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function useListedOrder() {
    submit(cards.map((card: any, index: number) => card.index ?? index));
  }

  function energyCostLabel(cost: unknown) {
    return Array.isArray(cost) && cost.length ? `Cost: ${cost.length} energy` : 'Choose energy';
  }

  function isIndexSelectable(index: number) {
    if (blockedIndexes.has(index)) {
      return false;
    }
    if (prompt.className !== 'ChooseCardsPrompt') {
      return true;
    }
    return matchesCardFilter(cards.find((card: any, cardIndex: number) => (card.index ?? cardIndex) === index), fields.filter);
  }

  function matchesCardFilter(card: any, filter: unknown) {
    if (!card || !filter || typeof filter !== 'object') {
      return true;
    }
    return Object.entries(filter as Record<string, unknown>).every(([key, value]) => value === undefined || card[key] === value);
  }

  function isBlockedAttack(cardIndex: number, attackName: string) {
    const blocked = (fields.options as any)?.blocked;
    return Array.isArray(blocked) && blocked.some((item) => item?.index === cardIndex && item?.attack === attackName);
  }

  function extractCards(rawFields: Record<string, unknown>): any[] {
    const cardList = (rawFields.cardList as any[]) ?? (rawFields.cards as any[]);
    if (Array.isArray(cardList)) {
      return cardList;
    }
    const energy = rawFields.energy as any[];
    if (Array.isArray(energy)) {
      return energy.map((item, index) => ({ index: item.index ?? index, ...(item.card ?? {}) }));
    }
    return [];
  }

  function extractPrizes(rawFields: Record<string, unknown>, promptPlayerIndex: number): any[] {
    if (Array.isArray(rawFields.prizes)) {
      return rawFields.prizes as any[];
    }
    const promptPlayer = game.players[promptPlayerIndex];
    const count = promptPlayer?.prizesLeft ?? normalizeSelectionLimit((rawFields.options as any)?.count, 6);
    return Array.from({ length: count }, (_, index) => ({ index, cards: [] }));
  }

  function getSelectableTargets(current: GameView, currentPrompt: PromptView): Array<{ label: string; target: CardTarget }> {
    const playerType = Number((currentPrompt.fields as any).playerType ?? 0);
    const slots = Array.isArray((currentPrompt.fields as any).slots)
      ? ((currentPrompt.fields as any).slots as number[])
      : [SlotType.ACTIVE, SlotType.BENCH];
    const blocked = Array.isArray((currentPrompt.fields as any).options?.blocked)
      ? ((currentPrompt.fields as any).options.blocked as CardTarget[])
      : [];
    const result: Array<{ label: string; target: CardTarget }> = [];
    for (const player of current.players) {
      const isPromptPlayer = player.index === currentPrompt.playerIndex;
      if (playerType === 2 && !isPromptPlayer) continue;
      if (playerType === 1 && isPromptPlayer) continue;
      if (slots.includes(SlotType.ACTIVE) && !player.active.empty) {
        const target = targetFor(currentPrompt.playerIndex, player.index, SlotType.ACTIVE, 0);
        if (!blocked.some((item) => sameTarget(item, target))) {
          result.push({ label: `${player.name} active`, target });
        }
      }
      if (slots.includes(SlotType.BENCH)) {
        for (const bench of player.bench) {
          if (bench.empty) continue;
          const target = targetFor(currentPrompt.playerIndex, player.index, SlotType.BENCH, bench.index);
          if (!blocked.some((item) => sameTarget(item, target))) {
            result.push({ label: `${player.name} bench ${bench.index + 1}`, target });
          }
        }
      }
    }
    return result;
  }
</script>

<section class="prompt-panel">
  <div class="prompt-title">
    <strong>{labelFor(prompt.className)}</strong>
    <span>{labelFor(prompt.message || prompt.type)}</span>
  </div>
  {#if !prompt.supported}
    <p class="prompt-warning">{prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.'}</p>
  {/if}

  {#if ['AlertPrompt', 'ShowCardsPrompt', 'ConfirmCardsPrompt', 'ShowMulliganPrompt'].includes(prompt.className)}
    {#if cards.length}
      <div class="prompt-card-list">
        {#each cards as card}
          <CardTile {card} compact />
        {/each}
      </div>
    {/if}
    <p class="prompt-hint">Auto-continues in 3 seconds.</p>
    <button disabled={resolving} on:click={() => submit(true)}>Continue</button>
  {:else if prompt.className === 'WaitPrompt'}
    <button disabled={resolving} on:click={() => submit(null)}>Continue</button>
  {:else if prompt.className === 'ConfirmPrompt'}
    <div class="prompt-actions">
      <button disabled={resolving} on:click={() => submit(true)}>Yes</button>
      <button disabled={resolving} on:click={() => submit(false)}>No</button>
    </div>
  {:else if prompt.className === 'CoinFlipPrompt'}
    <div class="prompt-actions">
      <button disabled={resolving} on:click={() => submit(true)}>Heads</button>
      <button disabled={resolving} on:click={() => submit(false)}>Tails</button>
    </div>
  {:else if ['SelectOptionPrompt', 'SelectPrompt'].includes(prompt.className) && Array.isArray(fields.values)}
    <div class="prompt-grid">
      {#each fields.values as value, index}
        <button disabled={resolving} on:click={() => submit(index)}>{labelFor(value)}</button>
      {/each}
    </div>
  {:else if prompt.className === 'ChooseAttackPrompt' && cards.length}
    <div class="prompt-grid">
      {#each cards as card, cardIndex}
        {#each card.attacks ?? [] as attack}
          <button
            disabled={resolving || isBlockedAttack(card.index ?? cardIndex, attack.name)}
            on:click={() => submit({ index: card.index ?? cardIndex, attack: attack.name })}
          >
            <strong>{card.name}: {attack.name}</strong>
            {#if attack.damage}<span>{attack.damage}</span>{/if}
          </button>
        {/each}
      {/each}
    </div>
    {#if options.allowCancel}
      <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
    {/if}
  {:else if ['ChoosePokemonPrompt'].includes(prompt.className)}
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
          disabled={resolving}
          on:click={() => toggleTarget(item.target)}
        >
          {item.label}
        </button>
      {/each}
    </div>
    <div class="prompt-actions">
      <button disabled={resolving || selectedTargets.length < minSelections} on:click={submitSelectedTargets}>
        Confirm selection
      </button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
    </div>
  {:else if prompt.className === 'ChoosePrizePrompt'}
    <p class="prompt-hint">Choose {minSelections}{#if maxSelections !== minSelections}-{maxSelections}{/if} prize card{maxSelections === 1 ? '' : 's'}.</p>
    <div class="prompt-grid prize-grid">
      {#each prizeChoices as prize}
        <button
          class:selected={selectedIndexes.includes(prize.index)}
          class:blocked={!isIndexSelectable(prize.index)}
          disabled={resolving || !isIndexSelectable(prize.index)}
          on:click={() => toggleIndex(prize.index)}
        >
          <strong>Prize {prize.index + 1}</strong>
          {#if prize.cards?.[0]}
            <CardTile card={prize.cards[0]} compact />
          {:else}
            <span>Face down</span>
          {/if}
        </button>
      {/each}
    </div>
    <div class="prompt-actions">
      <button disabled={resolving || selectedIndexes.length < minSelections} on:click={submitSelectedIndexes}>
        Take selected prize{minSelections === 1 ? '' : 's'}
      </button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
    </div>
  {:else if prompt.className === 'ChooseEnergyPrompt' && cards.length}
    <p class="prompt-hint">{energyCostLabel(fields.cost)}</p>
    <div class="prompt-card-list">
      {#each cards as card, index}
        <button
          class:selected={selectedIndexes.includes(card.index ?? index)}
          class:blocked={!isIndexSelectable(card.index ?? index)}
          disabled={resolving || !isIndexSelectable(card.index ?? index)}
          on:click={() => toggleIndex(card.index ?? index)}
        >
          <CardTile card={card} compact />
        </button>
      {/each}
    </div>
    <div class="prompt-actions">
      <button disabled={resolving || selectedIndexes.length < minSelections} on:click={submitSelectedIndexes}>Pay cost</button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
    </div>
  {:else if ['AttachEnergyPrompt', 'DiscardEnergyPrompt', 'MoveEnergyPrompt'].includes(prompt.className)}
    <label class="inline-field">
      Energy index
      <input type="number" min="0" bind:value={attachEnergyIndex} />
    </label>
    {#if prompt.className !== 'AttachEnergyPrompt'}
      <p class="prompt-hint">Choose source, then destination when needed.</p>
      <div class="prompt-grid">
        {#each selectableTargets as item}
          <button class:selected={sourceTarget && sameTarget(sourceTarget, item.target)} disabled={resolving} on:click={() => (sourceTarget = item.target)}>
            From {item.label}
          </button>
        {/each}
      </div>
    {/if}
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
          disabled={resolving}
          on:click={() => toggleTarget(item.target)}
        >
          {item.label}
        </button>
      {/each}
    </div>
    {#if prompt.className === 'AttachEnergyPrompt'}
      <button disabled={resolving || selectedTargets.length === 0} on:click={submitAttachEnergy}>Attach</button>
    {:else if prompt.className === 'DiscardEnergyPrompt'}
      <button disabled={resolving || !sourceTarget} on:click={submitDiscardEnergy}>Discard</button>
    {:else}
      <button disabled={resolving || !sourceTarget || selectedTargets.length === 0} on:click={submitMoveEnergy}>Move</button>
    {/if}
    {#if options.allowCancel}
      <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
    {/if}
  {:else if prompt.className === 'PutDamagePrompt'}
    <label class="inline-field">
      Damage
      <input type="number" min="0" step={options.damageMultiple ?? 10} bind:value={damageAmount} />
    </label>
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
          disabled={resolving}
          on:click={() => toggleTarget(item.target)}
        >
          {item.label}
        </button>
      {/each}
    </div>
    <button disabled={resolving || selectedTargets.length === 0} on:click={submitDamage}>Apply</button>
    {#if options.allowCancel}
      <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
    {/if}
  {:else if ['MoveDamagePrompt', 'RemoveDamagePrompt'].includes(prompt.className)}
    <p class="prompt-hint">Choose source, then destination.</p>
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button class:selected={sourceTarget && sameTarget(sourceTarget, item.target)} disabled={resolving} on:click={() => (sourceTarget = item.target)}>
          From {item.label}
        </button>
      {/each}
    </div>
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
          disabled={resolving}
          on:click={() => toggleTarget(item.target)}
        >
          To {item.label}
        </button>
      {/each}
    </div>
    <button disabled={resolving || !sourceTarget || selectedTargets.length === 0} on:click={submitMoveDamage}>Move</button>
    {#if options.allowCancel}
      <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
    {/if}
  {:else if (prompt.className.includes('Shuffle') || prompt.className.includes('Order')) && cards.length}
    <p class="prompt-hint">Keep the shown order to continue.</p>
    <div class="prompt-actions">
      <button disabled={resolving} on:click={useListedOrder}>Continue</button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
    </div>
  {:else if cards.length}
    <p class="prompt-hint">Select {minSelections}{#if maxSelections !== minSelections}-{maxSelections}{/if} card{maxSelections === 1 ? '' : 's'}.</p>
    <div class="prompt-card-list">
      {#each cards as card, index}
        <button
          class:selected={selectedIndexes.includes(card.index ?? index)}
          class:blocked={!isIndexSelectable(card.index ?? index)}
          disabled={resolving || !isIndexSelectable(card.index ?? index)}
          on:click={() => toggleIndex(card.index ?? index)}
        >
          <CardTile card={card} compact />
        </button>
      {/each}
    </div>
    <div class="prompt-actions">
      <button disabled={resolving || selectedIndexes.length < minSelections} on:click={submitSelectedIndexes}>Confirm selection</button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
    </div>
  {/if}

  <details>
    <summary>Advanced</summary>
    <p>{prompt.resultSchema}</p>
    <textarea bind:value={jsonResult} placeholder="JSON result, for example null or [0]"></textarea>
    <button disabled={resolving} on:click={submitJson}>Resolve with JSON</button>
    <pre>{JSON.stringify(fields, null, 2)}</pre>
  </details>
</section>
