import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, PlayerType, SlotType, GameError, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PLAY_POKEMON_FROM_HAND_TO_BENCH, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class GreninjaGXSMP extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Frogadier';

  public cardType: CardType = CardType.WATER;

  public hp: number = 230;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Elusive Master',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'Once during your turn (before your attack), if this Pokémon is the last card in your hand, you may play it onto your Bench. If you do, draw 3 cards.'
  }];

  public attacks = [
    {
      name: 'Mist Slash',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 130,
      text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on your opponent\'s Active Pokémon.'
    },

    {
      name: 'Dark Mist-GX',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Put 1 of your opponent\'s Benched Pokémon and all cards attached to it into your opponent\'s hand. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SMP';

  public setNumber = 'SM197';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Greninja-GX';

  public fullName: string = 'Greninja-GX SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Elusive Master
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.filter(c => c !== this).length !== 0)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
      player.deck.moveTo(player.hand, 3);
    }

    // Mist Slash
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 130);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    // Dark Mist-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selection => {
        selection.forEach(r => {
          r.moveTo(opponent.hand);
          r.clearEffects();
        });
      });
    }
    return state;
  }
}