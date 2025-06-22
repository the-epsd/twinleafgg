import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, StateUtils, GameError, DamageMap, PlayerType, MoveDamagePrompt, SlotType, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class MeowsticEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = P;
  public hp: number = 160;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Shadow Ear',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may move 1 damage counter from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Mind Shock',
    cost: [P, C],
    damage: 60,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'GEN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Meowstic-EX';
  public fullName: string = 'Meowstic-EX GEN';

  public readonly SHADOW_EAR_MARKER = 'SHADOW_EAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.SHADOW_EAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blockedTo: CardTarget[] = [];
      const blockedFrom: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        blockedTo.push(target);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        blockedFrom.push(target);
      });

      // damage map gaming
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      // doing the actual moving of cards
      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 1, allowCancel: false, blockedTo, blockedFrom }
      ), transfers => {
        if (transfers === null) {
          return;
        }
        player.marker.addMarker(this.SHADOW_EAR_MARKER, this);
        ABILITY_USED(player, this);

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
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
    }

    return state;
  }
}