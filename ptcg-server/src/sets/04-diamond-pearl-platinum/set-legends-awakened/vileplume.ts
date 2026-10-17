import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public hp: number = 120;
  public cardType: CardType[] = [G];
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Energy Reaction',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you attach a Grass or Psychic Energy card from your hand to Vileplume (excluding effects of attacks or Poké-Powers), you may use this power. If you attach a Grass Energy card, the Defending Pokémon is now Asleep. If you attach a Psychic Energy card, the Defending Pokémon is now Poisoned. This power can\'t be used if Vileplume is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Disturbing Pollen',
    cost: [P, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, your opponent can\'t play any Trainer, Supporter, or Stadium cards from his or her hand during your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Vileplume';
  public fullName: string = 'Vileplume LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Reaction
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      if (!player.hand.cards.includes(effect.energyCard)) {
        return state;
      }
      if (effect.energyCard.energyType !== EnergyType.BASIC) {
        return state;
      }
      if (effect.target.specialConditions.length > 0) {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, player);
      const stubAttack = new AttackEffect(player, opponent, this.attacks[0]);
      if (effect.energyCard.provides.includes(CardType.GRASS)) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, stubAttack);
      } else if (effect.energyCard.provides.includes(CardType.PSYCHIC)) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, stubAttack);
      }
    }

    // Disturbing Pollen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, supporter: true });
        }
      });
    }

    return state;
  }
}
