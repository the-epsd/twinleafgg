import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, TrainerCard, EnergyCard, PlayerType, PowerType, StateUtils } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Genesect extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Ace Canceller',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has a Pokémon Tool attached, your opponent can\'t play any Ace Spec cards from their hand.'
  }];

  public attacks = [
    {
      name: 'Magnet Blast',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Genesect';

  public fullName: string = 'Genesect SFA';

  public readonly OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER = 'OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof PowerEffect
      && effect.power.powerType === PowerType.ABILITY
      && effect.power.name !== 'Ace Canceller') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isGenesectWithToolInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          isGenesectWithToolInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          isGenesectWithToolInPlay = true;
        }
      });

      if (!isGenesectWithToolInPlay) {
        return state;
      }

      if (effect instanceof PlayItemEffect) {
        if (TrainerCard.tags.includes(CardTag.ACE_SPEC)) {

          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }


      if (effect instanceof AttachPokemonToolEffect) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }
        if (effect.target.tool !== undefined) {
          if (effect.trainerCard.tags.includes(CardTag.ACE_SPEC)) {
            throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
          }
        }


        if (effect instanceof AttachEnergyEffect) {
          if (EnergyCard.tags.includes(CardTag.ACE_SPEC)) {
            throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
          }
        }


        if (effect instanceof PlayStadiumEffect) {
          if (TrainerCard.tags.includes(CardTag.ACE_SPEC)) {
            throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
          }
        }


        if (effect instanceof TrainerEffect) {
          if (TrainerCard.tags.includes(CardTag.ACE_SPEC)) {
            throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
          }
        }
      }

      return state;
    }
    return state;
  }
}
