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
import { ABILITY_USED, ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Jynx extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Ominous Posture',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another of your Pokémon.'
  }];

  public attacks = [{
    name: 'Attract Smack',
    cost: [P, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'UNM';
  public name: string = 'Jynx';
  public fullName: string = 'Jynx UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';

  public readonly OMINOUS_POSTURE_MARKER = 'OMINOUS_POSTURE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.OMINOUS_POSTURE_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.OMINOUS_POSTURE_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damagedPokemon: DamageMap[] = [];
      let hasDamagedPokemon = false;

      if (HAS_MARKER(this.OMINOUS_POSTURE_MARKER, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      if (!hasDamagedPokemon) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        maxAllowedDamage,
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        ADD_MARKER(this.OMINOUS_POSTURE_MARKER, player, this);
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
      COIN_FLIP_PROMPT(store, state, effect.player, (result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      }));
    }

    return state;
  }

}
