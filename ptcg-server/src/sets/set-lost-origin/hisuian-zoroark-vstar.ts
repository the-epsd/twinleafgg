import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, PokemonCard, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class HisuianZoroarkVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Hisuian Zoroark V';

  public cardTag = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 270;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Phantom Star',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may discard your hand and draw 7 cards. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [
    {
      name: 'Nightly Raid',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage for each of your Pokémon that has any damage counters on it.'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public name: string = 'Hisuian Zoroark VSTAR';

  public fullName: string = 'Hisuian Zoroark VSTAR LOR';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }
      

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const damage = 0;
      state.players.forEach(player => {
        player.active.cards.forEach(card => {
          if (damage > 0) {
            effect.damage += 50;
          }
        });
        player.bench.forEach(bench => {
          bench.cards.forEach(card => {
            if (damage > 0) {
              effect.damage += 50;
            }
          });
        });
      });
      effect.damage = damage;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
  
      const cards = player.hand.cards.filter(c => c !== this);
      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 7);
      player.marker.addMarker(this.VSTAR_MARKER, this);
    }
    return state;
  }
}


