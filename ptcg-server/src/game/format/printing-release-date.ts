export type PromoReleaseRule = {
  set: string;
  from: number;
  to: number;
  date: Date;
};

type PromoRangeInput = [from: number, to: number, date: string];

const promoRangesBySet: { [set: string]: PromoRangeInput[] } = {
  // Promo release dates are assigned to the same release date
  // as the latest set at the time of the promo's release

  // Wizards Promos
  PR: [
    [1, 1, '1999-06-16'],
    [2, 10, '1999-10-10'],
    [11, 11, '2000-04-24'],
    [12, 15, '1999-10-10'],
    [16, 18, '2000-04-24'],
    [19, 20, '2000-08-14'],
    [21, 23, '2000-04-24'],
    [24, 24, '2000-12-16'],
    [25, 26, '2001-06-01'],
    [27, 27, '2000-10-16'],
    [28, 28, '2001-06-01'],
    [29, 32, '2000-12-16'],
    [33, 33, '2001-06-01'],
    [34, 36, '2000-12-16'],
    [37, 39, '2001-06-01'],
    [40, 43, '2001-09-21'],
    [44, 46, '2002-02-28'],
    [47, 49, '2002-05-24'],
    [50, 52, '2002-09-15'],
    [53, 53, '2003-01-15'],
  ],
  NP: [
    // Nintendo Promos
    [1, 2, '2003-07-18'],
    [3, 4, '2003-09-18'],
    [5, 7, '2003-11-24'],
    [8, 9, '2003-09-18'],
    [10, 20, '2003-11-24'],
    [21, 23, '2004-03-15'],
    [24, 26, '2004-06-14'],
    [27, 28, '2005-05-09'],
    [29, 35, '2005-08-22'],
    [36, 40, '2006-05-03'],
  ],
  DPP: [
    // Diamond & Pearl Promos (kinda guesswork. Can't find good sources for release dates of these)
    [1, 4, '2007-05-23'],
    [5, 8, '2007-08-22'],
    [9, 16, '2007-11-07'],
    [17, 19, '2008-02-13'],
    [20, 23, '2008-05-21'],
    [24, 25, '2008-08-20'],
    [26, 29, '2008-11-05'],
    [30, 34, '2009-02-11'],
    [35, 36, '2009-02-11'],
    [37, 44, '2009-05-16'],
    [45, 49, '2009-08-19'],
    [50, 56, '2009-11-04'],
  ],
  HSP: [
    // HeartGold & SoulSilver Promos (best-effort mapping from promo timeline)
    [1, 9, '2010-02-10'],
    [10, 13, '2010-05-12'],
    [14, 18, '2010-08-18'],
    [19, 23, '2010-11-03'],
    [24, 25, '2011-02-09'],
  ],
  BWP: [
    // Black & White Promos (best-effort mapping from promo timeline; earliest known release used)
    [1, 10, '2011-04-25'],
    [11, 24, '2011-08-31'],
    [25, 31, '2011-11-16'],
    [32, 35, '2012-02-08'],
    [36, 43, '2012-05-09'],
    [44, 50, '2012-08-15'],
    [51, 57, '2012-11-07'],
    [58, 72, '2013-02-06'],
    [73, 83, '2013-05-08'],
    [84, 95, '2013-08-14'],
    [96, 101, '2013-11-06'],
  ],
  XYP: [
    // XY Promos (best-effort mapping from promo timeline; earliest known release used)
    [1, 9, '2014-02-05'],
    [10, 12, '2014-05-07'],
    [13, 20, '2014-08-13'],
    [21, 33, '2014-11-05'],
    [34, 40, '2015-02-04'],
    [41, 52, '2015-05-06'],
    [53, 67, '2015-08-12'],
    [68, 90, '2015-11-04'],
    [91, 105, '2016-02-03'],
    [106, 126, '2016-05-02'],
    [127, 147, '2016-08-03'],
    [148, 176, '2016-11-02'],
    [177, 211, '2017-02-03'],
  ],
  SMP: [
    // Sun & Moon Promos (best-effort mapping from promo timeline; earliest known release used)
    [1, 17, '2017-02-03'],
    [18, 39, '2017-05-05'],
    [40, 49, '2017-08-04'],
    [50, 75, '2017-11-03'],
    [76, 104, '2018-02-02'],
    [105, 124, '2018-04-05'],
    [125, 148, '2018-07-09'],
    [149, 166, '2018-11-02'],
    [167, 200, '2019-03-05'],
    [201, 217, '2019-08-23'],
    [218, 243, '2019-11-01'],
    [244, 248, '2020-02-07'],
  ],
  SWSH: [
    // Sword & Shield Promos (best-effort mapping from promo timeline; earliest known release used)
    [1, 21, '2020-02-07'],
    [22, 34, '2020-05-01'],
    [35, 60, '2020-08-14'],
    [61, 87, '2021-02-19'],
    [88, 121, '2021-06-18'],
    [122, 132, '2021-08-27'],
    [133, 148, '2021-10-08'],
    [149, 178, '2021-11-12'],
    [179, 204, '2022-02-25'],
    [205, 239, '2022-07-01'],
    [240, 276, '2022-11-11'],
    [277, 302, '2023-01-20'],
    [303, 307, '2023-06-09'],
  ],
  SVP: [
    // Scarlet & Violet Promos (best-effort mapping from promo timeline; earliest known release used)
    [1, 18, '2023-03-31'],
    [19, 35, '2023-06-09'],
    [36, 45, '2023-08-11'],
    [46, 56, '2023-09-22'],
    [57, 68, '2023-11-03'],
    [69, 88, '2024-01-26'],
    [89, 104, '2024-03-22'],
    [105, 128, '2024-05-22'],
    [129, 143, '2024-08-02'],
    [144, 159, '2024-09-13'],
    [160, 180, '2024-11-08'],
    [181, 190, '2025-01-17'],
    [191, 198, '2025-03-28'],
    [199, 218, '2025-05-17'],
    [219, 225, '2025-07-18'],
  ],
  MEP: [
    // Mega Evolution Promos (best-effort mapping from promo timeline; earliest known release used)
    [1, 13, '2025-09-26'],
    [14, 30, '2025-11-14'],
    [31, 33, '2026-01-28'],
    [34, 45, '2026-03-27'],

    [64, 71, '2026-05-22'],
  ],
};

export const PromoReleaseDates: PromoReleaseRule[] = Object.entries(promoRangesBySet)
  .reduce<PromoReleaseRule[]>((rules, [set, ranges]) => {
    ranges.forEach(([from, to, date]) => {
      rules.push({ set, from, to, date: new Date(date) });
    });
    return rules;
  }, []);

/**
 * Resolves the effective release date for a card printing.
 * Promo sets use per-number release windows when mapped; otherwise falls back to the set date.
 */
export function getPrintingReleaseDate(
  card: { set: string; setNumber: string },
  setReleaseDates: { [key: string]: Date },
): Date | undefined {
  const setNumber = parseInt(card.setNumber, 10);
  if (!Number.isNaN(setNumber)) {
    const ranges = promoRangesBySet[card.set];
    if (ranges) {
      for (const [from, to, date] of ranges) {
        if (setNumber >= from && setNumber <= to) {
          return new Date(date);
        }
      }
    }
  }
  return setReleaseDates[card.set];
}
