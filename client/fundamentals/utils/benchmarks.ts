import { ReportKeys } from 'ui/types';
/*

Source material for this file:


enum Range {
    top = 'top',
    mid = 'mid',
    low = 'low',
}

const BENCHMARKS = [
    {
        [ColumnKeys.INDUSTRY_BENCHMARKS]: 'Leading',
        range: Range.top,
    },
    {
        [ColumnKeys.INDUSTRY_BENCHMARKS]: 'Primary',
        range: Range.mid,
    },
    {
        [ColumnKeys.INDUSTRY_BENCHMARKS]: 'Occasional',
        range: Range.low,
    },
];
def get_benchmarks(request):
    """
    Returns the industry benchmarks data.  This data is read-only to our
    customers, but are the results of Brian's research over 2016 data across
    the entire GitPrime customer base.
    """
    return {
        'code': {
            'act': {'low': 2.06, 'mid': 3.33, 'top': 4.10},
            'com': {'low': 2.06, 'mid': 4.00, 'top': 8.39},
            'imp': {'low': 77.3, 'mid': 213.5, 'top': 462.6},
            'eff': {'mid': 0.7},
        },
        'submit': {
            'responsiveness': {'mid': 6, 'top': 1.5},
            'comments_addressed_pct': {'mid': 0.3, 'top': 0.45},
            'receptiveness': {'range': [0.1, 0.2]},
            'unreviewed_prs': {'mid': 0.2, 'top': 0.05},
        },
        'review': {
            'reaction_time': {'mid': 18, 'top': 6},
            'involvement': {'mid': 0.8, 'top': 0.95},
            'influence': {'range': [0.2, 0.4]},
        }
    }
*/
type PartialRecord<K extends keyof never, T> = {
  [P in K]?: T;
};

const LOW = 'Occassional';
const MID = 'Primary';
const TOP = 'Leading';
const BENCHMARKS: PartialRecord<
  ReportKeys,
  Record<string, number | [number, number]>
> = {
  coding_days: {
    [LOW]: 2.06,
    [MID]: 3.33,
    [TOP]: 4.1,
  },
  commits_per_day: {
    [LOW]: 2.06,
    [MID]: 4,
    [TOP]: 8.39,
  },
  impact: {
    [LOW]: 77.3,
    [MID]: 213.5,
    [TOP]: 462.6,
  },
  efficiency: {
    [MID]: 0.7,
  },
  responsiveness: {
    [MID]: 6,
    [TOP]: 1.5,
  },
  comments_addressed: {
    [MID]: 0.3,
    [TOP]: 0.45,
  },
  receptiveness: {
    range: [0.1, 0.2],
  },
  unreviewed_prs: {
    [MID]: 0.2,
    [TOP]: 0.05,
  },
  reaction_time: {
    [MID]: 18,
    [TOP]: 6,
  },
  involvement: {
    [MID]: 0.8,
    [TOP]: 0.95,
  },
  influence: {
    range: [0.2, 0.4],
  },
};

export default BENCHMARKS;
