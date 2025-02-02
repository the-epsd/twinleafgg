import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, Power, PowerType, State, StoreLike } from '../../game';
import { Effect, PowerEffect } from '../../game/store/effects/game-effects';
import { MewtwoVUNIONTopLeft } from './mewtwo-v-union-tl';
import { MewtwoVUNIONBottomLeft } from './mewtwo-v-union-bl';
import { MewtwoVUNIONBottomRight } from './mewtwo-v-union-br';

export class MewtwoVUNIONTopRight extends PokemonCard {
  public stage: Stage = Stage.VUNION;
    public tags = [ CardTag.POKEMON_VUNION ];
  public cardType: CardType = P;
  public hp: number = 310;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C, C ];

  public powers: Power[] = [
    {
      name: 'Mewtwo V-UNION Assembly',
      text: 'Once per game during your turn, combine 4 different Mewtwo V-UNION from your discard pile and put them onto your bench.',
      useFromDiscard: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.ABILITY
    }
  ];

  public attacks = [
    {
      name: 'Super Regeneration',
      cost: [ P, P, C ],
      damage: 0,
      text: 'Heal 200 damage from this Pokémon.'
    }
  ];

  public set: string = 'SP';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '160';
  public name: string = 'Mewtwo V-UNION';
  public fullName: string = 'Mewtwo V-UNION (Top Right) SP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // assemblin the v-union
    if (effect instanceof PowerEffect && effect.power === this.powers[0]){
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.assembledMewtwo){
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      if (slots.length === 0){
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let topLeftPiece = false;
      let topRightPiece = false;
      let bottomLeftPiece = false;
      let bottomRightPiece = false;
      player.discard.cards.forEach((card, index) => {
        if (card instanceof MewtwoVUNIONTopLeft){ topLeftPiece = true; }
        if (card instanceof MewtwoVUNIONTopRight){ topRightPiece = true; }
        if (card instanceof MewtwoVUNIONBottomLeft){ bottomLeftPiece = true; }
        if (card instanceof MewtwoVUNIONBottomRight){ bottomRightPiece = true; }
      });

      if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece){
        if (slots.length > 0) {
          // gotta make sure the actual mon ends up on top
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONTopRight){ player.discard.moveCardTo(card, slots[0]); }});
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONBottomLeft){ player.discard.moveCardTo(card, slots[0]); }});
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONBottomRight){ player.discard.moveCardTo(card, slots[0]); }});
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONTopLeft){ player.discard.moveCardTo(card, slots[0]); }});
          player.assembledMewtwo = true;
          slots[0].pokemonPlayedTurn = state.turn;
        }
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    return state;
  }
}
