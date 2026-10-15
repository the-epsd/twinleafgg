import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, GamePhase, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Electrode extends PokemonCard implements EnergyCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Voltorb';
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Energy Shift',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, if Electrode would be Knocked Out by damage from an attack, you may use this power. Electrode isn\'t discarded. Instead, attach it as an Energy card to 1 of your Pokémon. While attached, this card is a Special Energy card and provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.)'
  }];

  public attacks = [{
    name: 'Ion Blast',
    cost: [L, C],
    damage: 40,
    damageCalculation: '+',
    text: 'You may do 40 damage plus 60 more damage. If you do, Electrode does 100 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Electrode';
  public fullName: string = 'Electrode SW';

  public provides: CardType[] = [CardType.ANY];
  public energyType = EnergyType.SPECIAL;
  public text: string = '';
  public isBlocked = false;
  public energyEffect: any = undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (this.superType === SuperType.ENERGY) {
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList) || !cardList.energies.cards.includes(this)) {
        this.superType = SuperType.POKEMON;
      }
    }

    // Energy Shift
    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      if (state.players[state.activePlayer] !== player) {
        return state;
      }
      if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      const hasOtherPokemon = player.getPokemonInPlay().some(list => list.getPokemonCard() !== this);
      if (!hasOtherPokemon) {
        return state;
      }

      return CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        effect.prizeCount = 0;
        effect.preventDefault = true;

        const sourceList = effect.target;
        const blocked: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
          if (card === this) {
            blocked.push(target);
          }
        });
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, blocked }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }

          const pokemons = sourceList.getPokemons().filter(p => p !== this);
          const tools = [...sourceList.tools];
          const otherCards = sourceList.cards.filter(
            c => !(c instanceof PokemonCard) && !sourceList.getPokemons().includes(c as PokemonCard) && !tools.includes(c)
          );

          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, sourceList, player.discard, { cards: otherCards, sourceCard: this });
          }
          for (const tool of tools) {
            MOVE_CARDS(store, state, sourceList, player.discard, { cards: [tool], sourceCard: this });
          }
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, sourceList, player.discard, { cards: pokemons, sourceCard: this });
          }

          MOVE_CARDS(store, state, sourceList, targets[0], { cards: [this], sourceCard: this });
          if (!targets[0].energies.cards.includes(this)) {
            targets[0].energies.cards.push(this);
          }
          this.superType = SuperType.ENERGY;
          sourceList.clearEffects();
          sourceList.damage = 0;
        });
      });
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: this.provides.slice() });
    }

    // Ion Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 60;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 100);
        }
      });
    }

    return state;
  }
}
