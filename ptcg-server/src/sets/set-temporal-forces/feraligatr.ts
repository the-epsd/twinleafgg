import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Feraligatr extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Croconaw';

  public cardType: CardType = CardType.WATER;

  public hp: number = 180;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Torrential Heart',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 5 damage counters on this Pokémon. If you do, attacks used by this Pokémon do 120 more damage to your opponent\'s Active Pokémon during this turn (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Giant Wave',
      cost: [CardType.WATER, CardType.WATER],
      damage: 160,
      text: 'This Pokémon can\'t use Giant Wave during your next turn.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public name: string = 'Feraligatr';

  public fullName: string = 'Feraligatr TEF';

  public readonly TORRENTIAL_HEART_MARKER = 'TORRENTIAL_HEART_MARKER';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TORRENTIAL_HEART_MARKER, this)) {
      effect.player.marker.removeMarker(this.TORRENTIAL_HEART_MARKER, this);
      console.log('torrential heart marker cleared');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (effect.player.marker.hasMarker(this.TORRENTIAL_HEART_MARKER, this)) {
        effect.damage += 120;
      }
      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      if (effect.player.marker.hasMarker(this.TORRENTIAL_HEART_MARKER, this)) {
        console.log('power blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.damage += 50;
        }
      });

      effect.player.marker.addMarker(this.TORRENTIAL_HEART_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }
    return state;
  }
}