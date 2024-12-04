import { PokemonCard } from '../../game/store/card/pokemon-card';
import { BoardEffect, CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StoreLike, State, PowerType, StateUtils, CardTarget, GameError, GameMessage, PlayerType, PokemonCardList, ChoosePokemonPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Venusaurex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Ivysaur';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 340;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public powers = [{
    name: 'Tranquil Flower',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may heal 60 damage from 1 of your Pokémon.'
  }];
  public attacks = [
    {
      name: 'Dangerous Toxwhip',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 150,
      text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
    }
  ];
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Venusaur ex';
  public fullName: string = 'Venusaur ex MEW';

  public readonly TRANQUIL_FLOWER_MARKER = 'TRANQUIL_FLOWER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TRANQUIL_FLOWER_MARKER)) {
      const player = effect.player;
      player.marker.removeMarker(this.TRANQUIL_FLOWER_MARKER);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        }
      });

      const hasPokeBenchWithDamage = player.bench.some(b => b.damage > 0);
      const hasActiveWIthDamage = player.active.damage > 0;
      const pokemonInPlayWithDamage = hasPokeBenchWithDamage || hasActiveWIthDamage;

      if (player.marker.hasMarker(this.TRANQUIL_FLOWER_MARKER)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.active.cards[0] !== this || !pokemonInPlayWithDamage) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 0, max: 1, allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }
        player.marker.addMarker(this.TRANQUIL_FLOWER_MARKER, this);

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 60);
          store.reduceEffect(state, healEffect);
        });

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        return state;
      });
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const active = opponent.active;
      active.addSpecialCondition(SpecialCondition.POISONED);
      active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    return state;
  }
}