import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorino';
  public hp: number = 130;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Poison Rub',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. Before doing damage, you may switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Pride Attack',
    cost: [P, P, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin for each Nidoqueen on your Bench. This attack does 60 damage plus 30 more damage for each heads.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Nidoking';
  public fullName: string = 'Nidoking SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Rub
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        return state;
      }

      return CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), chosen => {
            if (chosen && chosen.length > 0) {
              opponent.switchPokemon(chosen[0]);
            }
            ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
          });
        } else {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    // Pride Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let nidoqueenCount = 0;
      player.bench.forEach(bench => {
        if (bench.getPokemonCard()?.name === 'Nidoqueen') {
          nidoqueenCount++;
        }
      });
      if (nidoqueenCount === 0) {
        return state;
      }
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, nidoqueenCount, results => {
        effect.damage += 30 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
