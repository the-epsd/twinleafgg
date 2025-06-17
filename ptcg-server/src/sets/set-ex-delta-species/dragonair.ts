import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dragonair extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dratini';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: C }];
  public resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Twister',
    cost: [L, C],
    damage: 20,
    text: 'Flip 2 coins. If both are tails, this attack does nothing. For each heads, discard an Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'DS';
  public name: string = 'Dragonair';
  public fullName: string = 'Dragonair DS';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, (results) => {
        const player = effect.player;
        const opponent = effect.opponent;

        if (results.every(result => !result)) {
          effect.damage = 0;
        }

        const headsCount = results.filter(result => result).length;
        if (headsCount > 0) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: headsCount, max: headsCount, allowCancel: true }
          ), selected => {
            const card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
            return state;
          });
        }
      });
    }

    return state;
  }

}
