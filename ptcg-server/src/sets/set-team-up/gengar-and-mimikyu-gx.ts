import { PokemonCard, Stage, CardType, CardTag, SuperType, StoreLike, State, StateUtils, TrainerCard, EnergyCard, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, AttachPokemonToolEffect, PlayItemEffect, PlayPokemonEffect, PlayStadiumEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GengarMimikyuGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = P;
  public hp: number = 240;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Poltergeist',
      cost: [P, P],
      damage: 50,
      damageCalculation: 'x',
      text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
    },
    {
      name: 'Horror House-GX',
      cost: [P],
      damage: 0,
      gxAttack: true,
      text: 'Your opponent can\'t play any cards from their hand during their next turn. If this Pokémon has at least 1 extra [P] Energy attached to it (in addition to this attack\'s cost), each player draws cards until they have 7 cards in their hand. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'TEU';
  public name: string = 'Gengar & Mimikyu-GX';
  public fullName: string = 'Gengar & Mimikyu-GX TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';

  public readonly CANNOT_PLAY_CARDS_FROM_HAND_MARKER = 'CANT_PLAY_CARDS_FROM_HAND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const trainerCount = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
      effect.damage = 50 * trainerCount;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER, this);

      const extraEnergy = player.active.cards.filter(card =>
        card.superType === SuperType.ENERGY && (card as EnergyCard).provides.includes(CardType.PSYCHIC)
      ).length > 1;

      if (extraEnergy) {
        [player, opponent].forEach(p => {
          while (p.hand.cards.length < 7) {
            p.deck.moveTo(p.hand);
          }
        });
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)){
      effect.player.marker.removeMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER);
    }

    if (effect instanceof PlayPokemonEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof PlayItemEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttachEnergyEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof PlaySupporterEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof PlayStadiumEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttachPokemonToolEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }



    return state;
  }
}
