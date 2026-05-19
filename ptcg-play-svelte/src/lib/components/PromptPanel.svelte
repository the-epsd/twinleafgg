<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { labelFor } from '../game/labels';
  import { SlotType, targetFor, type CardTarget, type GameView, type PromptView } from '../game/types';
  import CardTile from './CardTile.svelte';

  export let game: GameView;
  export let prompt: PromptView;
  export let resolving = false;
  export let autoContinue = false;
  export let activeAttachEnergyIndex: number | null = null;
  export let attachAssignments: Array<{ energyIndex: number; target: CardTarget }> = [];

  const dispatch = createEventDispatcher<{
    resolve: unknown;
    attachEnergySelect: number | null;
    attachEnergyReset: void;
    attachEnergyUnassign: number;
  }>();
  let selectedIndexes: number[] = [];
  let selectedTargets: CardTarget[] = [];
  let sourceTarget: CardTarget | null = null;
  let damageAmount = 10;
  let attachEnergyIndex = 0;
  let mulliganDrawAmount = 0;
  let mulliganDrawKey = '';
  let autoContinueKey = '';
  let autoContinueTimer: ReturnType<typeof setTimeout> | undefined;
  let hidden = false;
  let promptKey = '';

  $: fields = prompt.fields ?? {};
  $: options = (fields.options as any) ?? {};
  $: mulliganDrawValues = getMulliganDrawValues(prompt, fields.values);
  $: isMulliganDrawPrompt = mulliganDrawValues.length > 0;
  $: minMulliganDraw = isMulliganDrawPrompt ? Math.min(...mulliganDrawValues.map((item) => item.value)) : 0;
  $: maxMulliganDraw = isMulliganDrawPrompt ? Math.max(...mulliganDrawValues.map((item) => item.value)) : 0;
  $: cards = extractCards(fields);
  $: prizeChoices = extractPrizes(fields, prompt.playerIndex);
  $: selectableTargets = getSelectableTargets(game, prompt);
  $: attachTargets = getAttachTargets(game, prompt);
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
  $: selectedCards = selectedIndexes
    .map((index) => ({ index, card: cardForSelection(index) }))
    .filter((item) => item.card);
  $: selectedSlotCount =
    maxSelections <= 4
      ? maxSelections
      : Math.min(maxSelections, Math.max(minSelections, selectedIndexes.length + 1, 1));
  $: selectedSlots = Array.from({ length: selectedSlotCount }, (_, index) => selectedCards[index] ?? null);
  $: autoContinuePrompt = ['AlertPrompt', 'ShowCardsPrompt', 'ConfirmCardsPrompt', 'ShowMulliganPrompt'].includes(prompt.className);
  $: {
    const key = `${prompt.id}:${prompt.className}`;
    if (promptKey !== key) {
      promptKey = key;
      hidden = false;
      selectedIndexes = [];
      selectedTargets = [];
      sourceTarget = null;
    }
  }
  $: {
    const key = `${prompt.id}:${mulliganDrawValues.map((item) => item.value).join(',')}`;
    if (isMulliganDrawPrompt && mulliganDrawKey !== key) {
      const defaultIndex = normalizeSelectionLimit(options.defaultValue, 0);
      mulliganDrawAmount = mulliganDrawValues.find((item) => item.index === defaultIndex)?.value ?? maxMulliganDraw;
      mulliganDrawKey = key;
    } else if (!isMulliganDrawPrompt && mulliganDrawKey) {
      mulliganDrawKey = '';
      mulliganDrawAmount = 0;
    }
  }
  $: {
    const key = `${prompt.id}:${prompt.className}`;
    if (autoContinue && autoContinuePrompt && !resolving && autoContinueKey !== key) {
      clearAutoContinue();
      autoContinueKey = key;
      autoContinueTimer = setTimeout(() => submit(true), 3000);
    } else if ((!autoContinue || !autoContinuePrompt) && autoContinueKey) {
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
    if (attachAssignments.length < minSelections) {
      return;
    }
    submit(attachAssignments.map((assignment) => ({ to: assignment.target, index: assignment.energyIndex })));
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

  function submitMulliganDraw() {
    const option = mulliganDrawValues.find((item) => item.value === Number(mulliganDrawAmount));
    if (option) {
      submit(option.index);
    }
  }

  function submitMoveDamage() {
    if (!sourceTarget || selectedTargets.length === 0) {
      return;
    }
    submit(selectedTargets.map((target) => ({ from: sourceTarget, to: target })));
  }

  function chooseAttachEnergy(index: number) {
    dispatch('attachEnergySelect', index);
  }

  function assignAttachEnergy(index: number, target: CardTarget) {
    if (!attachEnergyAvailable(index) || !canAssignAttachTarget(target, index)) {
      return;
    }
    const withoutEnergy = attachAssignments.filter((assignment) => assignment.energyIndex !== index);
    const nextAssignment = { energyIndex: index, target };
    attachAssignments = maxSelections <= 1
      ? [nextAssignment]
      : [...withoutEnergy, nextAssignment].slice(0, maxSelections);
    activeAttachEnergyIndex = null;
  }

  function removeAttachAssignment(index: number) {
    dispatch('attachEnergyUnassign', index);
  }

  function resetAttachAssignments() {
    dispatch('attachEnergyReset');
  }

  function attachEnergyAvailable(index: number) {
    return !blockedIndexes.has(index) && !attachAssignments.some((assignment) => assignment.energyIndex === index);
  }

  function canAssignAttachTarget(target: CardTarget, energyIndex = activeAttachEnergyIndex) {
    if (energyIndex === null || !attachEnergyAvailable(energyIndex)) {
      return false;
    }
    if (maxSelections > 1 && attachAssignments.length >= maxSelections) {
      return false;
    }
    if (options.differentTargets && attachAssignments.some((assignment) => sameTarget(assignment.target, target))) {
      return false;
    }
    if (options.sameTarget && attachAssignments.length > 0 && !sameTarget(attachAssignments[0].target, target)) {
      return false;
    }
    return true;
  }

  function dragAttachEnergy(event: DragEvent, index: number) {
    event.dataTransfer?.setData('text/plain', String(index));
    event.dataTransfer?.setData('application/x-twinleaf-energy-index', String(index));
    event.dataTransfer?.setDragImage?.((event.currentTarget as HTMLElement), 24, 32);
    dispatch('attachEnergySelect', index);
  }

  function allowAttachDrop(event: DragEvent, target: CardTarget) {
    const index = dragEnergyIndex(event) ?? activeAttachEnergyIndex;
    if (index !== null && canAssignAttachTarget(target, index)) {
      event.preventDefault();
    }
  }

  function dropAttachEnergy(event: DragEvent, target: CardTarget) {
    const index = dragEnergyIndex(event) ?? activeAttachEnergyIndex;
    if (index === null) {
      return;
    }
    event.preventDefault();
    assignAttachEnergy(index, target);
  }

  function dragEnergyIndex(event: DragEvent) {
    const raw =
      event.dataTransfer?.getData('application/x-twinleaf-energy-index')
      || event.dataTransfer?.getData('text/plain');
    const value = Number(raw);
    return Number.isInteger(value) ? value : null;
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

  function parseMulliganDrawValue(value: unknown) {
    if (typeof value !== 'string') {
      return null;
    }
    const match = /^Draw\s+(\d+)\s+card\(s\)$/i.exec(value.trim());
    return match ? Number(match[1]) : null;
  }

  function getMulliganDrawValues(currentPrompt: PromptView, values: unknown) {
    if (currentPrompt.message !== 'WANT_TO_DRAW_CARDS' || !Array.isArray(values)) {
      return [];
    }
    const parsed = values.map((value, index) => {
      const drawValue = parseMulliganDrawValue(value);
      return drawValue === null ? null : { value: drawValue, index };
    });
    return parsed.every(Boolean) ? (parsed as Array<{ value: number; index: number }>) : [];
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

  function cardForSelection(index: number) {
    return cards.find((card: any, cardIndex: number) => (card.index ?? cardIndex) === index);
  }

  function attachAssignmentFor(index: number) {
    return attachAssignments.find((assignment) => assignment.energyIndex === index);
  }

  function targetLabel(target: CardTarget) {
    return attachTargets.find((item) => sameTarget(item.target, target))?.label ?? 'selected Pokemon';
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

  function getAttachTargets(current: GameView, currentPrompt: PromptView): Array<{ label: string; target: CardTarget; card?: any }> {
    const playerType = Number((currentPrompt.fields as any).playerType ?? 0);
    const slots = Array.isArray((currentPrompt.fields as any).slots)
      ? ((currentPrompt.fields as any).slots as number[])
      : [SlotType.ACTIVE, SlotType.BENCH];
    const blockedTo = Array.isArray((currentPrompt.fields as any).options?.blockedTo)
      ? ((currentPrompt.fields as any).options.blockedTo as CardTarget[])
      : [];
    const result: Array<{ label: string; target: CardTarget; card?: any }> = [];
    for (const player of current.players) {
      const isPromptPlayer = player.index === currentPrompt.playerIndex;
      if (playerType === 2 && !isPromptPlayer) continue;
      if (playerType === 1 && isPromptPlayer) continue;
      if (slots.includes(SlotType.ACTIVE) && !player.active.empty) {
        const target = targetFor(currentPrompt.playerIndex, player.index, SlotType.ACTIVE, 0);
        if (!blockedTo.some((item) => sameTarget(item, target))) {
          result.push({ label: `${player.name} active`, target, card: player.active.pokemon });
        }
      }
      if (slots.includes(SlotType.BENCH)) {
        for (const bench of player.bench) {
          if (bench.empty) continue;
          const target = targetFor(currentPrompt.playerIndex, player.index, SlotType.BENCH, bench.index);
          if (!blockedTo.some((item) => sameTarget(item, target))) {
            result.push({ label: `${player.name} bench ${bench.index + 1}`, target, card: bench.pokemon });
          }
        }
      }
    }
    return result;
  }
</script>

{#if hidden}
  <section class="prompt-panel prompt-panel-collapsed">
    <button type="button" on:click={() => (hidden = false)}>Show</button>
  </section>
{:else}
<section
  class="prompt-panel"
  class:search-prompt={prompt.className === 'ChooseCardsPrompt'}
  class:attach-energy-prompt={prompt.className === 'AttachEnergyPrompt'}
>
  <div class="prompt-title">
    <div>
      <strong>{labelFor(prompt.className)}</strong>
      {#if prompt.className === 'AttachEnergyPrompt'}
        <span>{attachAssignments.length}/{maxSelections} assigned</span>
      {:else}
        <span>{labelFor(prompt.message || prompt.type)}</span>
      {/if}
    </div>
    {#if prompt.className === 'AttachEnergyPrompt'}
      <button type="button" on:click={() => (hidden = true)}>Hide</button>
    {/if}
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
    {#if autoContinue}
      <p class="prompt-hint">Auto-continues in 3 seconds.</p>
    {/if}
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
  {:else if ['SelectOptionPrompt', 'SelectPrompt'].includes(prompt.className) && isMulliganDrawPrompt}
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
    <div class="prompt-actions">
      <button disabled={resolving} on:click={submitMulliganDraw}>Continue</button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
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
    <div class="prize-prompt-grid">
      {#each prizeChoices as prize}
        <button
          type="button"
          class="prize-choice-card"
          class:selected={selectedIndexes.includes(prize.index)}
          class:blocked={!isIndexSelectable(prize.index)}
          disabled={resolving || !isIndexSelectable(prize.index)}
          on:click={() => toggleIndex(prize.index)}
        >
          {#if prize.cards?.[0]}
            <CardTile card={prize.cards[0]} compact />
          {:else}
            <CardTile card={undefined} compact faceDown />
          {/if}
          <span>Prize {prize.index + 1}</span>
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
  {:else if prompt.className === 'ChooseCardsPrompt' && cards.length}
    <div class="search-selection">
      <div class="search-selection-meta">
        <strong>Selected</strong>
        <span>{selectedIndexes.length}/{maxSelections}</span>
      </div>
      <div class="selected-card-slots" aria-label="Selected cards">
        {#each selectedSlots as slot, slotIndex}
          {#if slot}
            <button
              type="button"
              class="selected-card-slot filled"
              disabled={resolving}
              title={`Remove ${slot.card.fullName ?? slot.card.name}`}
              on:click={() => toggleIndex(slot.index)}
            >
              <CardTile card={slot.card} compact />
            </button>
          {:else}
            <div class="selected-card-slot empty">
              <span>{slotIndex + 1}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="search-card-grid">
      {#each cards as card, index}
        <button
          type="button"
          class:selected={selectedIndexes.includes(card.index ?? index)}
          class:blocked={!isIndexSelectable(card.index ?? index)}
          disabled={resolving || !isIndexSelectable(card.index ?? index)}
          on:click={() => toggleIndex(card.index ?? index)}
        >
          <CardTile card={card} compact />
        </button>
      {/each}
    </div>
    <div class="prompt-actions search-actions">
      <button type="button" on:click={() => (hidden = true)}>Hide</button>
      <button disabled={resolving || selectedIndexes.length < minSelections} on:click={submitSelectedIndexes}>Confirm selection</button>
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
  {:else if prompt.className === 'AttachEnergyPrompt'}
    <div class="attach-energy-ui">
      <div class="attach-energy-pane">
        <div class="attach-energy-list">
          {#each cards as card, index}
            {@const energyIndex = card.index ?? index}
            {@const assignment = attachAssignmentFor(energyIndex)}
            <button
              type="button"
              class="attach-energy-card"
              class:selected={activeAttachEnergyIndex === energyIndex}
              class:assigned={!!assignment}
              class:blocked={!attachEnergyAvailable(energyIndex) && !assignment}
              disabled={resolving || (!attachEnergyAvailable(energyIndex) && !assignment)}
              draggable={!resolving && attachEnergyAvailable(energyIndex)}
              title={assignment ? `Assigned to ${targetLabel(assignment.target)}` : `Select ${card.fullName ?? card.name}`}
              on:click={() => (assignment ? removeAttachAssignment(energyIndex) : chooseAttachEnergy(energyIndex))}
              on:dragstart={(event) => dragAttachEnergy(event, energyIndex)}
            >
              <CardTile card={card} compact />
              {#if assignment}
                <span class="attach-assignment-label">{targetLabel(assignment.target)}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
    <div class="prompt-actions">
      <button disabled={resolving || attachAssignments.length === 0} on:click={resetAttachAssignments}>Reset</button>
      <button disabled={resolving || attachAssignments.length < minSelections} on:click={submitAttachEnergy}>Attach</button>
      {#if options.allowCancel}
        <button disabled={resolving} on:click={() => submit(null)}>Cancel</button>
      {/if}
    </div>
  {:else if ['DiscardEnergyPrompt', 'MoveEnergyPrompt'].includes(prompt.className)}
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

</section>
{/if}
