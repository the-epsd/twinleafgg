import { getPrefabById } from '../prefabs/catalog';
import { MissingPrefabError, matchEffectText, matchedToSelected } from '../prefabs/matcher';
import { findServerEffect } from '../serverEffects';
import type {
  AttackDraft,
  CardDraft,
  EnergyShort,
  EffectKind,
  PowerDraft,
  SelectedPrefab,
} from '../types';

function toPascalClassName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

export function parseEnergyCost(input: string): EnergyShort[] {
  const cleaned = input.toUpperCase().replace(/ANY/g, 'A').replace(/[^GRWLPFDMYNCA]/g, '');
  return cleaned.split('') as EnergyShort[];
}

function formatEnergyType(type: EnergyShort): string {
  // The card codebase exposes these short aliases globally from card-types.ts.
  // Keep generated cards consistent with the established [L, C, F] style.
  const aliases: Record<EnergyShort, string> = {
    G: 'G',
    R: 'R',
    W: 'W',
    L: 'L',
    P: 'P',
    F: 'F',
    D: 'D',
    M: 'M',
    Y: 'Y',
    N: 'N',
    C: 'C',
    A: 'CardType.ANY',
  };
  return aliases[type];
}

function formatEnergyArray(types: EnergyShort[]): string {
  if (types.length === 0) return '[]';
  return `[${types.map(formatEnergyType).join(', ')}]`;
}

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function mergeNamedImports(lines: string[]): string[] {
  const named = new Map<string, Set<string>>();
  const other: string[] = [];
  for (const line of lines) {
    const match = line.match(/^import \{ ([^}]+) \} from '([^']+)';$/);
    if (!match) {
      other.push(line);
      continue;
    }
    const names = named.get(match[2]) ?? new Set<string>();
    match[1].split(',').map(name => name.trim()).filter(Boolean).forEach(name => names.add(name));
    named.set(match[2], names);
  }
  return [
    ...[...named.entries()].map(([from, names]) => `import { ${[...names].sort().join(', ')} } from '${from}';`),
    ...other,
  ];
}

function fullNameFor(draft: CardDraft): string {
  const name = draft.name.trim();
  const set = draft.set.trim();
  if (!name) return '';
  if (!set) return name;
  return `${name} ${set}`;
}

function classNameFor(draft: CardDraft): string {
  if (draft.className.trim()) return draft.className.trim();
  return toPascalClassName(draft.name) || 'NewCard';
}

function collectImports(
  attacks: AttackDraft[],
  powers: PowerDraft[],
  hasPowers: boolean,
  hasAttacks: boolean,
  hasEffects: boolean,
  trainerPrefabs: SelectedPrefab[] = []
): { fromGame: Set<string>; lines: string[]; markers: Set<string>; flags: Set<string> } {
  const fromGame = new Set<string>(hasEffects ? ['StoreLike', 'State'] : []);
  const prefabImports = new Map<string, Set<string>>();
  const extraImportLines = new Set<string>();
  const markers = new Set<string>();
  const flags = new Set<string>();

  const addSelected = (selected: SelectedPrefab[], kind: EffectKind, index: number) => {
    for (const sel of selected) {
      const prefab = getPrefabById(sel.prefabId);
      if (!prefab) continue;
      if (prefab.importNames.length > 0) {
        const set = prefabImports.get(prefab.importFrom) ?? new Set();
        for (const name of prefab.importNames) set.add(name);
        prefabImports.set(prefab.importFrom, set);
      }
      for (const line of prefab.extraImports ?? []) {
        extraImportLines.add(line);
      }
      if (prefab.id === 'USE_ABILITY_ONCE_PER_TURN') {
        markers.add(sel.params.marker || 'ABILITY_USED_MARKER');
      }
      if (prefab.id === 'SWITCH_ACTIVE_WITH_BENCHED_SELF') {
        flags.add(`usedSwitchAttack${index}`);
      }
      if (kind === 'attack') {
        const set = prefabImports.get('../../game/store/prefabs/prefabs') ?? new Set();
        set.add('WAS_ATTACK_USED');
        prefabImports.set('../../game/store/prefabs/prefabs', set);
      }
      if (kind === 'power') {
        const set = prefabImports.get('../../game/store/prefabs/prefabs') ?? new Set();
        set.add('WAS_POWER_USED');
        prefabImports.set('../../game/store/prefabs/prefabs', set);
      }
      if (kind === 'trainer') {
        const set = prefabImports.get('../../game/store/prefabs/trainer-prefabs') ?? new Set();
        set.add('WAS_TRAINER_USED');
        prefabImports.set('../../game/store/prefabs/trainer-prefabs', set);
      }
    }
  };

  if (hasAttacks) {
    attacks.forEach((a, i) => addSelected(a.selectedPrefabs, 'attack', i));
  }
  if (hasPowers) {
    powers.forEach((p, i) => addSelected(p.selectedPrefabs, 'power', i));
  }
  addSelected(trainerPrefabs, 'trainer', 0);

  if (hasPowers) {
    fromGame.add('PowerType');
  }

  const lines: string[] = [];
  for (const [from, names] of prefabImports) {
    if (names.size === 0) continue;
    lines.push(`import { ${[...names].sort().join(', ')} } from '${from}';`);
  }
  for (const line of extraImportLines) {
    lines.push(line);
  }

  return { fromGame, lines, markers, flags };
}

