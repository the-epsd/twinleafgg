import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition, Stage, SuperType } from '../../game/store/card/card-types';
import { Attack, Power, PowerType, Resistance, Weakness } from '../../game/store/card/pokemon-types';
import { EnergyCard, GameError, GameMessage, PokemonCardList, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_POKEMON_POWER_BLOCKED } from '../../game/store/prefabs/prefabs';

const TRANSFORM_POWER: Power = {
  name: 'Transform',
  powerType: PowerType.POKEMON_POWER,
  text: 'If Ditto is your Active Pokémon, treat it as if it were the same card as the Defending Pokémon, including type, Hit Points, Weakness, and so on, except Ditto can\'t evolve, always has this Pokémon Power, and you may treat any Energy attached to Ditto as Energy of any type. Ditto isn\'t a copy of any other Pokémon while Ditto is Asleep, Confused, or Paralyzed.',
};

interface DittoPrintedSnapshot {
  name: string;
  hp: number;
  cardType: CardType[];
  stage: Stage;
  weakness: Weakness[];
  resistance: Resistance[];
  retreat: CardType[];
  attacks: Attack[];
  powers: Power[];
  tags: CardTag[];
}

function cloneCardType(cardType: CardType[]): CardType[] {
  return [...cardType];
}

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [CardType.COLORLESS];
  public weakness: Weakness[] = [{ type: CardType.FIGHTING }];
  public resistance: Resistance[] = [{ type: CardType.PSYCHIC, value: -30 }];
  public retreat: CardType[] = [CardType.COLORLESS];

  public powers: Power[] = [{ ...TRANSFORM_POWER }];
  public attacks: Attack[] = [];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto FO';

  /** Defending Pokémon whose reduceEffect we currently run as `this`. */
  private transformSource: PokemonCard | undefined;
  private checkingPowerBlock = false;
  private readonly printed: DittoPrintedSnapshot = {
    name: 'Ditto',
    hp: 50,
    cardType: [CardType.COLORLESS],
    stage: Stage.BASIC,
    weakness: [{ type: CardType.FIGHTING }],
    resistance: [{ type: CardType.PSYCHIC, value: -30 }],
    retreat: [CardType.COLORLESS],
    attacks: [],
    powers: [{ ...TRANSFORM_POWER }],
    tags: [],
  };

  private isPowerLockProbe(effect: Effect): boolean {
    return effect instanceof PowerEffect && effect.power.name === 'test';
  }

  private findOwnerAndList(state: State): { owner: ReturnType<typeof StateUtils.findOwner>; cardList: PokemonCardList } | undefined {
    try {
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList) || cardList.getPokemonCard() !== this) {
        return undefined;
      }
      return { owner: StateUtils.findOwner(state, cardList), cardList };
    } catch {
      return undefined;
    }
  }

  private getDefendingCopy(store: StoreLike, state: State): PokemonCard | undefined {
    const located = this.findOwnerAndList(state);
    if (!located) {
      return undefined;
    }
    const { owner, cardList } = located;

    if (owner.active !== cardList) {
      return undefined;
    }

    if (
      cardList.specialConditions.includes(SpecialCondition.ASLEEP)
      || cardList.specialConditions.includes(SpecialCondition.CONFUSED)
      || cardList.specialConditions.includes(SpecialCondition.PARALYZED)
    ) {
      return undefined;
    }

    if (!this.checkingPowerBlock) {
      this.checkingPowerBlock = true;
      try {
        if (IS_POKEMON_POWER_BLOCKED(store, state, owner, this)) {
          return undefined;
        }
      } finally {
        this.checkingPowerBlock = false;
      }
    }

    const opponent = StateUtils.getOpponent(state, owner);
    const defending = opponent.active.getPokemonCard();
    if (!defending || defending === this) {
      return undefined;
    }
    return defending;
  }

  private cloneAttacks(attacks: Attack[]): Attack[] {
    return attacks.map(a => ({ ...a, cost: [...(a.cost || [])] }));
  }

  private clonePowers(powers: Power[]): Power[] {
    return powers
      .filter(p => p.name !== 'Transform')
      .map(p => ({ ...p }));
  }

  private applyCopy(copy: PokemonCard): void {
    // Same defending card: keep existing attack/power object identities so in-flight
    // AttackEffect / PowerEffect references stay valid.
    if (this.transformSource === copy) {
      this.hp = copy.hp;
      this.cardType = cloneCardType(copy.cardType);
      this.stage = copy.stage;
      this.weakness = copy.weakness.map(w => ({ ...w })) as Weakness[];
      this.resistance = copy.resistance.map(r => ({ ...r })) as Resistance[];
      this.retreat = [...copy.retreat];
      this.name = copy.name;
      this.tags = [...(copy.tags || [])];
      // Keep cloned attacks/powers; ensure Transform remains last.
      if (!this.powers.some(p => p.name === 'Transform')) {
        this.powers = [...this.powers, { ...TRANSFORM_POWER }];
      }
      return;
    }

    this.transformSource = copy;
    this.hp = copy.hp;
    this.cardType = cloneCardType(copy.cardType);
    this.stage = copy.stage;
    this.weakness = copy.weakness.map(w => ({ ...w })) as Weakness[];
    this.resistance = copy.resistance.map(r => ({ ...r })) as Resistance[];
    this.retreat = [...copy.retreat];
    this.name = copy.name;
    this.tags = [...(copy.tags || [])];
    // Clone so the real Defending Pokémon's WAS_ATTACK/POWER_USED does not also match.
    this.attacks = this.cloneAttacks(copy.attacks || []);
    this.powers = [...this.clonePowers(copy.powers || []), { ...TRANSFORM_POWER }];
  }

  private clearCopy(): void {
    if (this.transformSource === undefined
      && this.name === this.printed.name
      && this.hp === this.printed.hp) {
      return;
    }
    this.transformSource = undefined;
    this.name = this.printed.name;
    this.hp = this.printed.hp;
    this.cardType = cloneCardType(this.printed.cardType);
    this.stage = this.printed.stage;
    this.weakness = this.printed.weakness.map(w => ({ ...w }));
    this.resistance = this.printed.resistance.map(r => ({ ...r }));
    this.retreat = [...this.printed.retreat];
    this.attacks = [];
    this.powers = [{ ...TRANSFORM_POWER }];
    this.tags = [...this.printed.tags];
  }

  private syncTransform(store: StoreLike, state: State): PokemonCard | undefined {
    const copy = this.getDefendingCopy(store, state);
    if (!copy) {
      this.clearCopy();
      return undefined;
    }
    this.applyCopy(copy);
    return copy;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability-lock probes must not re-enter Transform sync (IS_POKEMON_POWER_BLOCKED).
    if (this.isPowerLockProbe(effect)) {
      return state;
    }

    // Ditto can't evolve (Transform exception), even while copying an Evolution.
    if (
      effect instanceof PlayPokemonEffect
      && effect.target.getPokemonCard() === this
      && effect.pokemonCard !== this
    ) {
      throw new GameError(GameMessage.CANNOT_EVOLVE);
    }

    const copy = this.syncTransform(store, state);

    // Rainbow Energy while Transformed.
    if (copy && effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.source.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          const entry = effect.energyMap.find(e => e.card === c);
          if (entry) {
            entry.provides = [CardType.ANY];
          } else {
            effect.energyMap.push({ card: c, provides: [CardType.ANY] });
          }
        }
      });
      if (effect.source instanceof PokemonCardList) {
        effect.source.energies.cards.forEach(c => {
          const entry = effect.energyMap.find(e => e.card === c);
          if (entry) {
            entry.provides = [CardType.ANY];
          } else if (c.superType === SuperType.ENERGY || (c as EnergyCard).energyType !== undefined) {
            effect.energyMap.push({ card: c as EnergyCard, provides: [CardType.ANY] });
          }
        });
      }
    }

    // Run the Defending Pokémon's card logic with `this` bound to Ditto so every
    // `this` / getPokemonCard() === this / marker / ABILITY_USED check just works.
    if (copy) {
      state = copy.reduceEffect.call(this, store, state, effect);
    }

    return state;
  }
}
