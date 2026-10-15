import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Exeggcute';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'String Bomb',
    cost: [C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip a coin for each basic Energy card attached to Exeggutor and to the Defending Pokémon. This attack does 30 damage times the number of heads.'
  },
  {
    name: 'Nutritional Support',
    cost: [G],
    damage: 0,
    text: 'Search your deck for up to 2 Grass Energy cards and attach them to any of your Pokémon in any way you like. Shuffle your deck afterward.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // String Bomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const countBasics = (list: typeof player.active) =>
        list.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC).length;
      const flips = countBasics(player.active) + countBasics(opponent.active);

      if (flips === 0) {
        effect.damage = 0;
        return state;
      }

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, flips, results => {
        effect.damage = 30 * results.filter(r => r).length;
      });
    }

    // Nutritional Support
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player,
        PlayerType.BOTTOM_PLAYER, SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: true, validCardTypes: [CardType.GRASS] }
      );
    }

    return state;
  }
}
