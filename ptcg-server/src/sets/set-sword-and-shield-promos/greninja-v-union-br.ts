import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, Power, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import {GreninjaVUNIONTopLeft} from './greninja-v-union-tl';
import {GreninjaVUNIONTopRight} from './greninja-v-union-tr';
import {GreninjaVUNIONBottomLeft} from './greninja-v-union-bl';

export class GreninjaVUNIONBottomRight extends PokemonCard {
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
      name: 'Feel the Way',
      text: 'Once during your turn, you may have your opponent reveal their hand.',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY
    }
  ];

  public attacks = [
    {
      name: 'Waterfall Bind',
      cost: [W, W, C],
      damage: 180,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
    }
  ];

  public set: string = 'SWSH';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '158';
  public name: string = 'Greninja V-UNION';
  public fullName: string = 'Greninja V-UNION (Bottom Right) SWSH';

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
