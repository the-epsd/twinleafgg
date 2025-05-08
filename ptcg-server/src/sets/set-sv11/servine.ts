import { PokemonCard, Stage, CardType, StoreLike, State, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils, ChooseCardsPrompt, CoinFlipPrompt, GameMessage, EnergyCard, SuperType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Servine extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Snivy';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Wrap',
    cost: [G],
    damage: 20,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }, {
    name: 'Vine Whip',
    cost: [G, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Servine';
  public fullName: string = 'Servine SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          // Defending Pokemon has no energy cards attached
          if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
            return state;
          }
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
          });
        }
        return state;
      });
    }
    return state;
  }
}
