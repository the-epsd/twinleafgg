import { CardTag, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, HAS_EXTRA_ENERGY_BEYOND_ATTACK_COST, IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES, NEXT_TURN_ATTACK_BASE_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';


export class PheromosaAndBuzzwoleGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 260;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Jet Punch',
    cost: [G],
    damage: 30,
    text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Elegant Sole',
    cost: [G, G, C],
    damage: 190,
    text: 'During your next turn, this Pokémon\'s Elegant Sole attack\'s base damage is 60.'
  },
  {
    name: 'Beast Game-GX',
    cost: [G],
    damage: 50,
    gxAttack: true,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card. If this Pokémon has at least 7 extra Energy attached to it (in addition to this attack\'s cost), take 3 more Prize cards instead. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name = 'Pheromosa & Buzzwole-GX';
  public fullName = 'Pheromosa & Buzzwole-GX UNB';

  public readonly ELEGANT_SOLE_MARKER = 'ELEGANT_SOLE_MARKER';
  public readonly ELEGANT_SOLE_MARKER_2 = 'ELEGANT_SOLE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jet Punch (literally just buzzwole-gx's first attack)
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

    // Beast Game-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      BLOCK_IF_GX_ATTACK_USED(effect.player);
      effect.player.usedGX = true;
    }

    state = IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Beast Game-GX',
      getExtraPrizes: (store, state, _effect, attacker) =>
        HAS_EXTRA_ENERGY_BEYOND_ATTACK_COST(store, state, attacker, this.attacks[2], 7) ? 3 : 1,
    });

    // Elegant Sole
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[1],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 60,
      bonusMarker: this.ELEGANT_SOLE_MARKER,
      clearMarker: this.ELEGANT_SOLE_MARKER_2
    });

    return state;
  }
}
