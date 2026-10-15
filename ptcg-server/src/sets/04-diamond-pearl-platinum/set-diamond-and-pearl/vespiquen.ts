import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Vespiquen extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Combee';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Leaf Honey',
    cost: [G],
    damage: 0,
    text: 'Discard a Grass Energy attached to Vespiquen and remove all damage counters from 1 of your Benched Grass Pokémon.'
  },
  {
    name: 'Attack Order',
    cost: [G, C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of Grass Pokémon in play (both yours and your opponent\'s).'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Vespiquen';
  public fullName: string = 'Vespiquen DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leaf Honey
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasGrassEnergy = player.active.cards.some(c =>
        c instanceof EnergyCard
        && (c.provides.includes(CardType.GRASS) || c.name === 'Grass Energy')
      );

      if (!hasGrassEnergy) {
        return state;
      }

      const blocked: CardTarget[] = [];
      player.bench.forEach((b, index) => {
        const pokemon = b.getPokemonCard();
        if (!pokemon || !pokemon.cardType.includes(CardType.GRASS) || b.damage === 0) {
          // Allow selecting any Grass benched even without damage (heal all = 0)
          if (!pokemon || !pokemon.cardType.includes(CardType.GRASS)) {
            blocked.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
          }
        }
      });

      const hasBenchedGrass = player.bench.some(b => {
        const pokemon = b.getPokemonCard();
        return pokemon !== undefined && pokemon.cardType.includes(CardType.GRASS);
      });

      if (!hasBenchedGrass) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_ENERGY_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.active, player.discard, { cards, sourceCard: this });

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1, blocked }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const healEffect = new HealEffect(player, targets[0], targets[0].damage);
          store.reduceEffect(state, healEffect);
        });
      });
    }

    // Attack Order
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let grassInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.cardType.includes(CardType.GRASS)) {
          grassInPlay += 1;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_list, card) => {
        if (card.cardType.includes(CardType.GRASS)) {
          grassInPlay += 1;
        }
      });
      effect.damage = 10 * grassInPlay;
    }

    return state;
  }
}
