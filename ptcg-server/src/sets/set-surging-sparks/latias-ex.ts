import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Latiasex extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public tags = [CardTag.POKEMON_ex];

  public hp: number = 210;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Skyline',
    powerType: PowerType.ABILITY,
    text: 'Your Basic Pokémon have no Retreat Cost.'
  }];

  public attacks = [
    {
      name: 'Infinity Blade',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 200,
      text: 'This Pokémon can\'t attack during your next turn.'
    },
  ];

  public set: string = 'SSP';

  public regulationMark: string = 'H';

  public setNumber: string = '76';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Latias ex';

  public fullName: string = 'Latias ex SSP';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active.getPokemonCard();

      if (owner !== player || active === undefined) {
        return state;
      }

      let isLatiasexInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isLatiasexInPlay = true;
        }
      });

      if (!isLatiasexInPlay) {
        return state;
      }

      if (!IS_ABILITY_BLOCKED(store, state, player, this) && active.stage === Stage.BASIC) {
        effect.cost = [];
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }
    return state;
  }
}