/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, Player, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class DrapionV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Wild Style',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks cost C less for each of your opponent\'s Single Strike, Rapid Strike, and Fusion Strike Pokémon in play.'
  }];

  public attacks = [
    {
      name: 'Dynamic Tail',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 190,
      text: 'This attack also does 60 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name: string = 'Drapion V';

  public fullName: string = 'Drapion V LOR';

  // Implement ability
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count V, VSTAR, and VMAX Pokémon in play for the opponent
      const countSpecialPokemon = (player: Player): number => {
        const specialTags = [CardTag.FUSION_STRIKE, CardTag.RAPID_STRIKE, CardTag.SINGLE_STRIKE];
        let count = 0;

        // Check active Pokémon
        const activePokemon = player.active.getPokemonCard();
        if (activePokemon && specialTags.some(tag => activePokemon.tags.includes(tag))) {
          count++;
        }

        // Check bench Pokémon
        player.bench.forEach(slot => {
          const benchPokemon = slot.getPokemonCard();
          if (benchPokemon && specialTags.some(tag => benchPokemon.tags.includes(tag))) {
            count++;
          }
        });

        return count;
      };

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        console.log(effect.cost);
        return state;
      }

      const specialPokemonCount = countSpecialPokemon(opponent);

      // Determine Colorless energy reduction based on special Pokémon count
      const colorlessToRemove = Math.min(specialPokemonCount, 4);

      // Remove Colorless energy from attack cost
      for (let i = 0; i < colorlessToRemove; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }

      console.log(effect.cost);

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 60;
          }
        });
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 60);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}