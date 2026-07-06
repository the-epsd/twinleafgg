import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';
import { AFTER_ATTACK, COIN_FLIP_PROMPT, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Yanma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Shockwave',
      cost: [G],
      damage: 0,
      text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Pokémon. Don\'t apply Weakness and Resistance. Then, if your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon.'
    },
    {
      name: 'Swift',
      cost: [G, G, G],
      damage: 30,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Pokémon Powers, or any other effects on the Defending Pokémon.'
    }
  ];

  public set: string = 'N2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Yanma';
  public fullName: string = 'Yanma N2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
            const damageEffect = new PutDamageEffect(effect, 10);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          });
        }
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (!opponentHasBenched) {
        return state;
      }

      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 30);
    }

    return state;
  }
}