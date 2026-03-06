import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, ChooseCardsPrompt, GameMessage, PokemonCardList } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class HoOh extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flames of Resurrection',
    cost: [R],
    damage: 0,
    text: 'Put up to 3 Basic Pokemon from your discard pile onto your Bench.'
  },
  {
    name: 'Bright Wing',
    cost: [R, R, R],
    damage: 130,
    text: 'Discard an Energy attached to this Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Ho-Oh';
  public fullName: string = 'Ho-Oh M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
      if (slots.length === 0) {
        return state;
      }
      const basicInDiscard = player.discard.cards.filter(c =>
        c instanceof PokemonCard && (c as PokemonCard).stage === Stage.BASIC
      );
      if (basicInDiscard.length === 0) {
        return state;
      }
      const max = Math.min(3, slots.length, basicInDiscard.length);
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (!(c instanceof PokemonCard) || (c as PokemonCard).stage !== Stage.BASIC) {
          blocked.push(index);
        }
      });
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
          if (index < slots.length) {
            player.discard.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
          }
        });
      });
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }
    return state;
  }
}
