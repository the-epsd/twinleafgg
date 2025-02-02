import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, StateUtils, TrainerCard, EnergyCard, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, AttachPokemonToolEffect, PlayItemEffect, PlayPokemonEffect, PlayStadiumEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';

export class GengarMimikyuGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 240;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];

  public attacks = [
    {
      name: 'Poltergeist',
      cost: [CardType.PSYCHIC],
      damage: 50,
      text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
    },
    {
      name: 'Horror House-GX',
      cost: [CardType.PSYCHIC],
      damage: 0,
      gxAttack: true,
      text: 'Your opponent can\'t play any cards from their hand during their next turn. If this Pokémon has at least 1 extra [P] Energy attached to it (in addition to this attack\'s cost), each player draws cards until they have 7 cards in their hand. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SM9';
  public name: string = 'Gengar & Mimikyu-GX';
  public fullName: string = 'Gengar & Mimikyu-GX SM9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';

  public readonly CANNOT_PLAY_CARDS_FROM_HAND_MARKER = 'CANT_PLAY_CARDS_FROM_HAND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const trainerCount = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
      effect.damage = 50 * trainerCount;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER, this);

      const extraEnergy = player.active.cards.filter(card =>
        card instanceof EnergyCard && card.provides.includes(CardType.PSYCHIC)
      ).length > 1;

      if (extraEnergy) {
        [player, opponent].forEach(p => {
          while (p.hand.cards.length < 7) {
            p.deck.moveTo(p.hand);
          }
        });
      }
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
