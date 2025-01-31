import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

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
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.powers.length > 0) {
          if (!IS_ABILITY_BLOCKED(store, state, player, card)) {
            const damageEffect = new PutCountersEffect(effect, 60);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          }
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.powers.length > 0) {
          if (!IS_ABILITY_BLOCKED(store, state, opponent, card)) {
            const damageEffect = new PutCountersEffect(effect, 60);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          }
        }
      });
    }

    return state;
  }
}