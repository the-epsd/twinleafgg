<script lang="ts">
  import ActiveFocus from '../ActiveFocus.svelte';
  import PromptDock from '../prompts/PromptDock.svelte';
  import PromptHost from '../prompts/PromptHost.svelte';
  import PromptIcon from '../prompts/primitives/PromptIcon.svelte';
  import PromptPanel from '../prompts/primitives/PromptPanel.svelte';
  import PromptGalleryBoardDemo from './PromptGalleryBoardDemo.svelte';
  import { labelFor } from '../../game/labels';
  import { canRetreatToSlot } from '../../game/playTargets';
  import {
    attachPromptDemo,
    boardPromptDemos,
    dockPromptDemos,
    promptGalleryCards,
    promptGalleryGame,
    PROMPT_GALLERY_CLASS_NAMES,
    unsupportedPromptDemos,
    type PromptGalleryDemo,
  } from '../../prompt-gallery/fixtures';
  import type { AvailableActionsView, CardTarget, PokemonSlotView } from '../../game/types';

  let results = $state<Record<string, string>>({});
  let detailRetreatChoosing = $state(false);
  let drakloakDetailSlot: PokemonSlotView = $derived({
    ...promptGalleryGame.players[1].bench[1],
    slot: 'active',
    index: 0,
    target: promptGalleryGame.players[1].active.target,
    cards: [
      promptGalleryCards.dreepy,
      promptGalleryCards.drakloak,
      promptGalleryCards.braveryCharm,
      promptGalleryCards.fireEnergy,
    ],
    tools: [promptGalleryCards.braveryCharm],
    energy: [promptGalleryCards.fireEnergy],
  });
  let drakloakBenchTargets = $derived([
    promptGalleryGame.players[1].bench[0],
  ]);
  let drakloakAvailableActions: AvailableActionsView = $derived({
    active: {
      attacks: [{ name: 'Dragon Headbutt', legal: false, reason: 'Needs Psychic Energy.' }],
      abilities: [{ name: 'Recon Directive', legal: true }],
      retreat: { legal: true, targets: [0] },
    },
    bench: [],
  });

  function recordResult(key: string, value: unknown) {
    results = {
      ...results,
      [key]: JSON.stringify(value, null, 2) ?? String(value),
    };
  }

  function noop() {}

  function recordDetailAction(value: unknown) {
    recordResult('pokemon-detail', value);
  }

  function useDetailAbility(name: string, target: CardTarget) {
    recordDetailAction({ action: 'ability', name, target });
  }

  function useDetailAttack(name: string) {
    recordDetailAction({ action: 'attack', name });
  }
</script>