function formatAttack(attack: AttackDraft): string {
  const cost = formatEnergyArray(parseEnergyCost(attack.cost));
  const damage = Number(attack.damage) || 0;
  const lines = [
    `    name: '${escapeString(attack.name)}',`,
    `    cost: ${cost},`,
    `    damage: ${damage},`,
  ];
  if (attack.damageCalculation) {
    lines.push(`    damageCalculation: '${attack.damageCalculation}',`);
  }
  lines.push(`    text: '${escapeString(attack.text)}'`);
  return `{\n${lines.join('\n')}\n  }`;
}

function formatPower(power: PowerDraft): string {
  const boolFlags: Array<[keyof PowerDraft, string]> = [
    ['useWhenInPlay', 'useWhenInPlay'],
    ['useFromHand', 'useFromHand'],
    ['useFromHandToBench', 'useFromHandToBench'],
    ['useFromDiscard', 'useFromDiscard'],
    ['exemptFromAbilityLock', 'exemptFromAbilityLock'],
    ['exemptFromInitialize', 'exemptFromInitialize'],
    ['abilityLock', 'abilityLock'],
    ['barrage', 'barrage'],
    ['knocksOutSelf', 'knocksOutSelf'],
    ['isFossil', 'isFossil'],
  ];
  const body = [
    `    name: '${escapeString(power.name)}',`,
    `    powerType: PowerType.${power.powerType},`,
    `    text: '${escapeString(power.text)}'`,
  ];
  for (const [key, prop] of boolFlags) {
    if (power[key] === true) {
      body[body.length - 1] += ',';
      body.push(`    ${prop}: true`);
    }
  }
  return `{\n${body.join('\n')}\n  }`;
}

