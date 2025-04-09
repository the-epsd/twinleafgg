import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, self: TeamRocketsVentureBomb, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let flipResult = false;
  COIN_FLIP_PROMPT(store, state, player, result => {
    flipResult = result;
    next();
  });

  if (flipResult){
    store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [ SlotType.ACTIVE, SlotType.BENCH ],
      { min: 1, max: 1, allowCancel: false },
    ), selected => {
      const targets = selected || [];
      targets.forEach(target => {
        target.damage += 20;
      });
    });
  }

  if (!flipResult){
    player.active.damage += 20;
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
}

export class TeamRocketsVentureBomb extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.TEAM_ROCKET];
  public set: string = 'SV10';
  public regulationMark = 'I';
  public name: string = 'Team Rocket\'s Venture Bomb';
  public fullName: string = 'Team Rocket\'s Venture Bomb SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';

  public text: string = 'Flip a coin. If heads, put 2 damage counters on 1 of your opponent\'s Pokémon. If tails, put 2 damage counters on your Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
