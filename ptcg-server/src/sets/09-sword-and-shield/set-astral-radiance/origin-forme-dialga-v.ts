

import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, ChooseCardsPrompt, EnergyCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class OriginFormeDialgaV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 220;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Metal Coating',
    cost: [C],
    damage: 0,
    text: 'Attach up to 2 [M] Energy cards from your discard pile to this Pokémon.'
  },
  {
    name: 'Temporal Rupture',
    cost: [M, M, M, C],
    damage: 180,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Origin Forme Dialga V';
  public fullName: string = 'Origin Forme Dialga V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Coating
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasMetalEnergyInDiscard = player.discard.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && (c as EnergyCard).provides.includes(CardType.METAL);
      });
      if (!hasMetalEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.discard,
        { superType: SuperType.ENERGY, name: 'Metal Energy' },
        { min: 0, max: 2, allowCancel: false }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.discard, cardList, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        }
      });
    }

    return state;
  }
}