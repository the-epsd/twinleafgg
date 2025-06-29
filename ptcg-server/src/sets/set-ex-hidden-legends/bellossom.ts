import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, GameError, PokemonCardList, ChoosePokemonPrompt, PlayerType, SlotType, CardTarget, SelectPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Bellossom extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gloom';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Heal Dance',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may remove 2 damage counters from 1 of your Pokémon. You can\'t use more than 1 Heal Dance Poké-Power each turn.This power can\'t be used if Bellossom is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Miracle Powder',
    cost: [G],
    damage: 10,
    text: 'Flip a coin. If heads, choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
  },
  {
    name: 'Solar Beam',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Bellossom';
  public fullName: string = 'Bellossom HL';

  public readonly HEAL_DANCE_MARKER = 'HEAL_DANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (HAS_MARKER(this.HEAL_DANCE_MARKER, player)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage: boolean = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (hasPokemonWithDamage === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let targets: PokemonCardList[] = [];
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 20);
          store.reduceEffect(state, healEffect);
        });
      });


      ADD_MARKER(this.HEAL_DANCE_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEAL_DANCE_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const options: { message: GameMessage, value: SpecialCondition }[] = [
            { message: GameMessage.SPECIAL_CONDITION_PARALYZED, value: SpecialCondition.PARALYZED },
            { message: GameMessage.SPECIAL_CONDITION_CONFUSED, value: SpecialCondition.CONFUSED },
            { message: GameMessage.SPECIAL_CONDITION_ASLEEP, value: SpecialCondition.ASLEEP },
            { message: GameMessage.SPECIAL_CONDITION_POISONED, value: SpecialCondition.POISONED },
            { message: GameMessage.SPECIAL_CONDITION_BURNED, value: SpecialCondition.BURNED }
          ];

          store.prompt(state, new SelectPrompt(
            player.id,
            GameMessage.CHOOSE_SPECIAL_CONDITION,
            options.map(c => c.message),
            { allowCancel: false }
          ), choice => {
            const option = options[choice];

            if (option !== undefined) {
              const specialConditionEffect = new AddSpecialConditionsEffect(effect, [option.value]);
              store.reduceEffect(state, specialConditionEffect);
            }
          });
        }
      });
    }

    return state;
  }
}