function generateReduceEffect(
  draft: CardDraft,
  markers: Set<string>,
  flags: Set<string>
): { source: string; imports: string[]; helpers: string[] } {
  const attacks = draft.hasAttacks ? draft.attacks : [];
  const powers = draft.hasPowers ? draft.powers : [];
  const trainerPrefabs = draft.extends === 'TrainerCard' ? draft.trainerPrefabs : [];
  const trainerServerEffect = draft.extends === 'TrainerCard' ? draft.trainerServerEffect : undefined;

  const body: string[] = [];
  const companions: string[] = [];
  const serverImports = new Set<string>();
  const helpers = new Set<string>();

  powers.forEach((power, index) => {
    if (power.selectedPrefabs.length === 0 && !power.serverEffect) return;
    body.push(`    // ${power.name || `Power ${index + 1}`}`);
    body.push(`    if (WAS_POWER_USED(effect, ${index}, this)) {`);
    if (power.serverEffect) {
      for (const line of power.serverEffect.imports) serverImports.add(line);
      for (const helper of power.serverEffect.helpers ?? []) helpers.add(helper);
      body.push(...power.serverEffect.body.map(line => `      ${line}`));
      body.push(`    }`);
      body.push('');
      return;
    }
    let returns = false;
    const generatedLines: string[] = [];
    for (const sel of power.selectedPrefabs) {
      const prefab = getPrefabById(sel.prefabId);
      if (!prefab) continue;
      const result = prefab.generateCall(sel.params, {
        kind: 'power',
        index,
        powerName: power.name,
      });
      for (const line of result.lines) {
        generatedLines.push(line);
      }
      if (result.returns) returns = true;
      if (prefab.generateCompanions) {
        companions.push(...prefab.generateCompanions(sel.params, { kind: 'power', index, powerName: power.name }));
      }
    }
    if (generatedLines.some(line => /\bplayer\b/.test(line))) {
      body.push(`      const player = effect.player;`);
    }
    body.push(...generatedLines.map(line => `      ${line}`));
    if (!returns) {
      body.push(`      return state;`);
    }
    body.push(`    }`);
    body.push('');
  });

  attacks.forEach((attack, index) => {
    if (attack.selectedPrefabs.length === 0 && !attack.serverEffect) return;
    body.push(`    // ${attack.name || `Attack ${index + 1}`}`);
    body.push(`    if (WAS_ATTACK_USED(effect, ${index}, this)) {`);
    if (attack.serverEffect) {
      for (const line of attack.serverEffect.imports) serverImports.add(line);
      for (const helper of attack.serverEffect.helpers ?? []) helpers.add(helper);
      body.push(...attack.serverEffect.body.map(line => `      ${line}`));
      body.push(`    }`);
      body.push('');
      return;
    }
    let returns = false;
    const generatedLines: string[] = [];
    for (const sel of attack.selectedPrefabs) {
      const prefab = getPrefabById(sel.prefabId);
      if (!prefab) continue;
      const result = prefab.generateCall(sel.params, {
        kind: 'attack',
        index,
        attackName: attack.name,
      });
      for (const line of result.lines) {
        generatedLines.push(line);
      }
      if (result.returns) returns = true;
      if (prefab.generateCompanions) {
        companions.push(...prefab.generateCompanions(sel.params, { kind: 'attack', index, attackName: attack.name }));
      }
    }
    if (generatedLines.some(line => /\bplayer\b/.test(line))) {
      body.push(`      const player = effect.player;`);
    }
    body.push(...generatedLines.map(line => `      ${line}`));
    if (!returns) {
      // no-op — fall through
    }
    body.push(`    }`);
    body.push('');
  });

  if (trainerPrefabs.length > 0 || trainerServerEffect) {
    body.push(`    if (WAS_TRAINER_USED(effect, this)) {`);
    if (trainerServerEffect) {
      for (const line of trainerServerEffect.imports) serverImports.add(line);
      for (const helper of trainerServerEffect.helpers ?? []) helpers.add(helper);
      body.push(...trainerServerEffect.body.map(line => `      ${line}`));
    } else {
      let returns = false;
      const generatedLines: string[] = [];
      for (const sel of trainerPrefabs) {
        const prefab = getPrefabById(sel.prefabId);
        if (!prefab) continue;
        const result = prefab.generateCall(sel.params, {
          kind: 'trainer',
          index: 0,
          powerName: draft.name,
        });
        generatedLines.push(...result.lines);
        if (result.returns) returns = true;
        if (prefab.generateCompanions) {
          companions.push(...prefab.generateCompanions(sel.params, { kind: 'trainer', index: 0, powerName: draft.name }));
        }
      }
      if (generatedLines.some(line => /\bplayer\b/.test(line))) {
        body.push(`      const player = effect.player;`);
      }
      body.push(...generatedLines.map(line => `      ${line}`));
      if (!returns) body.push(`      return state;`);
    }
    body.push(`    }`);
    body.push('');
  }

  for (const companion of companions) {
    body.push(`    ${companion}`);
  }

  const markerLines = [...markers].map(m => `  public readonly ${m} = '${m}';`);
  const flagLines = [...flags].map(f => `  public ${f} = false;`);

  const prefix = [...markerLines, ...flagLines].join('\n');
  const prefixBlock = prefix ? `${prefix}\n` : '';

  if (body.length === 0 && !prefix) {
    return {
      imports: [...serverImports],
      source: '',
      helpers: [...helpers],
    };
  }

  return {
    imports: [...serverImports],
    source: `${prefixBlock}  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
${body.join('\n')}
    return state;
  }`,
    helpers: [...helpers],
  };
}

