import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { AbstractAttackEffect, AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class FlyingPikachuV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_V];

  public regulationMark = 'E';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 190;

  public weakness = [{ type: CardType.LIGHTNING}];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ ];

  public attacks = [{
    name: 'Thunder Shock',
    cost: [ CardType.LIGHTNING ],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }, {
    name: 'Fly',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 120,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public set: string = 'CEL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Flying Pikachu V';

  public fullName: string = 'Flying Pikachu V CEL';

  public readonly CLEAR_FLY_MARKER = 'CLEAR_FLY_MARKER';

  public readonly FLY_MARKER = 'FLY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {

        if (flipResult) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {

        if (!flipResult) {
          // if tails, do nothing
          effect.damage = 0;
          return state;
        }

        if (flipResult) {
          player.active.marker.addMarker(this.FLY_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_FLY_MARKER, this);
        }
      });

      if (effect instanceof AbstractAttackEffect || effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.FLY_MARKER)) {
        effect.preventDefault = true;
        return state;
      }

      if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_FLY_MARKER, this)) {

        effect.player.marker.removeMarker(this.CLEAR_FLY_MARKER, this);

        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.FLY_MARKER, this);
        });
        
      }
      return state;
    }

    return state;
  }
}