import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, StateUtils, DamageMap, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Milotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Feebas';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Healing Shower',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Milotic from your hand to evolve 1 of your Pokémon, you may remove all damage counters from all of your Pokémon and your opponent\'s Pokémon (excluding Pokémon-ex).'
  }];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Distorted Wave',
    cost: [W, W, C, C],
    damage: 80,
    text: 'Before doing damage, remove 3 damage counters from the Defending Pokémon (all if there are less than 3).'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Milotic';
  public fullName: string = 'Milotic HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {

      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (wantToUse) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);

          let hasDamagedPokemon = false;
          const damagedPokemon: DamageMap[] = [];
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList.damage > 0) {
              hasDamagedPokemon = true;
              damagedPokemon.push({ target, damage: cardList.damage });
            }
          });

          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
            if (cardList.damage > 0) {
              hasDamagedPokemon = true;
              damagedPokemon.push({ target, damage: cardList.damage });
            }
          });

          if (!hasDamagedPokemon) {
            return state;
          }

          // Heal all damage
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            if (!cardList.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
              const healEffect = new HealEffect(player, cardList, cardList.damage);
              state = store.reduceEffect(state, healEffect);
            }
          });

          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            if (!cardList.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
              const healEffect = new HealEffect(opponent, cardList, cardList.damage);
              state = store.reduceEffect(state, healEffect);
            }
          });
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const healEffect = new HealEffect(effect.opponent, effect.opponent.active, 30);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }

}
