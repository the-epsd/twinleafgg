import { AttachEnergyPrompt, CardList, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, Power, PowerType } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Electrode extends PokemonCard {

  public name = 'Electrode';

  public set = 'BS';

  public fullName = 'Electrode BS';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardType = CardType.LIGHTNING;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public hp = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers: Power[] = [
    {
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      name: 'Buzzap',
      text: 'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) that provides 2 energy of that type. You can’t use this power if Electrode is Asleep, Confused, or Paralyzed.',

    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Electric Shock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 50,
      text: 'Flip a coin. If tails, Electrode does 10 damage to itself.'
    }
  ];

  public provides: CardType[] = [CardType.COLORLESS];
  public text: string = '';
  public isBlocked: boolean = false;
  public blendedEnergies: CardType[] = [];
  public energyEffect: EnergyEffect | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const options = [
        { value: CardType.COLORLESS, message: 'Colorless' },
        { value: CardType.DARK, message: 'Dark' },
        { value: CardType.DRAGON, message: 'Dragon' },
        { value: CardType.FAIRY, message: 'Fairy' },
        { value: CardType.FIGHTING, message: 'Fighting' },
        { value: CardType.FIRE, message: 'Fire' },
        { value: CardType.GRASS, message: 'Grass' },
        { value: CardType.LIGHTNING, message: 'Lightning' },
        { value: CardType.METAL, message: 'Metal' },
        { value: CardType.PSYCHIC, message: 'Psychic' },
        { value: CardType.WATER, message: 'Water' }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGY_TYPE,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];

        if (!option) {
          return state;
        }

        // class ElectrodeEnergyCard extends EnergyCard {

        //   public superType: SuperType = SuperType.ENERGY;

        //   public energyType: EnergyType = EnergyType.BASIC;

        //   public format: Format = Format.NONE;

        //   public provides: CardType[] = [];

        //   public text: string = '';

        //   public isBlocked = false;

        //   public blendedEnergies: CardType[] = [];

        //   public energyEffect: EnergyEffect | undefined;

        // }

        const electrodeEnergy = this as unknown as EnergyCard;
        const energyList = new CardList();
        energyList.cards.push(electrodeEnergy);

        // Remove Electrode from its current location
        const currentList = StateUtils.findCardList(state, this);
        currentList.moveCardTo(this, player.discard);

        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          energyList,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          {},
          { allowCancel: true }
        ), transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to) as PokemonCardList;
            const attachEnergyEffect = new AttachEnergyEffect(player, electrodeEnergy as EnergyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
          }
          return state;
        });

      });

    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.FLIP_COIN
      ), (result) => {
        if (!result) {
          const selfDamage = new DealDamageEffect(effect, 10);
          selfDamage.target = effect.player.active;
          store.reduceEffect(state, selfDamage);
        }
      });
    }

    return state;
  }

}