import { PlayerType, PowerType, StateUtils } from '../..';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Victini extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public powers = [{
    name: 'Victory Cheer',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Attacks used by your Evolution [R] Pokémon do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public set: string = 'SSP';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public name: string = 'Victini';

  public fullName: string = 'Victini SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this))
        return state;

      const hasVictiniInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfVictiniInPlay = 0;

      if (hasVictiniInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfVictiniInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE) && effect.target === opponent.active) {
        if (effect.player.active.getPokemonCard()?.name !== 'Victini' && effect.player.active.getPokemonCard()?.stage === Stage.STAGE_1) {
          effect.damage += 10 * numberOfVictiniInPlay;
        }
      }
    }

    return state;
  }
}