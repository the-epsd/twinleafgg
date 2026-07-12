import { PokemonCard, Stage, CardType, State, StoreLike, PowerType, GameError, GameMessage, SuperType, CardTag } from '../../../game';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';

import { HAS_MARKER, ABILITY_USED, ADD_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Genesectex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 220;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Metal Signal',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for up to 2 [M] Evolution Pokemon, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Protect Charge',
    cost: [M, M, C],
    damage: 150,
    text: 'During your opponent\'s next turn, this Pokemon takes 30 less damage from attacks.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Genesect ex';
  public fullName: string = 'Genesect ex SV11B';

  public readonly METAL_SIGNAL_MARKER = 'METAL_SIGNAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.METAL_SIGNAL_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.METAL_SIGNAL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.cardType === CardType.METAL && card.evolvesFrom !== '' && card.stage !== Stage.LV_X)) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.POKEMON }, { min: 0, max: 2, allowCancel: false, blocked }, this.powers[0]);
      ABILITY_USED(player, this);
      ADD_MARKER(this.METAL_SIGNAL_MARKER, player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.METAL_SIGNAL_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}