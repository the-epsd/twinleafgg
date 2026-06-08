import type { Attack, Card, CardList, PokemonCard, Power } from 'ptcg-server';
import { CardTag, CardType, PokemonCardList, PowerType, Stage, SuperType } from 'ptcg-server';
import i18n from '../i18n/i18n';

const CHARACTER_NAME_PREFIXES = [
  "Marnie's",
  "Iono's",
  "Ethan's",
  "Steven's",
  "Cynthia's",
  "Arven's",
  "N's",
  "Hop's",
  "Team Rocket's",
  "Lillie's",
  "Larry's",
  "Misty's",
  "Brock's",
  "Blaine's",
  "Erika's",
  "Giovanni's",
  "Lt. Surge's",
  "Rocket's",
  "Sabrina's",
  "Koga's",
] as const;

export function parseCardName(name: string): { prefix: string | null; rest: string } {
  for (const character of CHARACTER_NAME_PREFIXES) {
    if (name.startsWith(character)) {
      return { prefix: character, rest: name.substring(character.length).trim() };
    }
  }
  return { prefix: null, rest: name };
}

const energyImageMap: Record<string, string> = {
  D: 'darkness',
  Y: 'fairy',
  F: 'fighting',
  R: 'fire',
  G: 'grass',
  L: 'lightning',
  M: 'metal',
  P: 'psychic',
  C: 'colorless',
  W: 'water',
  N: 'dragon',
};

const ENERGY_ICON_SIZE = '18px';

/** Inline [R]/[W]/… tokens → energy icon imgs (paths under /public/assets). No vertical translate so icons align with description text. */
export function transformEnergyText(text: string): string {
  return text.replace(/\[([WFYRGLPMDCN])\]/g, (_match, type: string) => {
    const slug = energyImageMap[type];
    if (!slug) {
      return _match;
    }
    return `<img align="middle" src="/assets/energy-icons/${slug}.webp" alt="${slug} Energy" width="${ENERGY_ICON_SIZE}" style="vertical-align: -0.2em">`;
  });
}

export function getCardsWithSameName(catalog: Card[], card: Card): Card[] {
  return catalog.filter((c) => c.name === card.name && c.fullName !== card.fullName);
}

function cardPowers(card: Card): Power[] {
  const p = (card as unknown as { powers?: Power[] }).powers;
  if (!Array.isArray(p)) {
    return [];
  }
  return p.filter((x) => !x.isFossil);
}

function cardAttacks(card: Card): Attack[] {
  const a = (card as unknown as { attacks?: Attack[] }).attacks;
  return Array.isArray(a) ? a : [];
}

function pokemonCardListTools(cardList: CardList): Card[] {
  if (cardList instanceof PokemonCardList) {
    return cardList.tools;
  }
  const tools = (cardList as unknown as { tools?: Card[] }).tools;
  return Array.isArray(tools) ? tools : [];
}

export function isToolCardInList(card: Card, cardList?: CardList): boolean {
  if (!cardList) {
    return false;
  }
  return pokemonCardListTools(cardList).includes(card);
}

function getMainPokemonCard(card: Card, cardList: CardList): Card {
  const tools = pokemonCardListTools(cardList);
  const pokemons = cardList.cards.filter(
    (c) => c.superType === SuperType.POKEMON && !tools.includes(c),
  );
  return pokemons[pokemons.length - 1] ?? card;
}

function addToolPowers(powers: Power[], tools: Card[]): Power[] {
  let out = powers;
  for (const tool of tools) {
    if (tool.powers && tool.powers.length > 0) {
      const nonFossil = tool.powers.filter((power) => !power.isFossil);
      if (tool.superType !== SuperType.POKEMON) {
        out = [...out, ...nonFossil];
      }
    }
  }
  return out;
}

