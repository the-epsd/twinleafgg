import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, COIN_FLIP_PROMPT, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gabite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gible';
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: C, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gather Up',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for up to 2 Energy cards, show them to your opponent, and put them into your hand.'
  },
  {
    name: 'Marvelous Shine',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads put 4 damage counters on 1 of your opponent\'s Pokémon.If tails, remove 4 damage counters from 1 of your Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Gabite';
  public fullName: string = 'Gabite MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.ENERGY }, { min: 0, max: 2 }, this.attacks[0]);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (!targets || targets.length === 0) {
              return;
            }
            const damageEffect = new PutCountersEffect(effect, 40);
            damageEffect.target = targets[0];
            store.reduceEffect(state, damageEffect);
          });
        } else {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_HEAL,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), results => {
            const targets = results || [];

            if (targets.length >= 0) {
              const healEffect = new HealEffect(player, targets[0], 30);
              store.reduceEffect(state, healEffect);
            }

            return state;
          });
        }
      });
    }

    return state;
  }
}