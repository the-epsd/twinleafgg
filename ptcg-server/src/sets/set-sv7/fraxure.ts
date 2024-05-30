import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';

export class Fraxure extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Axew';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 100;
  public weakness = [];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Unnerve',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokemon.'
  }];
  public attacks = [{
    name: 'Dragon Pulse',
    cost: [CardType.FIGHTING, CardType.METAL],
    damage: 80,
    text: 'Discard the top card of your deck'
  }];

  public set: string = 'SV6a';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure SV6a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public regulationMark: string = 'H';

}