

import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, EnergyCard, StateUtils, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class OriginFormeDialgaV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Metal Coating',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Attach up to 2 [M] Energy cards from your discard pile to this Pokémon.'
    },
    {
      name: 'Temporal Rupture',
      cost: [ CardType.METAL, CardType.METAL, CardType.METAL, CardType.COLORLESS ],
      damage: 180,
      text: ''
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Origin Forme Dialga V';

  public fullName: string = 'Origin Forme Dialga V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasMetalEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
            && c.energyType === EnergyType.BASIC
            && c.provides.includes(CardType.METAL);
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
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
        { min: 0, max: 2, allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          player.discard.moveCardsTo(cards, cardList);
        }
      });
    }
    return state;
  }
}