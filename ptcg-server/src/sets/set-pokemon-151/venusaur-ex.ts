import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StoreLike, State, PowerType, StateUtils, CardTarget, GameError, GameMessage, PlayerType, PokemonCardList, ChoosePokemonPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

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

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage: boolean = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (player.active.cards[0] !== this || hasPokemonWithDamage === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 60);
          store.reduceEffect(state, healEffect);
        });

        return state;
      });
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, player);

      const active = opponent.active;
      active.addSpecialCondition(SpecialCondition.BURNED);
      active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    return state;
  }
}