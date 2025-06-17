import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, GameError, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Power of Evolution',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Electabuzz is an Evolved Pokémon, you may draw a card from the bottom of your deck. This power can\'t be used if Electabuzz is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Swift',
    cost: [F, C],
    damage: 30,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const cardList = StateUtils.findCardList(state, effect.card) as PokemonCardList;
      if (cardList.getPokemons().length < 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const bottomCards = player.deck.cards.slice(-1);
      player.deck.moveCardsTo(bottomCards, player.hand);

      ABILITY_USED(player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 30);
    }

    return state;
  }
}
