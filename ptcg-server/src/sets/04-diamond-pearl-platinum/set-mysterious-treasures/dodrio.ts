import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dodrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Doduo';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Fury Attack',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
  },
  {
    name: 'Triple Pick',
    cost: [C, C, C],
    damage: 0,
    text: 'Choose 3 of your opponent\'s Evolved Pokémon. This attack does 30 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Dodrio';
  public fullName: string = 'Dodrio MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fury Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        effect.damage = 10 * results.filter(r => r).length;
      });
    }

    // Triple Pick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const blocked: CardTarget[] = [];
      let evolvedCount = 0;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card.stage === Stage.BASIC) {
          blocked.push(target);
        } else {
          evolvedCount += 1;
        }
      });

      if (evolvedCount === 0) {
        return state;
      }

      const max = Math.min(3, evolvedCount);
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: max, max, allowCancel: false, blocked }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, targets);
      });
    }

    return state;
  }
}
