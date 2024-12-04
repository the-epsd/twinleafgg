/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { GameError, PlayerType, PowerType } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CardTag } from '../../game/store/card/card-types';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class GenesectV extends PokemonCard {

  public tags = [CardTag.POKEMON_V, CardTag.FUSION_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Fusion Strike System',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw cards until you have ' +
      'as many cards in your hand as you have Fusion Strike ' +
      'Pokémon in play.'
  }];

  public attacks = [
    {
      name: 'Techno Blast',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 210,
      text: 'During your next turn, this Pokémon can\'t attack. '
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '185';

  public name: string = 'Genesect V';

  public fullName: string = 'Genesect V FST';


  public readonly FUSION_STRIKE_SYSTEM_MARKER = 'FUSION_STRIKE_SYSTEM_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      const player = effect.player;
      player.active.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      player.active.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      // Check marker
      if (player.active.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      player.active.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      if (player.marker.hasMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let fusionStrikeCount = 0;

      if (player.active?.getPokemonCard()?.tags.includes(CardTag.FUSION_STRIKE)) {
        fusionStrikeCount++;
      }

      player.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()?.tags.includes(CardTag.FUSION_STRIKE)) {
          fusionStrikeCount++;
        }
      });

      while (player.hand.cards.length < fusionStrikeCount) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
      }
      player.marker.addMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player instanceof GenesectV) {
          player.marker.removeMarker(this.FUSION_STRIKE_SYSTEM_MARKER);
        }
      });
    }

    return state;
  }
}
