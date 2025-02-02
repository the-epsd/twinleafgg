import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Lurantis extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Fomantis';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Sunny Day',
    powerType: PowerType.ABILITY,
    text: 'The attacks of your [G] Pokémon and [R] Pokémon do 20 more damage to your opponent\'s Active Pokémon(before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Solar Beam',
    cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public set: string = 'SMP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'SM25';
  public name: string = 'Lurantis';
  public fullName: string = 'Lurantis SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const hasLurantisInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfLurantisInPlay = 0;

      if (hasLurantisInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfLurantisInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if ((checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS) || checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE)) && effect.target === opponent.active) {
        effect.damage += 20 * numberOfLurantisInPlay;
      }

    }

    return state;
  }
}