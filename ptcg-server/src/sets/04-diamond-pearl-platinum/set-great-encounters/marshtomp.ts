import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Marshtomp extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mudkip';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pound',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Muddy Bomb',
    cost: [F, C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon and 10 damage to each of your opponent\'s other Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Marshtomp';
  public fullName: string = 'Marshtomp GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Muddy Bomb
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) {
          return;
        }
        const primary = targets[0];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, [primary]);

        opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
          if (cardList !== primary && cardList.cards.length > 0) {
            const damageEffect = new PutDamageEffect(effect, 10);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          }
        });
      });
    }

    return state;
  }
}
