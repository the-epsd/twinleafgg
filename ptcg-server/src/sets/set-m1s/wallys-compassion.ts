import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, SlotType, EnergyCard, CardTarget } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  const blocked: CardTarget[] = [];
  let hasMegaPokemon = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (card.tags.includes(CardTag.MEGA) && card.tags.includes(CardTag.POKEMON_ex) && cardList.damage > 0) {
      hasMegaPokemon = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasMegaPokemon) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_HEAL,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: false, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  const target = targets[0];
  const healEffect = new HealEffect(player, target, target.damage);
  store.reduceEffect(state, healEffect);

  const energy = target.cards.filter(c => c instanceof EnergyCard);
  target.moveCardsTo(energy, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return state;
}

export class WallysCompassion extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'M1S';

  public regulationMark = 'I';

  public name: string = 'Wally\'s Compassion';

  public fullName: string = 'Wally\'s Compassion M1S';

  public text: string = 'Heal all damage from 1 of your Mega Evolution Pokémon ex. If you do, put all Energy attached to that Pokémon back into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
} 