/**
 * Auto-fill selectedPrefabs from effect text when empty.
 * Unmatched effect text is preserved in the card metadata, but does not emit
 * a reduceEffect prefab block.
 */
export async function resolvePrefabs(draft: CardDraft): Promise<CardDraft> {
  const next: CardDraft = structuredClone(draft);

  if (next.hasAttacks) {
    for (const attack of next.attacks) {
      const text = attack.text.trim();
      if (!text) {
        attack.matchError = undefined;
        continue;
      }
      if (attack.selectedPrefabs.length > 0) {
        attack.matchError = undefined;
        attack.serverEffect = undefined;
        continue;
      }
      try {
        const matched = matchEffectText(text, 'attack');
        attack.selectedPrefabs = matchedToSelected(matched);
        attack.matchError = undefined;
      } catch (e) {
        if (e instanceof MissingPrefabError) {
          attack.selectedPrefabs = [];
          attack.matchError = undefined;
          attack.serverEffect = await findServerEffect(text, 'attack');
          continue;
        }
        throw e;
      }
    }
  }

  if (next.hasPowers) {
    for (const power of next.powers) {
      const text = power.text.trim();
      if (!text) {
        power.matchError = undefined;
        continue;
      }
      if (power.selectedPrefabs.length > 0) {
        power.matchError = undefined;
        power.serverEffect = undefined;
        continue;
      }
      try {
        const matched = matchEffectText(text, 'power');
        power.selectedPrefabs = matchedToSelected(matched);
        power.matchError = undefined;
      } catch (e) {
        if (e instanceof MissingPrefabError) {
          power.selectedPrefabs = [];
          power.matchError = undefined;
          power.serverEffect = await findServerEffect(text, 'power');
          continue;
        }
        throw e;
      }
    }
  }

  if (next.extends === 'TrainerCard') {
    const text = next.trainerText.trim();
    if (next.trainerPrefabs.length > 0) {
      next.trainerServerEffect = undefined;
    }
    if (text && next.trainerPrefabs.length === 0) {
      try {
        const matched = matchEffectText(text, 'trainer');
        next.trainerPrefabs = matchedToSelected(matched);
      } catch (e) {
        if (!(e instanceof MissingPrefabError)) throw e;
        next.trainerServerEffect = await findServerEffect(text, 'trainer');
      }
    }
  }

  if (next.extends === 'EnergyCard' && next.energyText.trim()) {
    next.energyServerEffect = await findServerEffect(next.energyText.trim(), 'energy');
  }

  return next;
}

export async function generateCardSource(draft: CardDraft): Promise<string> {
  const resolved = await resolvePrefabs(draft);
  const className = classNameFor(resolved);
  const fullName = fullNameFor(resolved);

  if (resolved.extends === 'TrainerCard') {
    return generateTrainer(resolved, className, fullName);
  }
  if (resolved.extends === 'EnergyCard') {
    return generateEnergy(resolved, className, fullName);
  }
  return generatePokemon(resolved, className, fullName);
}

