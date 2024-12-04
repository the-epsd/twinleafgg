import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, CardTarget, ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Arboliva extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 150;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Dolliv';

  public powers = [{
    name: 'Enriching Oil',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may heal all damage from 1 of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 150,
      text: ''
    }
  ];

  public regulationMark: string = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Arboliva';
  public fullName: string = 'Arboliva SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const blocked: CardTarget[] = [];
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList.damage === 0) {
              blocked.push(target);
            }
          });

          let targets: PokemonCardList[] = [];
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_HEAL,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 0, max: 1, allowCancel: false, blocked }
          ), results => {
            targets = results || [];
            if (targets.length === 0) {
              return state;
            }

            targets.forEach(target => {
              // Heal Pokemon
              const healEffect = new HealEffect(player, target, 999);
              store.reduceEffect(state, healEffect);
            });

            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
              if (cardList.getPokemonCard() === this) {
                cardList.addBoardEffect(BoardEffect.ABILITY_USED);
              }
            });

            return state;
          });
        }
      });
    }
    return state;
  }
}