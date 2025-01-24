import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError } from '../../game';
import { StoreLike, State, GameMessage } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class YveltalGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 180;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Absorb Vitality',
      cost: [CardType.DARK],
      damage: 20,
      text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
    },

    {
      name: 'Sonic Evil',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
    },

    {
      name: 'Doom Count-GX',
      cost: [CardType.DARK],
      damage: 0,
      text: 'If your opponent\'s Active Pokémon has exactly 4 damage counters on it, that Pokémon is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];
  public set: string = 'FLI';

  public name: string = 'Yveltal-GX';

  public fullName: string = 'Yveltal-GX FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Absorb Vitality
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const healTime = new HealTargetEffect(effect, effect.damage);
      healTime.target = effect.player.active;
      store.reduceEffect(state, healTime);
    }

    // Sonic Evil
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    // Doom Count-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      // must kill
      if (opponent.active.damage === 40) {
        opponent.active.damage += 999;
      }
    }
    return state;
  }
} 
