import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State,
  GameError, GameMessage, PlayerType, SlotType,
  PokemonCardList,
  ChoosePokemonPrompt
} from '../../game';
import { CardTarget } from '../../game/store/actions/play-card-action';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Oricorioex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lombre';
  public cardType: CardType = G;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Excited Healing',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if you have a [G] Mega Evolution Pokémon ex in play, you may heal 60 damage from 1 of your Pokemon.'
  }];

  public attacks = [{
    name: 'Knock Down',
    cost: [G, C],
    damage: 120,
    text: ''
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Ludicolo';
  public fullName: string = 'Ludicolo M2';

  public readonly EXCITED_HEALING_MARKER = 'EXCITED_HEALING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasMegaEvolutionPokemonInPlay = player.active.cards.some(c => {
        return c instanceof PokemonCard
          && c.tags.includes(CardTag.POKEMON_ex)
          && c.tags.includes(CardTag.POKEMON_SV_MEGA)
          && c.cardType === CardType.GRASS;
      });
      if (!hasMegaEvolutionPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        }
      });

      const hasPokeBenchWithDamage = player.bench.some(b => b.damage > 0);
      const hasActiveWIthDamage = player.active.damage > 0;
      const pokemonInPlayWithDamage = hasPokeBenchWithDamage || hasActiveWIthDamage;

      if (player.marker.hasMarker(this.EXCITED_HEALING_MARKER)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!pokemonInPlayWithDamage) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }
        player.marker.addMarker(this.EXCITED_HEALING_MARKER, this);

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
    return state;
  }
}