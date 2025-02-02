import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, StateUtils } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Toxic Gas',
    powerType: PowerType.POKEMON_POWER,
    text: 'Ignore all Pokémon Powers other than Toxic Gases. This power stops working while Muk is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [
    {
      name: 'Sludge',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Muk';

  public fullName: string = 'Muk FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEMON_POWER && effect.power.name !== 'Toxic Gas') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.includes(SpecialCondition.ASLEEP) ||
        cardList.specialConditions.includes(SpecialCondition.CONFUSED) ||
        cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this && cardList.specialConditions.length > 0) {
          return state;
        }
      });

      let isMukInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMukInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isMukInPlay = true;
        }
      });

      if (!isMukInPlay) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }
    return state;
  }
}