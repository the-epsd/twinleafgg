import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// SMP Jolteon-GX 173 (https://limitlesstcg.com/cards/SMP/173)
export class JolteonGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [];

  public attacks = [
    {
      name: 'Electrobullet',
      cost: [CardType.LIGHTNING],
      damage: 30,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Head Bolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: ''
    },
    {
      name: 'Swift Run-GX',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: 'Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SMP';

  public setNumber = 'SM173';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Jolteon-GX';

  public fullName: string = 'Jolteon-GX SMP';

  // for the GX attack
  public readonly ECLIPSE_MARKER = 'ECLIPSE_MARKER';
  public readonly CLEAR_ECLIPSE_MARKER = 'CLEAR_ECLIPSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Electrobullet
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Swift Run-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      player.active.marker.addMarker(this.ECLIPSE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_ECLIPSE_MARKER, this);
    }

    if (effect instanceof AbstractAttackEffect
      && effect.target.marker.hasMarker(this.ECLIPSE_MARKER)) {
      effect.preventDefault = true;
      return state;
    }


    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_ECLIPSE_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_ECLIPSE_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.ECLIPSE_MARKER, this);
      });
    }

    return state;
  }
}