function generatePokemon(draft: CardDraft, className: string, fullName: string): string {
  const hasEffects =
    (draft.hasPowers && draft.powers.some(power => power.selectedPrefabs.length > 0 || Boolean(power.serverEffect))) ||
    (draft.hasAttacks && draft.attacks.some(attack => attack.selectedPrefabs.length > 0 || Boolean(attack.serverEffect)));
  const { fromGame, lines: prefabLines, markers, flags } = collectImports(
    draft.attacks,
    draft.powers,
    draft.hasPowers,
    draft.hasAttacks,
    hasEffects
  );

  const imports: string[] = [];
  imports.push(`import { PokemonCard } from '../../game/store/card/pokemon-card';`);
  imports.push(`import { Stage, CardType } from '../../game/store/card/card-types';`);
  const gameImports = [...fromGame].sort();
  if (draft.hasPowers) {
    // PowerType comes from pokemon-types via game barrel or card
  }
  if (hasEffects) {
    imports.push(`import { ${gameImports.join(', ')} } from '../../game';`);
    imports.push(`import { Effect } from '../../game/store/effects/effect';`);
  }
  imports.push(...prefabLines);

  // Deduplicate import lines
  const uniqueImports = mergeNamedImports([...new Set(imports)]);

  const props: string[] = [];
  props.push(`  public stage: Stage = Stage.${draft.stage};`);
  if (draft.tags.trim()) {
    const tags = draft.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => (t.startsWith('CardTag.') ? t : `CardTag.${t}`));
    if (tags.length) {
      uniqueImports.splice(1, 0, `import { CardTag } from '../../game/store/card/card-types';`);
      // merge Stage/CardType/CardTag if possible — keep simple
      props.push(`  public tags = [${tags.join(', ')}];`);
    }
  }
  if (draft.evolvesFrom.trim()) {
    props.push(`  public evolvesFrom: string = '${escapeString(draft.evolvesFrom.trim())}';`);
  }
  props.push(`  public hp: number = ${Number(draft.hp) || 0};`);
  props.push(`  public cardType: CardType = ${formatEnergyType(draft.cardType)};`);

  if (draft.weaknessType) {
    if (draft.weaknessValue === 'x2') {
      props.push(`  public weakness = [{ type: ${formatEnergyType(draft.weaknessType)} }];`);
    } else {
      const value = draft.weaknessValue === '+20' ? 20 : 30;
      props.push(`  public weakness = [{ type: ${formatEnergyType(draft.weaknessType)}, value: ${value} }];`);
    }
  } else {
    props.push(`  public weakness = [];`);
  }

  if (draft.resistanceType) {
    const value = Number(draft.resistanceValue) || -20;
    props.push(`  public resistance = [{ type: ${formatEnergyType(draft.resistanceType)}, value: ${value} }];`);
  }

  props.push(`  public retreat = ${formatEnergyArray(parseEnergyCost(draft.retreat))};`);

  if (draft.hasAttacks && draft.attacks.length > 0) {
    props.push('');
    const attackBodies = draft.attacks.map(formatAttack);
    if (attackBodies.length === 1) {
      props.push(`  public attacks = [${attackBodies[0]}];`);
    } else {
      props.push(`  public attacks = [${attackBodies[0]},\n${attackBodies.slice(1).join(',\n')}];`);
    }
    props.push('');
  }

  if (draft.hasPowers && draft.powers.length > 0) {
    if (!(draft.hasAttacks && draft.attacks.length > 0)) {
      props.push('');
    }
    const powerBodies = draft.powers.map(formatPower);
    if (powerBodies.length === 1) {
      props.push(`  public powers = [${powerBodies[0]}];`);
    } else {
      props.push(`  public powers = [${powerBodies[0]},\n${powerBodies.slice(1).join(',\n')}];`);
    }
    props.push('');
  }

  if (draft.regulationMark.trim()) {
    props.push(`  public regulationMark = '${escapeString(draft.regulationMark.trim())}';`);
  }
  props.push(`  public set: string = '${escapeString(draft.set.trim())}';`);
  props.push(`  public cardImage: string = 'assets/cardback.png';`);
  props.push(`  public setNumber: string = '${escapeString(draft.setNumber.trim())}';`);
  props.push(`  public name: string = '${escapeString(draft.name.trim())}';`);
  props.push(`  public fullName: string = '${escapeString(fullName)}';`);

  const reduce = generateReduceEffect(draft, markers, flags);
  uniqueImports.push(...reduce.imports);

  // Ensure PowerType import when powers exist
  let importBlock = uniqueImports.join('\n');
  if (draft.hasPowers && draft.powers.length > 0 && !importBlock.includes('PowerType')) {
    importBlock += `\nimport { PowerType } from '../../game/store/card/pokemon-types';`;
  }

  const propertyBlock = reduce.source ? props.join('\n') : props.join('\n').replace(/\n+$/, '');
  const reduceBlock = reduce.source ? `\n\n${reduce.source}` : '';
  const helperBlock = reduce.helpers.length > 0 ? `\n\n${reduce.helpers.join('\n\n')}` : '';

  return `${importBlock}${helperBlock}

export class ${className} extends PokemonCard {
${propertyBlock}${reduceBlock}
}
`;
}

