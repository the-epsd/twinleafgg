import { PokemonCard, Stage, CardType, StoreLike, State, EnergyCard, EnergyType, SuperType, ChooseCardsPrompt, GameMessage } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { MOVE_CARDS, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #48 — Store Up */
export class Pikachu48 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Store Up',
    cost: [C],
    damage: 0,
    text: 'Put up to 2 Basic Energy cards from your discard pile into your hand.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Store Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEnergy = player.discard.cards.some(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
      );
      if (!hasEnergy) {
        return state;
      }
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: true },
      ), cards => {
        if (cards && cards.length > 0) {
          MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        }
      });
    }
    return state;
  }
}
