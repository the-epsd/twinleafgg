import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTarget, GameMessage, PlayerType, SlotType, StoreLike, State, StateUtils, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DAMAGE_OPPONENT_POKEMON } from '../../game/store/prefabs/prefabs';

export class Noctowl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoothoot';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Blindside',
      cost: [C, C],
      damage: 0,
      text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Slashing Claw',
      cost: [C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '166';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Noctowl';
  public fullName: string = 'Noctowl UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Blindside
    // Ref: set-paradox-rift/technical-machine-blindside.ts (Blindside)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: CardTarget[] = [];
      let hasDamagedPokemon = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasDamagedPokemon) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 60, targets);
      });
    }

    return state;
  }
}
