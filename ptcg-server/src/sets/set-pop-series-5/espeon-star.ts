import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class EspeonStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Purple Ray',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Espeon Star from your hand onto your Bench, you may use this power. Each Active Pokémon (both yours and your opponent\'s) is now Confused.'
  }];

  public attacks = [
    {
      name: 'Psychic Boom',
      cost: [P, P, C],
      damage: 30,
      text: 'Does 30 damage plus 10 more damage for each Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'P5';
  public name: string = 'Espeon Star';
  public fullName: string = 'Espeon Star P5';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) { return state; }

        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      });

    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === opponent.active) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, cardList);
          store.reduceEffect(state, checkProvidedEnergy);

          const blockedCards: Card[] = [];

          checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(CardType.ANY)) {
              blockedCards.push(em.card);
            }
          });

          const damagePerEnergy = 10;
          effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
        }
      });
    }

    return state;
  }

}
