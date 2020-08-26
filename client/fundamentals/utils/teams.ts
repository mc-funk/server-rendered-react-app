import { Team, BaseMetrics, RawTeam, DRFResponse } from '../state/types';
import { PreMember } from './../ui/components/TeamReport/types';
import { BarChartItem } from './../ui/charts/BarChart/types';
import { APIKey } from '../ui/types/ReportType';
import moment from 'moment';
import produce from 'immer';

/*
 * Takes a list of period data, as provided by the API results and transforms
 * to key & value data the Chart UI can take.
 */
export const periodsToChartPeriod = <T extends BaseMetrics>(
  periods: T[] | undefined,
  reportType: APIKey<T>
) => {
  if (periods === undefined) return [];
  return periods.map(
    (x: T): BarChartItem => {
      const value = x[reportType];
      if (typeof value === 'number') {
        return { key: moment(x.period_start_date), value };
      }
      return { key: moment(x.period_start_date), value: 0 };
    }
  );
};

/*
 * Results are deliverd in an array from the API. This function transforms the array
 * into an object of objects, instead.
 *
 */
export const resultsToObjectFromArray = (res: DRFResponse<RawTeam>) =>
  res.results.reduce(
    (acc: Record<number, Team>, curr: RawTeam): Record<number, Team> => ({
      ...acc,
      [curr.id]: {
        ...curr,
        children: new Set<number>(),
      },
    }),
    {}
  );

/*
 * Takes an object of objects and goes through each checking If the object has a
 * parent, it updates the parent's children field by adding the current ID.
 */
export const populateChildren = (
  team: Record<string, Team>
): Record<number, Team> => {
  return produce(team, (draftTeams) => {
    const teamIds = Object.keys(team);
    for (let i = 0; i < teamIds.length; i++) {
      const k = teamIds[i];
      const newK = parseInt(k);
      const currId = team[newK].id;
      const parentId = team[newK].parent_id;
      if (parentId && draftTeams[parentId]) {
        draftTeams[parentId].children.add(currId);
      }
    }
  });
};

/*
 * Search filtering based on filterList function written by Peter Bengtsson (@peterbe).
 * Found at https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
 * Permission is given for reuse down in the comments.
 * Matches on multiple words and partial last word.
 */

const escapeRegExp = (x: string) => x.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

// Breaks text into array.
const splitWords = (x: string) =>
  x
    .split(/\s+/g)
    .map((x: string) => x.trim())
    .filter((x: string) => !!x);

const hasTrailingSpace = (x: string) => x.endsWith(' ');

// Produces an array of regular expressions for each of the list items.
const getRegEscWords = (words: string[], hasTrailingSpace: boolean) =>
  words.map(
    (w: string, i: number) =>
      words.length === i + 1 && !hasTrailingSpace
        ? `(?=.*\\b${escapeRegExp(w)})` // If the last word is partial, it will be considered.
        : `(?=.*\\b${escapeRegExp(w)}\\b)` // If it is not the last word, it must be whole.
  );

// Joins the regex's together and performs search.
export const searchRegex = (phrase: string) =>
  new RegExp(
    getRegEscWords(splitWords(phrase), hasTrailingSpace(phrase)).join('') +
      '.+',
    'gi'
  );

export const filterListByPhrase = (
  list: Record<number, PreMember>,
  phrase: string
) =>
  Object.values(list).filter((x: PreMember) =>
    searchRegex(phrase).test(x.name)
  );

/* End search filtering */
