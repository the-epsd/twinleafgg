import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Card, ChooseCardsPrompt, SelectOptionPrompt } from '../../game';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Arcanineex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Growlithe';
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fire Remedy',
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a [R] Energy from your hand to Arcanine ex, remove 1 damage counter and all Special Conditions from Arcanine ex.'
  }];

  public attacks = [{
    name: 'Overrun',
    cost: [R, C],
    damage: 30,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Flame Swirl',
    cost: [R, R, C],
    damage: 100,
    text: 'Discard 2 [R] Energy or 1 React Energy card attached to Arcanine ex.'
  }];

  public set: string = 'LM';
  public setNumber: string = '83';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Arcanine ex';
  public fullName: string = 'Arcanine ex LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.energyCard.energyType === EnergyType.BASIC && effect.energyCard.provides.includes(CardType.FIRE)) {
        // heal
        const healEffect = new HealEffect(effect.player, effect.target, 10);
        store.reduceEffect(state, healEffect);
        //remove special conditions
        const conditions = effect.target.specialConditions.slice();
        conditions.forEach(condition => {
          effect.target.removeSpecialCondition(condition);
        });
      }

      // Check special energies that provide [W]
      if (effect.energyCard.energyType === EnergyType.SPECIAL) {
        // Temporarily push the energy card to the list of cards to check if it provides [W]
        effect.target.cards.push(effect.energyCard);
        const checkFireEnergy = new CheckProvidedEnergyEffect(effect.player, effect.target);
        store.reduceEffect(state, checkFireEnergy);
        effect.target.cards.pop();

        const energyMap = checkFireEnergy.energyMap.find(element => element.card === effect.energyCard);
        const providedEnergy = energyMap?.provides;
        if (providedEnergy?.includes(CardType.FIRE)
          || providedEnergy?.includes(CardType.ANY)) {
          //heal
          const healEffect = new HealEffect(effect.player, effect.target, 10);
          store.reduceEffect(state, healEffect);
          //remove special conditions
          const conditions = effect.target.specialConditions.slice();
          conditions.forEach(condition => {
            effect.target.removeSpecialCondition(condition);
          });
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // See if there is holon energy attached
      const hasReactEnergy = player.active.cards.some(card => card.name === 'React Energy');

      const options: { message: GameMessage, action: () => void }[] = [];

      if (hasReactEnergy) {
        options.push({
          message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          action: () => {
            const player = effect.player;
            // Prompt the player to choose one 'React Energy' to discard (in case there are multiple)
            state = store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              player.active,
              { name: 'React Energy' },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              const cards: Card[] = selected || [];
              if (cards.length > 0) {
                const discardEffect = new DiscardCardsEffect(effect, cards);
                discardEffect.target = player.active;
                return store.reduceEffect(state, discardEffect);
              }
              return state;
            });
          }
        });
      }


      options.push({
        message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        action: () => {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE);
        }
      });

      if (options.length === 1) {
        options[0].action();
      } else {
        return store.prompt(state, new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          [
            'Discard 1 React Energy attached to Arcanine ex',
            'Discard 2 Fire Energy attached to Arcanine ex'
          ],
          {
            allowCancel: false,
          }), choice => {
          const option = options[choice];
          option.action();
        });
      }
    }

    return state;
  }
}