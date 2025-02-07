import { Attack, CardType, CardTarget, EnergyType, PlayerType, PokemonCard, Power, PowerType, SlotType, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { ATTACH_ENERGY_FROM_DECK, DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED, WAS_POWER_USED } from "../../game/store/prefabs/prefabs";

export class Pawmot extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pawmo';
  public cardType: CardType = L;
  public hp: number = 130;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [];

  public powers: Power[] = [{
    name: 'Electrogenesis',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may search your deck for a Basic [L] Energy card ' +
      'and attach it to this Pokémon. Then, shuffle your deck.'
  }];

  public attacks: Attack[] = [
    { name: 'Electro Paws', cost: [L, L, C], damage: 230, text: 'Discard all Energy from this Pokémon.' },
  ];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Pawmot';
  public fullName: string = 'Pawmot SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      let blocked: CardTarget[] = [];
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card !== this)
          blocked.push(target);
      });
      ATTACH_ENERGY_FROM_DECK(
        store,
        state,
        effect.player,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { blockedTo: blocked },
      );
    }

    if (WAS_ATTACK_USED(effect, 0, this))
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);

    return state;
  }
}