<main class="prompt-gallery">
  <header class="prompt-gallery-header">
    <div>
      <p>Prompt gallery</p>
      <h1>Engine Prompt Review</h1>
    </div>
    <a href="/">Back to game</a>
  </header>

  <nav class="prompt-gallery-nav" aria-label="Prompt gallery sections">
    <a href="#dock-prompts">Dock prompts</a>
    <a href="#pokemon-detail">Pokemon detail</a>
    <a href="#attach-energy">Attach energy</a>
    <a href="#board-prompts">Board prompts</a>
    <a href="#unsupported-prompts">Unsupported states</a>
  </nav>

  <section class="prompt-gallery-summary">
    <div>
      <strong>{PROMPT_GALLERY_CLASS_NAMES.length}</strong>
      <span>prompt classes represented</span>
    </div>
    <p>
      These demos reuse the live prompt components with fixture cards and board state. Click through them to inspect
      selected, hover, resolving-ready, and board-target visuals without playing a match.
    </p>
  </section>

  <section id="dock-prompts" class="gallery-section">
    <div class="gallery-section-heading">
      <h2>Dock Prompts</h2>
      <p>Central overlays, search panels, option prompts, card lists, and ordering prompts.</p>
    </div>

    <div class="gallery-demo-grid">
      {#each dockPromptDemos as demo (demo.key)}
        <article class="gallery-demo-card">
          {@render DemoHeading(demo, results[demo.key])}
          <div class:search-stage={demo.mode === 'search'} class="gallery-dock-stage">
            <PromptDock mode={demo.mode ?? 'default'}>
              <PromptHost
                game={promptGalleryGame}
                prompt={demo.prompt}
                onresolve={(value) => recordResult(demo.key, value)}
                onattachEnergySelect={noop}
                onattachEnergyUnassign={noop}
                onattachEnergyReset={noop}
              />
            </PromptDock>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section id="pokemon-detail" class="gallery-section">
    <div class="gallery-section-heading">
      <h2>Pokemon Detail</h2>
      <p>Action styling for abilities, attacks, retreat cost, and unavailable energy requirements.</p>
    </div>

    <article class="gallery-demo-card">
      <div class="gallery-demo-heading">
        <div>
          <h3>Drakloak TWM</h3>
          <p>One Fire Energy is attached, so Dragon Headbutt is missing Psychic. Retreat is available.</p>
        </div>
        {#if results['pokemon-detail']}
          <pre>{results['pokemon-detail']}</pre>
        {/if}
      </div>
      <div class="gallery-detail-stage">
        <ActiveFocus
          slot={drakloakDetailSlot}
          availableActions={drakloakAvailableActions}
          benchTargets={drakloakBenchTargets}
          canAct
          canRetreatToSlot={canRetreatToSlot}
          close={() => recordDetailAction({ action: 'close' })}
          useAbility={useDetailAbility}
          attack={useDetailAttack}
          startRetreat={() => {
            detailRetreatChoosing = true;
            recordDetailAction({ action: 'start-retreat' });
          }}
        />
        {#if detailRetreatChoosing}
          <div class="gallery-retreat-note">Retreat target mode would highlight valid bench Pokemon on the live board.</div>
        {/if}
      </div>
    </article>
  </section>

  <section id="attach-energy" class="gallery-section">
    <div class="gallery-section-heading">
      <h2>Attach Energy</h2>
      <p>The compact attach prompt plus board target glow and pending energy previews.</p>
    </div>

    <PromptGalleryBoardDemo
      game={promptGalleryGame}
      prompt={attachPromptDemo.prompt}
      title={attachPromptDemo.title}
      description={attachPromptDemo.description}
    />
  </section>

  <section id="board-prompts" class="gallery-section">
    <div class="gallery-section-heading">
      <h2>Board Prompts</h2>
      <p>Prompt strip placement, active Pokemon targeting, bench targeting, damage badges, and selected target glow.</p>
    </div>

    <div class="gallery-board-grid">
      {#each boardPromptDemos as demo (demo.key)}
        <PromptGalleryBoardDemo
          game={promptGalleryGame}
          prompt={demo.prompt}
          title={demo.title}
          description={demo.description}
        />
      {/each}
    </div>
  </section>

  <section id="unsupported-prompts" class="gallery-section">
    <div class="gallery-section-heading">
      <h2>Unsupported States</h2>
      <p>Prompt classes that are currently handled outside the normal prompt host or still need resolver work.</p>
    </div>

    <div class="gallery-demo-grid compact">
      {#each unsupportedPromptDemos as demo (demo.key)}
        <article class="gallery-demo-card">
          {@render DemoHeading(demo, results[demo.key])}
          <div class="gallery-dock-stage compact-stage">
            <PromptPanel
              title={labelFor(demo.prompt.className)}
              subtitle={labelFor(demo.prompt.message || demo.prompt.type)}
              warning={demo.prompt.unsupportedReason}
            >
              {#snippet icon()}<PromptIcon name="hourglass" />{/snippet}
              <p class="prompt-hint">Shown here so the unsupported prompt state can be reviewed with the rest of the system.</p>
              {#snippet actions()}
                <button onclick={() => recordResult(demo.key, null)}>Resolve null</button>
              {/snippet}
            </PromptPanel>
          </div>
        </article>
      {/each}
    </div>
  </section>
</main>

{#snippet DemoHeading(demo: PromptGalleryDemo, result: string | undefined)}
  <div class="gallery-demo-heading">
    <div>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>
    </div>
    {#if result}
      <pre>{result}</pre>
    {/if}
  </div>
{/snippet}

<style>
  .prompt-gallery {
    --board-card-w: clamp(58px, min(8vw, 8.1vh), 104px);
    --card-w: var(--board-card-w);
    --hand-card-w: min(clamp(96px, min(7.8vw, 14.5vh), 150px), calc(var(--board-card-w) * 1.55));
    min-height: 100vh;
    background: var(--app-backdrop-bg);
    color: var(--text-primary);
    padding: 24px clamp(16px, 4vw, 52px) 56px;
  }

  .prompt-gallery-header,
  .prompt-gallery-nav,
  .prompt-gallery-summary,
  .gallery-section {
    max-width: 1440px;
    margin-inline: auto;
  }

  .prompt-gallery-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 18px;
    padding-bottom: 16px;
  }

  .prompt-gallery-header p,
  .prompt-gallery-header h1 {
    margin: 0;
  }

  .prompt-gallery-header p {
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .prompt-gallery-header h1 {
    font-size: clamp(30px, 4vw, 52px);
    line-height: 1.02;
    letter-spacing: 0;
  }

  .prompt-gallery-header a,
  .prompt-gallery-nav a {
    color: var(--text-primary);
    text-decoration: none;
  }

  .prompt-gallery-header a {
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-pill);
    background: var(--surface-toolbar-bg);
    box-shadow: var(--surface-toolbar-shadow);
    padding: 9px 14px;
    font-size: 13px;
    font-weight: 800;
  }

  .prompt-gallery-nav {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 10px 0 8px;
  }

  .prompt-gallery-nav a {
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-pill);
    background: var(--surface-inset-bg);
    padding: 8px 12px;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 800;
  }

  .prompt-gallery-summary {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 16px;
    align-items: center;
    margin-top: 10px;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-lg);
    background: var(--surface-toolbar-bg);
    box-shadow: var(--surface-toolbar-shadow);
    padding: 16px;
  }

  .prompt-gallery-summary div {
    display: grid;
    gap: 2px;
    justify-items: center;
    min-width: 130px;
  }

  .prompt-gallery-summary strong {
    font-size: 34px;
    line-height: 1;
  }

  .prompt-gallery-summary span,
  .prompt-gallery-summary p {
    color: var(--text-secondary);
    font-size: 13px;
  }

  .prompt-gallery-summary p {
    margin: 0;
    line-height: 1.45;
  }

  .gallery-section {
    display: grid;
    gap: 18px;
    margin-top: 34px;
    scroll-margin-top: 18px;
  }

  .gallery-section-heading h2,
  .gallery-section-heading p {
    margin: 0;
  }

  .gallery-section-heading h2 {
    font-size: 24px;
  }

  .gallery-section-heading p {
    margin-top: 4px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .gallery-demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
    gap: 18px;
    align-items: start;
  }

  .gallery-demo-grid.compact {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  }

  .gallery-board-grid {
    display: grid;
    gap: 24px;
  }

  .gallery-demo-card {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .gallery-demo-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(170px, 0.38fr);
    gap: 10px;
    align-items: start;
  }

  .gallery-demo-heading:not(:has(pre)) {
    grid-template-columns: 1fr;
  }

  .gallery-demo-heading h3,
  .gallery-demo-heading p {
    margin: 0;
  }

  .gallery-demo-heading h3 {
    font-size: 17px;
  }

  .gallery-demo-heading p {
    margin-top: 4px;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .gallery-demo-heading pre {
    min-height: 42px;
    max-height: 82px;
    margin: 0;
    overflow: auto;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-md);
    background: var(--surface-inset-bg);
    color: var(--text-muted);
    padding: 8px;
    font-size: 11px;
    line-height: 1.35;
    white-space: pre-wrap;
  }

  .gallery-dock-stage {
    --board-right-rail: 0px;
    --board-top-inset: 0px;
    --board-bottom-inset: 0px;
    --card-w: clamp(70px, 8vw, 104px);
    position: relative;
    min-height: 390px;
    overflow: hidden;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-lg);
    background: var(--surface-toolbar-bg);
    box-shadow: var(--surface-toolbar-shadow);
  }

  .gallery-detail-stage {
    --card-w: clamp(78px, 9vw, 112px);
    position: relative;
    min-height: 520px;
    overflow: hidden;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-lg);
    background: var(--app-backdrop-bg);
    box-shadow: var(--surface-toolbar-shadow);
  }

  .gallery-detail-stage :global(.active-focus-backdrop) {
    background: transparent;
  }

  .gallery-retreat-note {
    position: absolute;
    left: 50%;
    bottom: 18px;
    z-index: 12;
    transform: translateX(-50%);
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-pill);
    background: var(--surface-toolbar-bg);
    color: var(--text-secondary);
    box-shadow: var(--surface-toolbar-shadow);
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
  }

  .gallery-dock-stage.search-stage {
    min-height: 640px;
  }

  .gallery-dock-stage.compact-stage {
    display: grid;
    place-items: center;
    min-height: 330px;
    padding: 18px;
  }

  .gallery-dock-stage :global(.prompt-dock) {
    left: 50%;
    top: 50%;
    width: min(560px, calc(100% - 28px));
    max-height: calc(100% - 28px);
    transform: translate(-50%, -50%);
  }

  .gallery-dock-stage.search-stage :global(.prompt-dock) {
    width: min(1040px, calc(100% - 28px));
    max-height: calc(100% - 28px);
  }

  @media (max-width: 760px) {
    .prompt-gallery {
      padding-inline: 14px;
    }

    .prompt-gallery-header,
    .prompt-gallery-summary,
    .gallery-demo-heading {
      grid-template-columns: 1fr;
    }

    .prompt-gallery-header {
      align-items: start;
    }

    .prompt-gallery-summary {
      display: grid;
    }

    .gallery-demo-heading {
      display: grid;
    }
  }
</style>
