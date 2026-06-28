import {
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PowerType,
  SlotType,
  State,
  StoreLike,
} from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { BREAK_RULE, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class GreninjaBREAK extends PokemonCard {
  public stage: Stage = Stage.BREAK;
  public tags = [CardTag.BREAK];
  public evolvesFrom = 'Greninja';
  public cardType: CardType = W;
  public hp: number = 170;

  public powers = [
    {
      name: 'Giant Water Shuriken',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: "Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard a [W] Energy card from your hand. If you do, put 6 damage counters on 1 of your opponent's Pokémon.",
    },
  ];

  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Greninja BREAK';
  public fullName: string = 'Greninja BREAK BKP';

  public readonly GIANT_WATER_SHURIKEN_MARKER = 'GIANT_WATER_SHURIKEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Giant Water Shuriken
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      // Check marker
      if (player.marker.hasMarker(this.GIANT_WATER_SHURIKEN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let waterInHand = false;
      player.hand.cards.forEach((card) => {
        if (card.superType === SuperType.ENERGY && card.name === 'Water Energy') {
          waterInHand = true;
        }
      });
      if (!waterInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ENERGY, name: 'Water Energy' },
          { allowCancel: false, min: 1, max: 1 },
        ),
        (cards) => {
          cards = cards || [];
          player.marker.addMarker(this.GIANT_WATER_SHURIKEN_MARKER, this);
          MOVE_CARDS(store, state, player.hand, player.discard, {
            cards,
            sourceCard: this,
            sourceEffect: this.powers[1],
          });

          return store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH, SlotType.ACTIVE],
              { min: 1, max: 1, allowCancel: false },
            ),
            (selected) => {
              const targets = selected || [];

              if (targets.length > 0) {
                const damageEffect = new EffectOfAbilityEffect(
                  player,
                  this.powers[1],
                  this,
                  targets[0],
                );
                store.reduceEffect(state, damageEffect);
                if (damageEffect.target) {
                  damageEffect.target.damage += 60;
                }
              }
            },
          );
        },
      );

      return state;
    }

    BREAK_RULE(effect, state, this);

    return state;
  }
}
