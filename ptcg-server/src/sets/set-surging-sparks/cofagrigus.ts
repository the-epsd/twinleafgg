import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';

export class Cofagrigus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 120;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Law of the Underworld',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Put 6 damage counters on each Pokémon that has an Ability (both yours and your opponent\'s).'
    },
    {
      name: 'Spooky Shot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    },
  ];

  public set: string = 'SSP';
  public setNumber = '83';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Law of the Underworld
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        // Check if the Pokemon has an Ability
        const powersEffect = new CheckPokemonPowersEffect(player, card);
        state = store.reduceEffect(state, powersEffect);
        if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
          // Put 6 damage counters on the Pokemon
          const damageEffect = new PutCountersEffect(effect, 60);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        // Check if the Pokemon has an Ability
        const powersEffect = new CheckPokemonPowersEffect(opponent, card);
        state = store.reduceEffect(state, powersEffect);
        if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
          // Put 6 damage counters on the Pokemon
          const damageEffect = new PutCountersEffect(effect, 60);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}