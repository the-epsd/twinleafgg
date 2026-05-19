<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { PokemonSlotView } from '../game/types';

  export let slot: PokemonSlotView;
  export let active = false;
  export let canDrop = false;
  export let promptSelectable = false;
  export let promptSelected = false;
  export let placement = '';

  const basicEnergyIcons: Array<[RegExp, string]> = [
    [/\bGrass Energy\b/i, 'grass'],
    [/\bFire Energy\b/i, 'fire'],
    [/\bWater Energy\b/i, 'water'],
    [/\bLightning Energy\b/i, 'lightning'],
    [/\bPsychic Energy\b/i, 'psychic'],
    [/\bFighting Energy\b/i, 'fighting'],
    [/\bDarkness Energy\b/i, 'darkness'],
    [/\bDark Energy\b/i, 'darkness'],
    [/\bMetal Energy\b/i, 'metal'],
    [/\bFairy Energy\b/i, 'fairy'],
    [/\bColorless Energy\b/i, 'colorless'],
  ];

  const customEnergyIcons: Record<string, string> = {
    'Double Turbo Energy': '/assets/energy/double-turbo.png',
    'Jet Energy': '/assets/energy/jet.png',
    'Gift Energy': '/assets/energy/gift.png',
    'Mist Energy': '/assets/energy/mist.png',
    'Luminous Energy': '/assets/energy/luminous.webp',
    'Reversal Energy': '/assets/energy/reversal.webp',
    'Therapeutic Energy': '/assets/energy/therapeutic.webp',
    'Medical Energy': '/assets/energy/medical.webp',
    'Boomerang Energy': '/assets/energy/boomerang.webp',
    'Spiky Energy': '/assets/energy/spiky.webp',
    "Team Rocket's Energy": '/assets/energy/team-rockets.webp',
    'Prism Energy': '/assets/energy/prism.webp',
    'Ignition Energy': '/assets/energy/ignition.webp',
    'Enriching Energy': '/assets/energy/enriching.webp',
    'Legacy Energy': '/assets/energy/legacy.png',
    'Neo Upper Energy': '/assets/energy/neo-upper.png',
    'Rock Fighting Energy': '/assets/energy/rock-fighting.webp',
    'Growth Grass Energy': '/assets/energy/growth-grass.webp',
    'Telepath Psychic Energy': '/assets/energy/telepath-psychic.webp',
  };

  $: remainingHp = slot.hp ? Math.max(0, slot.hp - slot.damage) : 0;
  $: stackedEnergy = slot.energy.length > 4;

  function energyIconSrc(card: { name?: string; fullName?: string }) {
    const name = card.name || card.fullName || '';
    if (customEnergyIcons[name]) {
      return customEnergyIcons[name];
    }
    const basic = basicEnergyIcons.find(([pattern]) => pattern.test(name));
    return basic ? `/assets/energy-icons/${basic[1]}.webp` : '/assets/energy-icons/colorless.webp';
  }

  function energyStackStyle(index: number) {
    if (!stackedEnergy) {
      return '';
    }
    const progress = slot.energy.length <= 1 ? 0 : index / (slot.energy.length - 1);
    const offsetPercent = progress * 75;
    const offsetPixels = progress * 1.5;
    return `--energy-offset: calc(${offsetPercent}% + ${offsetPixels}px); --energy-z: ${index + 1};`;
  }
</script>

<button
  type="button"
  class:active
  class:empty={slot.empty}
  class:can-drop={canDrop}
  class:prompt-selectable={promptSelectable}
  class:prompt-selected={promptSelected}
  class={`board-slot ${placement}`}
  data-testid={`slot-${slot.ownerIndex}-${slot.slot}-${slot.index}`}
  title={slot.pokemon?.fullName ?? (slot.slot === 'active' ? 'Active' : `Bench ${slot.index + 1}`)}
  on:click
  on:dragover
  on:drop
>
  <div class="slot-label">{slot.slot === 'active' ? 'Active' : `B${slot.index + 1}`}</div>

  {#if slot.pokemon}
    <CardTile card={slot.pokemon} />
    {#if slot.energy.length}
      <div class="energy-badges" class:stacked-energy={stackedEnergy} title={`${slot.energy.length} attached energy`}>
        {#each slot.energy as energy, energyIndex}
          <img
            src={energyIconSrc(energy)}
            alt={energy.name || 'Energy'}
            class:pending-energy={(energy as any).pendingAttach}
            style={energyStackStyle(energyIndex)}
          />
        {/each}
      </div>
    {/if}
    <div class="slot-badges">
      {#if slot.hp}
        <span>{remainingHp}/{slot.hp}</span>
      {/if}
      {#if slot.damage}
        <span class="damage">{slot.damage}</span>
      {/if}
      {#if slot.tools.length}
        <span>{slot.tools.length} T</span>
      {/if}
      {#if slot.specialConditions.length}
        <span>{slot.specialConditions.length} S</span>
      {/if}
    </div>
  {:else}
    <div class="empty-zone"></div>
  {/if}
</button>
