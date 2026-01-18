import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, PlayerType, SuperType, TrainerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rattata';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Scrape Off',
    cost: [C],
    damage: 20,
    text: 'Before doing damage, you may discard a Pokemon Tool attached to your opponent\'s Active Pokemon.'
  },
  {
    name: 'Countering Incisors',
    cost: [C],
    damage: 0,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each damage counter on all of your Benched Rattata.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Raticate';
  public fullName: string = 'Raticate M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scrape Off - optionally discard Tool
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.tools.length > 0) {
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active,
          { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
          { min: 0, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            opponent.active.moveCardsTo(cards, opponent.discard);
          }
        });
      }
    }

    // Countering Incisors - damage based on benched Rattata damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let totalDamageCounters = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList !== player.active) {
          const pokemonCard = cardList.getPokemonCard();
          if (pokemonCard && pokemonCard.name === 'Rattata') {
            totalDamageCounters += Math.floor(cardList.damage / 10);
          }
        }
      });

      effect.damage = totalDamageCounters * 40;
    }

    return state;
  }
}
