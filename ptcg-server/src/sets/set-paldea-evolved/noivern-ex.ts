import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import {
  StoreLike, State, PlayerType,
  StateUtils,
  GameError,
  GameMessage
} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, PlayStadiumEffect } from '../../game/store/effects/play-card-effects';


export class Noivernex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Noibat';

  public tags = [CardTag.POKEMON_ex];

  public regulationMark = 'G';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 260;

  public attacks = [
    {
      name: 'Covert Flight',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
    },
    {
      name: 'Dominating Echo',
      cost: [CardType.PSYCHIC, CardType.DARK],
      damage: 140,
      text: 'During your opponent\'s next turn, they can\'t play any Special Energy or Stadium cards from their hand.'
    },
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '153';

  public name: string = 'Noivern ex';

  public fullName: string = 'Noivern ex PAL';

  public readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';

  public readonly DOMINATING_ECHO_MARKER = 'DOMINATING_ECHO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.attackMarker.addMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
      opponent.attackMarker.addMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.attackMarker.hasMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER)) {
      const card = effect.source.getPokemonCard();
      const stage = card !== undefined ? card.stage : undefined;

      if (stage === Stage.BASIC) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.attackMarker.addMarker(this.DOMINATING_ECHO_MARKER, this);
    }

    if (effect instanceof PlayStadiumEffect) {
      const player = effect.player;
      if (player.attackMarker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttachEnergyEffect && EnergyType.SPECIAL) {
      const player = effect.player;
      if (player.attackMarker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.attackMarker.hasMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
        effect.player.attackMarker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.attackMarker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
        });
      }
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.attackMarker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        effect.player.attackMarker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.attackMarker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
        });
      }
    }

    return state;
  }

}
