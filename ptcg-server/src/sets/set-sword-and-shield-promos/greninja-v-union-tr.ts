import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, Power, PowerType, State, StoreLike } from '../../game';
import { Effect, PowerEffect } from '../../game/store/effects/game-effects';
import {GreninjaVUNIONTopLeft} from './greninja-v-union-tl';
import {GreninjaVUNIONBottomLeft} from './greninja-v-union-bl';
import {GreninjaVUNIONBottomRight} from './greninja-v-union-br';

export class GreninjaVUNIONTopRight extends PokemonCard {
  public stage: Stage = Stage.VUNION;
  public tags = [CardTag.POKEMON_VUNION];
  public cardType: CardType = W;
  public hp: number = 300;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers: Power[] = [
    {
      name: 'Greninja V-UNION Assembly',
      text: 'Once per game during your turn, combine 4 different Greninja V-UNION from your discard pile and put them onto your bench.',
      useFromDiscard: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.ABILITY
    },
    {
      name: 'Ninja Body',
      text: 'Whenever your opponent plays an Item card from their hand, prevent all effects of that card done to this Pokémon.',
      powerType: PowerType.ABILITY
    },
  ];

  public attacks = [
    {
      name: 'Aqua Edge',
      cost: [W],
      damage: 130,
      text: ''
    },
  ];

  public set: string = 'SWSH';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Greninja V-UNION';
  public fullName: string = 'Greninja V-UNION (Top Right) SWSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // assemblin the v-union
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
          const player = effect.player;
          const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
    
          if (player.assembledVUNIONs.includes(this.name)) {
            throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
          }
          if (slots.length === 0) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
    
          let topLeftPiece = false;
          let topRightPiece = false;
          let bottomLeftPiece = false;
          let bottomRightPiece = false;
          player.discard.cards.forEach(card => {
            if (card instanceof GreninjaVUNIONTopLeft) { topLeftPiece = true; }
            if (card instanceof GreninjaVUNIONTopRight) { topRightPiece = true; }
            if (card instanceof GreninjaVUNIONBottomLeft) { bottomLeftPiece = true; }
            if (card instanceof GreninjaVUNIONBottomRight) { bottomRightPiece = true; }
          });
    
          if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
            if (slots.length > 0) {
              player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONTopRight) { player.discard.moveCardTo(card, slots[0]); } });
              player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONBottomLeft) { player.discard.moveCardTo(card, slots[0]); } });
              player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONBottomRight) { player.discard.moveCardTo(card, slots[0]); } });
              // gotta make sure the actual mon ends up on top
              player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONTopLeft) { player.discard.moveCardTo(card, slots[0]); } });
              player.assembledVUNIONs.push(this.name);
              slots[0].pokemonPlayedTurn = state.turn;
            }
          } else {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
    }

    return state;
  }
}
