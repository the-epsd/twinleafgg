import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, GameError } from '../../game';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckHpEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Palossandex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sandygast';

  public cardType: CardType = P;

  public hp: number = 280;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Sand Tomb',
      cost: [C, C, C],
      damage: 160,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
    },
    {
      name: 'Barite Jail',
      cost: [W, P, F],
      damage: 0,
      text: 'Put damage counters on each of your opponent\'s Benched Pokémon until its remaining HP is 100.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public setNumber: string = '91';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Palossand ex';

  public fullName: string = 'Palossand ex SSP';

  public readonly SAND_TOMB_MARKER = 'SAND_TOMB_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Tomb
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SAND_TOMB_MARKER, this);
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.SAND_TOMB_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SAND_TOMB_MARKER, this);
    }

    // Barite Jail
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {

        if (cardList === opponent.active) {
          return state;
        }

        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);

        let resultingDamage = (checkHpEffect.hp - cardList.damage) - 100;
        if (resultingDamage <= 0) { resultingDamage = 0; }

        const damageEffect = new PutCountersEffect(effect, resultingDamage);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
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