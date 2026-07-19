import { Card, EnergyType } from '../game';
import { ConstructedFormat } from '../game/store/format/format';
import { Erratum, GameplayRule } from '../game/store/format/format-types';
import {
  AT_LEAST_ONE_BASIC,
  CHECK_MAX_COUNTS,
  COUNT_CARDS_IN_DECK,
} from '../game/store/prefabs/formats';
import { getPrintingReleaseDate } from '../game/format/printing-release-date';
import { SetReleaseDates } from '../backend/controllers/decks';

export class HIJStandard extends ConstructedFormat {
  name = 'HIJ Standard';
  shortName = 'TEF-on';
  fullName = 'HIJ Standard';

  gameplayRules = [GameplayRule.T1_FIRST_NO_ATTACK, GameplayRule.T1_FIRST_NO_SUPPORTER];

  errata = [
    Erratum.TOOLS_ARE_NOT_ITEMS,
    Erratum.RARE_CANDY_NERF,
    Erratum.POTION_HEALS_30,
    Erratum.GREAT_BALL_TOP_7,
    Erratum.POKEMON_CATCHER_COIN_FLIP,
    Erratum.ENERGY_RETRIEVAL_UP_TO_2,
    Erratum.ENERGY_RECYCLER_UP_TO_5,
    Erratum.SACRED_ASH_UP_TO_5,
  ];

  banlist = [{ name: 'Fairy Energy', set: '*', setNumber: '*' }];

  isCardLegal(card: Card): boolean {
    const setDate = getPrintingReleaseDate(card, SetReleaseDates);
    return (
      (['H', 'I', 'J'].includes(card.regulationMark) || card.energyType == EnergyType.BASIC) &&
      !this.isCardOnBanlist(card) &&
      !!setDate &&
      setDate <= new Date()
    );
  }

  isDeckLegal(deck: Card[]): boolean {
    var isLegal = true;
    isLegal &&= super.isDeckLegal(deck); // Deck size, card legality checks

    let deckCounts = COUNT_CARDS_IN_DECK(deck);

    isLegal &&= AT_LEAST_ONE_BASIC(deckCounts);
    isLegal &&= CHECK_MAX_COUNTS(deckCounts);

    return isLegal;
  }
}
