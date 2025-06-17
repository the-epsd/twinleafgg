import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, GameError, StateUtils, PokemonCardList, CardTarget, PlayerType, ChoosePokemonPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';

export class Blissey extends PokemonCard {
  public stage: Stage = Stage.STAGE_1
  public evolvesFrom = 'Chansey';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Happy Healing',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), choose 1 of your Benched Pokémon and flip a coin. If heads, count the number of Energy attached to Blissey and then remove that many damage counters from the chosen Benched Pokémon. This power can\'t be used if Blissey is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Smash Bomber',
    cost: [C, C, C],
    damage: 50,
    text: 'Flip a coin. If tails, this attack does nothing.',
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Blissey';
  public fullName: string = 'Blissey AQ';

  public readonly HAPPY_HEALING_MARKER = 'HAPPY_HEALING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (HAS_MARKER(this.HAPPY_HEALING_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ABILITY_USED(player, this);
      ADD_MARKER(this.HAPPY_HEALING_MARKER, player, this);

      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          const player = effect.player;
          const cardList = StateUtils.findCardList(state, effect.card) as PokemonCardList;

          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergyEffect);
          // Getting count of energies
          let energies: number = 0;
          checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });

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
            [SlotType.BENCH],
            { min: 0, max: 1, allowCancel: true, blocked }
          ), results => {
            targets = results || [];
            if (targets.length === 0) {
              return state;
            }

            targets.forEach(target => {
              // Heal Pokemon
              const healEffect = new HealEffect(player, target, 10 * energies);
              store.reduceEffect(state, healEffect);
            });
          });
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HAPPY_HEALING_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
