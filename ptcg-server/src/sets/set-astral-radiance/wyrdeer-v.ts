import { PokemonCard, CardType, Stage, PowerType, Card, CardTarget, GameMessage, MoveEnergyPrompt, PlayerType, SlotType, State, StateUtils, StoreLike, SuperType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class WyrdeerV extends PokemonCard {

  public cardType = CardType.COLORLESS;

  public hp = 220;

  public stage = Stage.BASIC;
  
  public weakness = [{ type: CardType.FIGHTING }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public powers = [{
    name: 'Frontier Road',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may move any amount of Energy from your other Pokémon to it.'
  }];

  public attacks = [{
    name: 'Psyshield Bash',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], 
    damage: 40,
    text: 'This attack does 40 damage for each Energy attached to this Pokémon.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '134';

  public name: string = 'Wyrdeer V';

  public fullName: string = 'Wyrdeer V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      this.movedToActiveThisTurn = false;
    }

    const player = state.players[state.activePlayer];

    if (this.movedToActiveThisTurn == true) {

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards: Card[] = [];

        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.ANY)) {
            blockedCards.push(em.card);
          }
        });

        const blocked: number[] = [];
        blockedCards.forEach(bc => {
          const index = cardList.cards.indexOf(bc);
          if (index !== -1 && !blocked.includes(index)) {
            blocked.push(index);
          }
        });

        if (blocked.length !== 0) {
          blockedMap.push({ source: target, blocked });
        }
      });

      return store.prompt(state, new MoveEnergyPrompt(
        player.id, 
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH], // Only allow moving to active
        { superType: SuperType.ENERGY }, 
        { allowCancel: true, blockedMap }
      ), transfers => {

        if (!transfers) {
          return;
        }

        for (const transfer of transfers) {
      
          // Can only move energy to the active Pokemon
          const target = player.active;  
          const source = StateUtils.getTarget(state, player, transfer.from);

          source.moveCardTo(transfer.card, target);
          return state;
        }
        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);

        const blockedCards: Card[] = [];

        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.ANY)) {
            blockedCards.push(em.card);
          }
        });

        const damagePerEnergy = 40;

        effect.damage = this.attacks[0].damage + (checkProvidedEnergy.energyMap.length * damagePerEnergy);
      });
      return state;
    }
    return state;
  }
}