function addToolAttacks(attacks: Attack[], tools: Card[]): Attack[] {
  let out = attacks;
  for (const tool of tools) {
    if (tool.attacks && tool.attacks.length > 0) {
      if (tool.superType !== SuperType.POKEMON) {
        out = [...out, ...tool.attacks];
      }
    }
  }
  return out;
}

/**
 * Powers shown in the card pane — matches Angular `CardInfoPaneComponent.getDisplayPowers`
 * (main Pokémon, evolution stages when enabled, attached trainers, and tool abilities).
 */
export function getDisplayPowers(card: Card, cardList?: CardList): Power[] {
  if (card.superType === SuperType.POKEMON) {
    if (isToolCardInList(card, cardList)) {
      return cardPowers(card);
    }

    if (cardList?.cards?.length) {
      const tools = pokemonCardListTools(cardList);
      const viewingSpecificCard = cardList.cards.includes(card);

      if (viewingSpecificCard) {
        return addToolPowers(cardPowers(card), tools);
      }

      const mainCard = getMainPokemonCard(card, cardList);
      let powers = cardPowers(mainCard);

      if (cardList instanceof PokemonCardList && cardList.showAllStageAbilities) {
        for (const c of cardList.cards) {
          if (c.superType === SuperType.POKEMON && c !== mainCard && !tools.includes(c)) {
            powers = [...powers, ...cardPowers(c)];
          }
        }
      }

      for (const c of cardList.cards) {
        if (c.superType === SuperType.TRAINER) {
          powers = [...powers, ...cardPowers(c)];
        }
      }

      return addToolPowers(powers, tools);
    }

    return cardPowers(card);
  }

  return cardPowers(card);
}

/**
 * Attacks shown in the card pane — matches Angular `CardInfoPaneComponent.getDisplayAttacks`
 * (main Pokémon, evolution stages when enabled, attached trainers, and tool attacks).
 */
export function getDisplayAttacks(card: Card, cardList?: CardList): Attack[] {
  if (card.superType === SuperType.POKEMON) {
    if (isToolCardInList(card, cardList)) {
      return cardAttacks(card);
    }

    if (cardList?.cards?.length) {
      const tools = pokemonCardListTools(cardList);
      const viewingSpecificCard = cardList.cards.includes(card);

      if (viewingSpecificCard) {
        return addToolAttacks(cardAttacks(card), tools);
      }

      const mainCard = getMainPokemonCard(card, cardList);
      let attacks = cardAttacks(mainCard);

      if (cardList instanceof PokemonCardList && cardList.showAllStageAbilities) {
        for (const c of cardList.cards) {
          if (c.superType === SuperType.POKEMON && c !== mainCard && !tools.includes(c)) {
            attacks = [...attacks, ...cardAttacks(c)];
          }
        }
      }

      for (const c of cardList.cards) {
        if (c.superType === SuperType.TRAINER) {
          attacks = [...attacks, ...cardAttacks(c)];
        }
      }

      return addToolAttacks(attacks, tools);
    }

    return cardAttacks(card);
  }

  return cardAttacks(card);
}

/**
 * Max HP for a Pokémon in play, matching Angular `CardInfoPaneComponent.getComputedHp`:
 * printed HP on the viewed card plus {@link PokemonCardList.hpBonus} (tools, effects, etc.).
 */
export function getComputedHp(card: Card, cardList?: CardList): number | null {
  if (!card || card.superType !== SuperType.POKEMON) {
    return null;
  }
  let hp = 0;
  const printed = (card as PokemonCard).hp;
  if (printed !== undefined && printed !== null) {
    const n = Number(printed);
    if (Number.isFinite(n)) {
      hp = n;
    }
  }
  if (cardList instanceof PokemonCardList) {
    hp += cardList.hpBonus || 0;
  }
  return hp;
}

/**
 * Remaining HP, matching Angular `CardInfoPaneComponent.getCurrentHp`:
 * {@link getComputedHp} minus {@link PokemonCardList.damage}.
 */
