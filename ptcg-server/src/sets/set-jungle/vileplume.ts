import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, BoardEffect } from '../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, CoinFlipPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Heal',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, remove 1 damage counter from 1 of your Pokémon. This power can\'t be used if Vileplume is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Petal Dance',
    cost: [G, G, G],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 40 damage times the number of heads. Vileplume is now Confused (after doing damage).'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume JU';

  public readonly HEAL_MARKER = 'HEAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
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

      if (player.marker.hasMarker(this.HEAL_MARKER)) {
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
        { min: 0, max: 1, allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }
        player.marker.addMarker(this.HEAL_MARKER, this);

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 10);
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

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.HEAL_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 40 * heads;
      });
      player.active.addSpecialCondition(SpecialCondition.CONFUSED);
      return state;
    }

    return state;
  }
}