function generateTrainer(draft: CardDraft, className: string, fullName: string): string {
  const hasEffects = draft.trainerPrefabs.length > 0 || Boolean(draft.trainerServerEffect);
  const collected = collectImports([], [], false, false, hasEffects, draft.trainerPrefabs);
  const reduce = generateReduceEffect(draft, collected.markers, collected.flags);
  const imports: string[] = [
    `import { TrainerCard } from '../../game/store/card/trainer-card';`,
    `import { TrainerType, CardTag } from '../../game/store/card/card-types';`,
  ];
  if (hasEffects) {
    imports.push(`import { StoreLike, State } from '../../game';`);
    imports.push(`import { Effect } from '../../game/store/effects/effect';`);
  }
  imports.push(...collected.lines, ...reduce.imports);

  const props = [
    `  public trainerType: TrainerType = TrainerType.${draft.trainerType};`,
  ];
  if (draft.tags.trim()) {
    props.push(`  public tags = [${formatTags(draft.tags)}];`);
  }
  props.push(
    `  public set: string = '${escapeString(draft.set.trim())}';`,
    `  public cardImage: string = 'assets/cardback.png';`,
    `  public setNumber: string = '${escapeString(draft.setNumber.trim())}';`,
    `  public name: string = '${escapeString(draft.name.trim())}';`,
    `  public fullName: string = '${escapeString(fullName)}';`,
    `  public text: string = '${escapeString(draft.trainerText)}';`,
  );
  if (draft.regulationMark.trim()) {
    props.push(`  public regulationMark = '${escapeString(draft.regulationMark.trim())}';`);
  }

  const importBlock = mergeNamedImports([...new Set(imports)]).join('\n');
  const reduceBlock = reduce.source
    ? `\n\n${reduce.source}`
    : '';
  const helperBlock = reduce.helpers.length > 0 ? `\n\n${reduce.helpers.join('\n\n')}` : '';
  return `${importBlock}${helperBlock}

export class ${className} extends TrainerCard {
${props.join('\n')}${reduceBlock}
}
`;
}

function generateEnergy(draft: CardDraft, className: string, fullName: string): string {
  const provides = formatEnergyArray(parseEnergyCost(draft.provides));
  const blended = formatEnergyArray(parseEnergyCost(draft.blendedEnergies));
  const effect = draft.energyServerEffect;
  const imports: string[] = [
    `import { EnergyCard } from '../../game/store/card/energy-card';`,
    `import { EnergyType, CardType, CardTag } from '../../game/store/card/card-types';`,
  ];
  if (effect) {
    imports.push(`import { StoreLike, State } from '../../game';`);
    imports.push(`import { Effect } from '../../game/store/effects/effect';`);
    imports.push(...effect.imports);
  }
  const props = [
    `  public provides: CardType[] = ${provides};`,
    `  public energyType = EnergyType.${draft.energyType};`,
  ];
  if (blended !== '[]') {
    props.push(`  public blendedEnergies: CardType[] = ${blended};`);
    props.push(`  public blendedEnergyCount = ${Math.max(1, Number(draft.blendedEnergyCount) || 1)};`);
  }
  if (draft.tags.trim()) {
    props.push(`  public tags = [${formatTags(draft.tags)}];`);
  }
  props.push(
    `  public set: string = '${escapeString(draft.set.trim())}';`,
    `  public cardImage: string = 'assets/cardback.png';`,
    `  public setNumber: string = '${escapeString(draft.setNumber.trim())}';`,
    `  public name: string = '${escapeString(draft.name.trim())}';`,
    `  public fullName: string = '${escapeString(fullName)}';`,
    `  public text: string = '${escapeString(draft.energyText)}';`,
  );
  if (draft.regulationMark.trim()) {
    props.push(`  public regulationMark = '${escapeString(draft.regulationMark.trim())}';`);
  }
  const effectBlock = effect
    ? `\n\n  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {\n${effect.body
        .map(line => `    ${line}`)
        .join('\n')}\n    return state;\n  }`
    : '';
  const helperBlock = effect?.helpers && effect.helpers.length > 0 ? `\n\n${effect.helpers.join('\n\n')}` : '';
  return `${mergeNamedImports([...new Set(imports)]).join('\n')}${helperBlock}

export class ${className} extends EnergyCard {
${props.join('\n')}${effectBlock}
}
`;
}

function formatTags(tags: string): string {
  return tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => (tag.startsWith('CardTag.') ? tag : `CardTag.${tag}`))
    .join(', ');
}
