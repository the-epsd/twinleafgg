<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import SelectableCard from './primitives/SelectableCard.svelte';
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

  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(prompt.fields));
  let selectionPoolSize = $derived(cards.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let minSelections = $derived(normalizeSelectionLimit(options.min, 0));
  let blockedIndexes = $derived(new Set<number>(promptBlockedIndexes(prompt)));
  let attachTargets = $derived(getAttachTargets(game, prompt));

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

<PromptPanel
  title={labelFor(prompt.className)}
  subtitle={`${attachAssignments.length}/${maxSelections} assigned`}
  variant="compact"
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="energy" />{/snippet}

  <div class="attach-energy-list">
    {#each cards as card, index}
      {@const energyIndex = card.index ?? index}
      {@const assignment = attachAssignmentFor(energyIndex)}
      <SelectableCard
        selected={activeAttachEnergyIndex === energyIndex}
        assigned={!!assignment}
        blocked={!attachEnergyAvailable(energyIndex) && !assignment}
        disabled={resolving || (!attachEnergyAvailable(energyIndex) && !assignment)}
        draggable={!resolving && attachEnergyAvailable(energyIndex)}
        title={assignment ? `Assigned to ${targetLabel(assignment.target)}` : `Select ${card.fullName ?? card.name}`}
        onclick={() => (assignment ? removeAttachAssignment(energyIndex) : chooseAttachEnergy(energyIndex))}
        ondragstart={(event) => dragAttachEnergy(event, energyIndex)}
      >
        <CardTile {card} compact />
        {#if assignment}
          {#snippet label()}{targetLabel(assignment.target)}{/snippet}
        {/if}
      </SelectableCard>
    {/each}
  </div>

  {#snippet actions()}
    <button disabled={resolving || attachAssignments.length === 0} onclick={resetAttachAssignments}>Reset</button>
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    <button class="primary" disabled={resolving || attachAssignments.length < minSelections} onclick={submitAttachEnergy}>
      Confirm
    </button>
  {/snippet}
</PromptPanel>

<style>
  .attach-energy-list {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: clamp(72px, 8vw, 92px);
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 2px 2px 6px;
  }
</style>
