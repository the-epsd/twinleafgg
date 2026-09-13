import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, StateUtils, PlayerType, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_TRAINER_TARGET, IS_ABILITY_BLOCKED, IS_TRAINER_TARGET } from '../../../game/store/prefabs/prefabs';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public cardType: CardType[] = [F];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Obnoxious Whirring',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to this Pokémon.'
  }];

  public attacks = [{
    name: 'Flap',
    cost: [F, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snow Cover
    if (IS_TRAINER_TARGET(effect, { card: this, trainerType: TrainerType.SUPPORTER })) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) { return state; }

      // finding if the owner of the card is playing the trainer or if the opponent is
      let isVibravaOnOpponentsSide = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) { isVibravaOnOpponentsSide = true; }
      });
      if (!isVibravaOnOpponentsSide) { return state; }

      BLOCK_TRAINER_TARGET(effect);
    }

    return state;
  }
}
