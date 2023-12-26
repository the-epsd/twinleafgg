import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, CardType, TrainerType } from '../../game/store/card/card-types';
import { State, StoreLike, Player, PokemonCard, PlayerType, EnergyMap, StateUtils, ChooseAttackPrompt, GameError, GameMessage, PowerType } from '../../game';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { MewEx } from '../set-legendary-treasures/mew-ex';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;


  public powers = [{
    name: 'Versatile',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'This Pokemon can use the attacks of any Pokemon in play ' +
      '(both yours and your opponent\'s). (You still need the necessary ' +
      'Energy to use each attack.)'
  }];

  public attacks = [
    {
      name: 'Replace',
      cost: [ CardType.PSYCHIC ],
      damage: 0,
      text: 'Move as many Energy attached to your Pokemon to your other ' +
        'Pokemon in any way you like.'
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard instanceof ForestSealStone) {
        // Build cards and blocked for Choose Attack prompt  
        const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

        // No attacks to copy
        if (pokemonCards.length === 0) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        return store.prompt(state, new ChooseAttackPrompt(
          player.id,
          GameMessage.CHOOSE_ATTACK_TO_COPY,
          pokemonCards,
          { allowCancel: true, blocked }
        ), attack => {
          if (attack !== null) {
            const useAttackEffect = new UseAttackEffect(player, attack);
            store.reduceEffect(state, useAttackEffect);
          }
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Rest of method
    }

    return state;
  }


  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    {
      // Only include Pokemon V cards
      if (!card.tags.includes(CardTag.POKEMON_V)) {
        return;
      }
      // No need to include Mew Ex to the list
      if (card instanceof MewEx) {
        return;
      }
      const attacks = card.attacks.filter(attack => {
        const checkAttackCost = new CheckAttackCostEffect(player, attack);
        state = store.reduceEffect(state, checkAttackCost);
        return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
      });
      const index = pokemonCards.length;
      pokemonCards.push(card);
      card.attacks.forEach(attack => {
        if (!attacks.includes(attack)) {
          blocked.push({ index, attack: attack.name });
        }
      });
    }
  }
}