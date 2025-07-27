import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { ABILITY_USED, ADD_MARKER, AFTER_ATTACK, BLOCK_IF_HAS_SPECIAL_CONDITION, CONFIRMATION_PROMPT, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Haunter';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D, value: +30 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Curse',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may move 1 damage counter from 1 of your opponent\'s Pokémon to another of your opponent\'s Pokémon. This power can\'t be used if Gengar is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Shadow Skip',
    cost: [P, P, C],
    damage: 60,
    text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) You may switch Gengar with 1 of your Benched Pokémon.'
  }];

  public set: string = 'AR';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';

  public readonly CURSE_MARKER = 'CURSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.CURSE_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CURSE_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damagedPokemon: DamageMap[] = [];
      let hasDamagedPokemon = false;

      if (HAS_MARKER(this.CURSE_MARKER, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      if (!hasDamagedPokemon) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        ADD_MARKER(this.CURSE_MARKER, player, this);
        ABILITY_USED(player, this);

        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 10) {
            source.damage -= 10;
            target.damage += 10;
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    return state;
  }

}
