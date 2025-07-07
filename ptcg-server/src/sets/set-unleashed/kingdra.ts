import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, GameError, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Kingdra extends PokemonCard {
  public tags = [CardTag.PRIME];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Seadra';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Spray Splash',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may put 1 damage counter on 1 of your opponent\'s Pokémon.This power can\'t be used if Kingdra is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Dragon Steam ',
    cost: [W],
    damage: 60,
    text: 'If your opponent has any [R] Pokémon in play, this attack\'s base damage is 20 instead of 60.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Kingdra';
  public fullName: string = 'Kingdra UL';

  public readonly SPRAY_SPLASH_MARKER = 'SPRAY_SPLASH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SPRAY_SPLASH_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SPRAY_SPLASH_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.SPRAY_SPLASH_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },

      ), selected => {
        const targets = selected || [];

        if (targets.length > 0) {
          const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
          store.reduceEffect(state, damageEffect);
          if (damageEffect.target) {
            damageEffect.target.damage += 10;
          }
        }
        player.marker.addMarker(this.SPRAY_SPLASH_MARKER, this);
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasFire = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, pokemon) => {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);

        if (checkPokemonType.cardTypes.includes(CardType.FIRE)) {
          hasFire = true;
        }
      });

      if (hasFire) {
        effect.damage = 20;
      }
    }

    return state;
  }

}
