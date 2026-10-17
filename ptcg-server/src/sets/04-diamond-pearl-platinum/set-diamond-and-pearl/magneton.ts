import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public hp: number = 70;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tri Attack',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
  },
  {
    name: 'Magnetic Ray',
    cost: [M, C, C],
    damage: 40,
    text: 'Before doing damage, you may choose 1 of your opponent\'s Benched Pokémon that has any Energy attached to it and switch that Pokémon with 1 of the Defending Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tri Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        effect.damage = 20 * results.filter(r => r).length;
      });
    }

    // Magnetic Ray
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const blocked: CardTarget[] = [];
      let hasEnergizedBench = false;
      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }
        const hasEnergy = bench.cards.some(c => c instanceof EnergyCard);
        if (!hasEnergy) {
          blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        } else {
          hasEnergizedBench = true;
        }
      });
      if (!hasEnergizedBench) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false, blocked }
          ), chosen => {
            const cardList = chosen[0];
            opponent.switchPokemon(cardList);
          });
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    return state;
  }
}
