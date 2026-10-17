import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Forretress extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pineco';
  public hp: number = 90;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Iron Shell',
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a basic Energy card from your hand to Forretress (excluding effects of attacks), you may flip a coin. If tails, put 2 damage counters on each Pokémon (both yours and your opponent\'s) (excluding any Forretress).'
  }];

  public attacks = [{
    name: 'Explosion',
    cost: [M, M, C, C],
    damage: 100,
    text: 'Forretress does 40 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Forretress';
  public fullName: string = 'Forretress LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Iron Shell
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      if (!player.hand.cards.includes(effect.energyCard)) {
        return state;
      }
      if (effect.energyCard.energyType !== EnergyType.BASIC) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, wantToFlip => {
        if (!wantToFlip) {
          return;
        }
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            return;
          }
          const applyCounters = (p: typeof player, playerType: PlayerType) => {
            p.forEachPokemon(playerType, (cardList, card) => {
              if (card.name === 'Forretress') {
                return;
              }
              store.reduceEffect(
                state,
                new PlaceDamageCountersEffect(player, cardList, 20, this, this.powers[0]),
              );
            });
          };
          applyCounters(player, PlayerType.BOTTOM_PLAYER);
          applyCounters(StateUtils.getOpponent(state, player), PlayerType.TOP_PLAYER);
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Explosion
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
    }

    return state;
  }
}