export function getCurrentHp(card: Card, cardList?: CardList): number | null {
  const computed = getComputedHp(card, cardList);
  if (computed === null) {
    return null;
  }
  const damage = cardList instanceof PokemonCardList ? cardList.damage : 0;
  return Math.max(0, computed - damage);
}

function pokemonTags(card: PokemonCard): CardTag[] {
  if (card.cardTag?.length) {
    return card.cardTag;
  }
  const loose = (card as unknown as { tags?: CardTag[] }).tags;
  return Array.isArray(loose) ? loose : [];
}

export function stageLabel(card: PokemonCard): string {
  switch (card.stage) {
    case Stage.BASIC:
      return pokemonTags(card).includes(CardTag.BABY)
        ? i18n.t('CARDS_BABY_POKEMON')
        : i18n.t('CARDS_BASIC');
    case Stage.RESTORED:
      return i18n.t('CARDS_RESTORED');
    case Stage.STAGE_1:
      return i18n.t('CARDS_STAGE_1');
    case Stage.STAGE_2:
      return i18n.t('CARDS_STAGE_2');
    case Stage.MEGA:
      return i18n.t('CARDS_MEGA');
    case Stage.BREAK:
      return i18n.t('CARDS_BREAK');
    case Stage.LV_X:
      return i18n.t('CARDS_LV_X');
    case Stage.VMAX:
      return i18n.t('CARDS_VMAX');
    case Stage.VSTAR:
      return i18n.t('CARDS_VSTAR');
    case Stage.VUNION:
      return i18n.t('CARDS_VUNION');
    case Stage.LEGEND:
      return i18n.t('CARDS_LEGEND');
    default:
      return '';
  }
}

export function powerTypeLabel(powerType: PowerType): string {
  switch (powerType) {
    case PowerType.TRAINER_ABILITY:
    case PowerType.ENERGY_ABILITY:
      return '';
    case PowerType.ABILITY:
      return i18n.t('CARDS_ABILITY');
    case PowerType.POKEPOWER:
      return i18n.t('CARDS_POKE_POWER');
    case PowerType.POKEMON_POWER:
      return i18n.t('CARDS_POKEMON_POWER');
    case PowerType.POKEBODY:
      return i18n.t('CARDS_POKE_BODY');
    case PowerType.ANCIENT_TRAIT:
      return i18n.t('CARDS_ANCIENT_TRAIT');
    default:
      return '';
  }
}

/** Map CardType to energy.component.scss [type="…"] attribute value. */
export function cardTypeToEnergyAttr(type: CardType): string {
  switch (type) {
    case CardType.NONE:
    case CardType.ANY:
      return 'energyless';
    case CardType.COLORLESS:
      return 'colorless';
    case CardType.GRASS:
      return 'grass';
    case CardType.FIGHTING:
      return 'fighting';
    case CardType.PSYCHIC:
      return 'psychic';
    case CardType.WATER:
      return 'water';
    case CardType.LIGHTNING:
      return 'lightning';
    case CardType.METAL:
      return 'metal';
    case CardType.DARK:
      return 'darkness';
    case CardType.FIRE:
      return 'fire';
    case CardType.DRAGON:
      return 'dragon';
    case CardType.FAIRY:
      return 'fairy';
    default:
      return 'energyless';
  }
}

/** Rule box text exists on trainer/energy and sometimes on Pokémon in serialized data. */
export function getCardRuleText(card: Card): string {
  const t = (card as unknown as { text?: string }).text;
  return typeof t === 'string' ? t : '';
}

export function getDisplayTagLabels(card: Card, showTags: boolean): string[] {
  if (!showTags || card.superType !== SuperType.POKEMON) {
    return [];
  }
  const pokemon = card as PokemonCard;
  if (pokemon.cardTag?.length) {
    return pokemon.cardTag.map(String);
  }
  if (card.tags?.length) {
    return card.tags;
  }
  return [];
}
