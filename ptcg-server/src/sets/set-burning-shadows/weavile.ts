import { PowerType, State, StateUtils, StoreLike, PlayerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weavile extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.DARK;

  public hp: number = 90;

  public retreat = [];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public attacks = [
    {
      name: 'Rule of Evil',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 60 damage to each Pokémon that has an Ability (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Slash',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Weavile';

  public fullName: string = 'Weavile BUS';

  public evolvesFrom = 'Sneasel';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Calculate damage for opponent's Pokemon
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard()) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            const damageEffect = new PutDamageEffect(effect, 60);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          }
        }
      });

      // Calculate damage for player's Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard()) {
          const powersEffect = new CheckPokemonPowersEffect(player, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            const damageEffect = new PutDamageEffect(effect, 60);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          }
        }
      });

      return state;
    }
    return state;
  }
}