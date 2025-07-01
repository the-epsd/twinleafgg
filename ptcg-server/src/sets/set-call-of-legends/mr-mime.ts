import { PokemonCard, Stage, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = P;
  public hp = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Trick Reveal',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may have both you and your opponent reveal your hands. This power can\'t be used if Mr.Mime is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Juggling',
    cost: [P, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
  }];

  public set = 'CL';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Mr. Mime';
  public fullName = 'Mr. Mime CL';

  public readonly TRICK_REVEAL_MARKER = 'TRICK_REVEAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.TRICK_REVEAL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      ADD_MARKER(this.TRICK_REVEAL_MARKER, player, this);
      ABILITY_USED(player, this);

      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
      SHOW_CARDS_TO_PLAYER(store, state, opponent, player.hand.cards);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TRICK_REVEAL_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        effect.damage = 10 * heads;
      });
    }

    return state;
  }

}
