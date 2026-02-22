/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameMessage, Player, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Drifblim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Drifloon';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [];

  public powers = [{
    name: 'Drifting Balloon',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks cost [C] less for each of your opponent\'s Team Plasma Pokémon in play.'
  }];

  public attacks = [{
    name: 'Derail',
    cost: [C, C, C],
    damage: 70,
    text: 'Discard a Special Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'PLB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Drifblim';
  public fullName: string = 'Drifblim PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && (effect.attack === this.attacks[0]
      || this.tools.some(tool => tool.attacks && tool.attacks.includes(effect.attack)))) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count Team Plasma Pokémon in play for the opponent
      const countSpecialPokemon = (player: Player): number => {
        const specialTags = [CardTag.TEAM_PLASMA];
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

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const specialPokemonCount = countSpecialPokemon(opponent);

      // Determine Colorless energy reduction based on special Pokémon count
      const colorlessToRemove = Math.min(specialPokemonCount, 3);

      // Remove Colorless energy from attack cost
      for (let i = 0; i < colorlessToRemove; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activeCardList = opponent.active;
      const activePokemonCard = activeCardList.getPokemonCard();

      let hasPokemonWithEnergy = false;

      if (activePokemonCard && activeCardList.energies.cards.some(c => c.superType === SuperType.ENERGY && c.energyType === EnergyType.SPECIAL)) {
        hasPokemonWithEnergy = true;
      }

      if (!hasPokemonWithEnergy) {
        return state;
      }

      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        cards = selected || [];
      });
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      return store.reduceEffect(state, discardEnergy);
    }
    return state;
  }
}