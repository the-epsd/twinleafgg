import { PokemonCard, Stage, CardType, PowerType, EnergyCard, PokemonCardList, SpecialCondition, StoreLike, State, GameError, GameMessage, CardTarget, PlayerType, EnergyType, ChoosePokemonPrompt, SlotType, ChooseCardsPrompt, SuperType, SelectPrompt, StateUtils } from "../../game";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { CheckProvidedEnergyEffect, AddSpecialConditionsPowerEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { WAS_POWER_USED, HAS_MARKER, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, ADD_MARKER, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "../../game/store/prefabs/prefabs";

export class Porygon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Porygon';
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Converter',
    powerType: PowerType.POKEMON_POWER,
    text: 'Once during your turn (before your attack), you may choose 1 basic Energy card attached to 1 of your Pokémon and choose an Energy type. Treat that Energy card as that type until the end of your turn. This power can\'t be used if Porygon2 is Asleep, Confused, or Paralyzed. If Porygon2 becomes Asleep, Confused, or Paralyzed, the Energy card goes back to its original type.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Delta Beam',
    cost: [C, C, C],
    damage: 20,
    text: 'Flip a coin. If heads, choose whether the Defending Pokémon becomes Asleep, Confused, or Paralyzed.'
  }];

  public set: string = 'N3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Porygon2';
  public fullName: string = 'Porygon2 N3';

  public readonly ENERGY_CONVERTER_MARKER = 'ENERGY_CONVERTER_MARKER';

  private convertedEnergy: EnergyCard | undefined;
  private convertedType: CardType | undefined;

  private clearConversion(): void {
    this.convertedEnergy = undefined;
    this.convertedType = undefined;
  }

  private isAsleepConfusedOrParalyzed(cardList: PokemonCardList): boolean {
    return cardList.specialConditions.includes(SpecialCondition.ASLEEP)
      || cardList.specialConditions.includes(SpecialCondition.CONFUSED)
      || cardList.specialConditions.includes(SpecialCondition.PARALYZED);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.ENERGY_CONVERTER_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      const blocked: CardTarget[] = [];
      let hasBasicEnergy = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        const hasEnergy = cardList.cards.some(c =>
          c instanceof EnergyCard && c.energyType === EnergyType.BASIC
        );
        if (!hasEnergy) {
          blocked.push(target);
        } else {
          hasBasicEnergy = true;
        }
      });

      if (!hasBasicEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true, blocked }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        const target = targets[0];
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARDS,
          target,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 1, max: 1, allowCancel: true }
        ), selected => {
          if (!selected || selected.length === 0) {
            return;
          }

          const energyCard = selected[0] as EnergyCard;
          const options: { value: CardType, message: string }[] = [
            { value: CardType.COLORLESS, message: 'Colorless' },
            { value: CardType.DARK, message: 'Darkness' },
            { value: CardType.FIGHTING, message: 'Fighting' },
            { value: CardType.FIRE, message: 'Fire' },
            { value: CardType.GRASS, message: 'Grass' },
            { value: CardType.LIGHTNING, message: 'Lightning' },
            { value: CardType.METAL, message: 'Metal' },
            { value: CardType.PSYCHIC, message: 'Psychic' },
            { value: CardType.WATER, message: 'Water' },
          ];

          store.prompt(state, new SelectPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGY_TYPE,
            options.map(c => c.message),
            { allowCancel: false }
          ), choice => {
            const option = options[choice];
            if (!option) {
              return;
            }

            this.convertedEnergy = energyCard;
            this.convertedType = option.value;
            ADD_MARKER(this.ENERGY_CONVERTER_MARKER, player, this);
            ABILITY_USED(player, this);
          });
        });
      });
    }

    // Treat the chosen Energy as the selected type (Charizard Energy Burn pattern)
    if (effect instanceof CheckProvidedEnergyEffect
      && this.convertedEnergy
      && this.convertedType !== undefined
      && effect.source.cards.includes(this.convertedEnergy)) {

      const porygonList = StateUtils.findCardList(state, this);
      if (porygonList instanceof PokemonCardList && this.isAsleepConfusedOrParalyzed(porygonList)) {
        this.clearConversion();
        return state;
      }

      if (!effect.energyMap.some(e => e.card === this.convertedEnergy)) {
        const provides = this.convertedEnergy.provides.length > 0
          ? this.convertedEnergy.provides.map(() => this.convertedType!)
          : [this.convertedType];
        effect.energyMap.push({ card: this.convertedEnergy, provides });
      }
    }

    // Conversion ends if Porygon2 becomes Asleep, Confused, or Paralyzed
    if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
      if (effect.target.cards.includes(this)
        && effect.specialConditions.some(c =>
          c === SpecialCondition.ASLEEP
          || c === SpecialCondition.CONFUSED
          || c === SpecialCondition.PARALYZED
        )) {
        this.clearConversion();
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.clearConversion();
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ENERGY_CONVERTER_MARKER, this);

    // Delta Beam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const options: { message: GameMessage, value: SpecialCondition }[] = [
          { message: GameMessage.SPECIAL_CONDITION_ASLEEP, value: SpecialCondition.ASLEEP },
          { message: GameMessage.SPECIAL_CONDITION_CONFUSED, value: SpecialCondition.CONFUSED },
          { message: GameMessage.SPECIAL_CONDITION_PARALYZED, value: SpecialCondition.PARALYZED },
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
      });
    }

    return state;
  }
}
