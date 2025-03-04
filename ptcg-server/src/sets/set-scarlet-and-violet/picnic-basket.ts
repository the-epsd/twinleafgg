import { TrainerCard, TrainerType, StoreLike, State, PlayerType, StateUtils, GameError, GameMessage, DamageMap } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class PicnicBasket extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '184';

  public name: string = 'Picnic Basket';

  public fullName: string = 'Picnic Basket SVI';

  public text: string =
    'Heal 30 damage from each Pokémon (both yours and your opponent\'s).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Check if any Pokémon have damage
      let hasDamagedPokemon = false;
      const damagedPokemon: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      if (!hasDamagedPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Heal each Pokemon by 30 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 30);
        state = store.reduceEffect(state, healEffect);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 30);
        state = store.reduceEffect(state, healEffect);
      });

      player.supporter.moveCardTo(this, player.discard);
      return state;
    }
    return state;
  }
}