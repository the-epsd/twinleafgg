import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GameError, GameMessage, StateUtils, PokemonCardList, CardTarget, PlayerType, ChoosePokemonPrompt, SlotType } from "../../../game";
import { CheckProvidedEnergyEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { HealEffect } from "../../../game/store/effects/game-effects";
import { WAS_POWER_USED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN } from "../../../game/store/prefabs/prefabs";

export class Shuckle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Fermented Juice',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon has any [G] Energy attached, you may use this Ability. Heal 30 damage from 1 of your Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Rollout',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Shuckle';
  public fullName: string = 'Shuckle MEG';

  public readonly FERMENTED_JUICE_MARKER = 'FERMENTED_JUICE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkEnergy);
      const hasGrassEnergy = StateUtils.checkEnoughEnergy(checkEnergy.energyMap, [CardType.GRASS]);

      if (!hasGrassEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: CardTarget[] = [];
      let hasTarget = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (targetList, card, target) => {
        if (targetList.damage === 0) {
          blocked.push(target);
        } else {
          hasTarget = true;
        }
      });

      if (!hasTarget) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.FERMENTED_JUICE_MARKER, this);
      ABILITY_USED(player, this);

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), targets => {
        if (targets && targets.length > 0) {
          const healEffect = new HealEffect(player, targets[0], 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FERMENTED_JUICE_MARKER, this);

    return state;
  }
}
