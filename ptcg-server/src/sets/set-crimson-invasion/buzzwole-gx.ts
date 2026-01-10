import { PokemonCard, CardTag, Stage, CardType, State, StateUtils, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/game-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BuzzwoleGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 190;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Jet Punch',
    cost: [F],
    damage: 30,
    text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Knuckle Impact',
    cost: [F, F, F],
    damage: 160,
    text: 'This Pokémon can\'t attack during your next turn.'
  },
  {
    name: 'Absorption-GX',
    cost: [F, F, F],
    damage: 0,
    gxAttack: true,
    text: 'This attack does 40 damage for each of your remaining Prize cards. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CIN';
  public name: string = 'Buzzwole-GX';
  public fullName: string = 'Buzzwole-GX CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Jet Punch
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
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    // Absorption GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      effect.damage = 40 * player.getPrizeLeft();

      return state;
    }

    return state;
  }
}