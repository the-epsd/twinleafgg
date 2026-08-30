import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../../game/store/card/card-types';
import {
  CardTarget,
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mandibuzz extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vullaby';
  public cardType: CardType[] = [D];
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bone Sniper',
    cost: [D],
    damage: 0,
    text: 'This attack does 70 damage to 1 of your opponent\'s Pokémon that has any Special Energy attached. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Blasting Wind',
    cost: [D, D, C],
    damage: 120,
    text: ''
  }];

  public set: string = 'PBL';
  public setNumber: string = '50';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mandibuzz';
  public fullName: string = 'Mandibuzz M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bone Sniper
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: CardTarget[] = [];
      let hasSpecialEnergyPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, _card, target) => {
        if (cardList.energies.cards.some(c => c.energyType === EnergyType.SPECIAL)) {
          hasSpecialEnergyPokemon = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasSpecialEnergyPokemon) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 70, targets);
      });
    }

    return state;
  }
}
