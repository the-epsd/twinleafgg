import { Attack, CardTag, CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kyurem extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public tags: string[] = [CardTag.TEAM_PLASMA];
  public hp: number = 130;
  public weakness: Weakness[] = [{ type: M }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Frost Spear',
      cost: [W, C],
      damage: 30,
      text: 'Does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Blizzard Burn',
      cost: [W, W, C],
      damage: 120,
      text: 'This Pokémon can\'t attack during your next turn.'
    },
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Kyurem';
  public fullName: string = 'Kyurem PLF';

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

    if (effect instanceof AttackEffect) {
      if (HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this) || HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
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

    // Knuckle Impact
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    return state;
  }
}