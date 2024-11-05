import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GameError } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Vaporeonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = W;

  public hp: number = 280;

  public weakness = [{ type: L }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Heavy Squall',
      cost: [W, C],
      damage: 0,
      text: 'This attack does 60 damage to each of your opponent\'s Pokémon ex. Don\'t apply Weakness and Resistance for this damage.'
    },
    {
      name: 'Aquamarine',
      cost: [R, W, L],
      damage: 280,
      text: 'During your next turn, this Pokemon can\'t attack.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'SV8a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Vaporeon ex';
  public fullName: string = 'Vaporeon ex SV8a';

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Burning Charge
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          const damageEffect = new PutDamageEffect(effect, 60);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Carnelian
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}