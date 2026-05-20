<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import { labelFor } from '../../game/labels';
  import type { AttachAssignment } from '../../game/preview';
  import { extractPromptCards, promptBlockedIndexes, promptOptions } from '../../game/prompts';
  import { getAttachTargets, sameTarget } from '../../game/targets';
  import type { GameView, PromptView } from '../../game/types';

  type Props = {
    game: GameView;
    prompt: PromptView;
    resolving?: boolean;
    activeAttachEnergyIndex?: number | null;
    attachAssignments?: AttachAssignment[];
    onresolve: (value: unknown) => void;
    onattachEnergySelect: (index: number | null) => void;
    onattachEnergyUnassign: (index: number) => void;
    onattachEnergyReset: () => void;
  };

  let {
    game,
    prompt,
    resolving = false,
    activeAttachEnergyIndex = null,
    attachAssignments = [],
    onresolve,
    onattachEnergySelect,
    onattachEnergyUnassign,
    onattachEnergyReset,
  }: Props = $props();

  let hidden = $state(false);
  let promptKey = $state('');
  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(prompt.fields));
  let selectionPoolSize = $derived(cards.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let minSelections = $derived(normalizeSelectionLimit(options.min, 0));
  let blockedIndexes = $derived(new Set<number>(promptBlockedIndexes(prompt)));
  let attachTargets = $derived(getAttachTargets(game, prompt));

  $effect(() => {
    const key = `${prompt.id}:${prompt.className}`;
    if (promptKey !== key) {
      promptKey = key;
      hidden = false;
    }
  });

  function submitAttachEnergy() {
    if (attachAssignments.length >= minSelections) {
      onresolve(attachAssignments.map((assignment) => ({ to: assignment.target, index: assignment.energyIndex })));
    }
  }

  function chooseAttachEnergy(index: number) {
    onattachEnergySelect(index);
  }

  function removeAttachAssignment(index: number) {
    onattachEnergyUnassign(index);
  }

  function resetAttachAssignments() {
    onattachEnergyReset();
  }

  function attachEnergyAvailable(index: number) {
    return !blockedIndexes.has(index) && !attachAssignments.some((assignment) => assignment.energyIndex === index);
  }

  function dragAttachEnergy(event: DragEvent, index: number) {
    event.dataTransfer?.setData('text/plain', String(index));
    event.dataTransfer?.setData('application/x-twinleaf-energy-index', String(index));
    event.dataTransfer?.setDragImage?.((event.currentTarget as HTMLElement), 24, 32);
    onattachEnergySelect(index);
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function attachAssignmentFor(index: number) {
    return attachAssignments.find((assignment) => assignment.energyIndex === index);
  }

  function targetLabel(target: AttachAssignment['target']) {
    return attachTargets.find((item) => sameTarget(item.target, target))?.label ?? 'selected Pokemon';
  }
</script>

{#if hidden}
  <section class="prompt-panel prompt-panel-collapsed">
    <button type="button" onclick={() => (hidden = false)}>Show</button>
  </section>
{:else}
  <section class="prompt-panel attach-energy-prompt">
    <div class="prompt-title">
      <div>
        <strong>{labelFor(prompt.className)}</strong>
        <span>{attachAssignments.length}/{maxSelections} assigned</span>
      </div>
      <button type="button" onclick={() => (hidden = true)}>Hide</button>
    </div>
    {#if !prompt.supported}
      <p class="prompt-warning">{prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.'}</p>
    {/if}

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
              onclick={() => (assignment ? removeAttachAssignment(energyIndex) : chooseAttachEnergy(energyIndex))}
              ondragstart={(event) => dragAttachEnergy(event, energyIndex)}
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
      <button disabled={resolving || attachAssignments.length === 0} onclick={resetAttachAssignments}>Reset</button>
      <button disabled={resolving || attachAssignments.length < minSelections} onclick={submitAttachEnergy}>Attach</button>
      {#if options.allowCancel}
        <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
      {/if}
    </div>
  </section>
{/if}
