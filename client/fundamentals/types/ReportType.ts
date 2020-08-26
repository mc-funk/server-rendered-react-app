import { ReactElement } from 'react';
import {
  CodeAggregateMetrics,
  SubmitMetrics,
  ReviewMetrics,
  BaseMetrics,
} from '../../state/types';
import {
  colorsBlue,
  colorsTeal,
  colorsLime,
  colorsYellow,
} from '@pluralsight/ps-design-system-core';

export type ReportAPIKey = 'code' | 'review' | 'submit';
type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];
export type APIKey<T extends BaseMetrics> = KeysOfType<T, number>;

export type CodeReportKeys =
  | 'coding_days'
  | 'commits_per_day'
  | 'impact'
  | 'efficiency';
export type SubmitKeys =
  | 'responsiveness'
  | 'comments_addressed'
  | 'receptiveness'
  | 'unreviewed_prs';
export type ReviewKeys =
  | 'reaction_time'
  | 'involvement'
  | 'influence'
  | 'review_coverage';
export type ReportKeys = CodeReportKeys | SubmitKeys | ReviewKeys;

/**
 * BaseReport
 *
 * Contains the data needed to visualize a report.
 */
export interface BaseReport {
  key: ReportKeys;
  name: string;
  longName?: string;
  metricName?: string;
  color: string;
  hoverColor: string;
  secondaryLabel?: string;
  unit?: '%';
  help: string | ReactElement;
  helpLink: string;
}

/**
 * ReportType<T>
 *
 * Generic type T is either CodeMetrics, SubmitMetrics, or ReviewMetrics
 * apiKey is the key we will access from the API result in order to get the reported value.
 */
export interface ReportType<T extends BaseMetrics> extends BaseReport {
  apiKey: APIKey<T>;
}

/**
 * ReportAPI<T>
 *
 * Generic type T is either CodeMetrics, SubmitMetrics, or ReviewMetrics
 * api is the URL prefix for the API we are accessing
 */
export interface ReportAPI<T extends BaseMetrics> {
  api: ReportAPIKey;
  reports: ReportType<T>[];
}

/*****************************************
 * Code Fundamentals Types
 ****************************************/
export const codingDays: ReportType<CodeAggregateMetrics> = {
  key: 'coding_days',
  name: 'Coding Days',
  longName: 'Coding days per week',
  color: colorsBlue.base,
  hoverColor: colorsBlue[10],
  help:
    'The average number of coding days per week for developers over the selected period. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink:
    'https://help.pluralsight.com/help/metrics/key-terms-used-in-gitprime',
  apiKey: 'active_days',
};

export const commitsPerDay: ReportType<CodeAggregateMetrics> = {
  key: 'commits_per_day',
  name: 'Commits Per Day',
  longName: 'Commits per coding day',
  color: colorsTeal.base,
  hoverColor: colorsTeal[10],
  help:
    'The average number of commits that developers made on days when they were able to commit. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink:
    'https://help.pluralsight.com/help/metrics/key-terms-used-in-gitprime',
  apiKey: 'commit_count',
};

export const impact: ReportType<CodeAggregateMetrics> = {
  key: 'impact',
  name: 'Impact',
  longName: 'Weekly impact per developer',
  color: colorsLime.base,
  hoverColor: colorsLime[10],
  help:
    'The average, weekly impact that a developer has during the selected period. Impact is a measure of the severity of edits to the codebase, as compared to repository history. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink:
    'https://help.pluralsight.com/help/metrics/key-terms-used-in-gitprime',
  apiKey: 'total_impact',
};

export const efficiency: ReportType<CodeAggregateMetrics> = {
  key: 'efficiency',
  name: 'Efficiency',
  color: colorsYellow.base,
  unit: '%',
  hoverColor: colorsYellow[10],
  help:
    'The average efficiency for developers over a selected period of time. Efficiency is the percentage of all contributed code which is productive work. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink:
    'https://help.pluralsight.com/help/metrics/key-terms-used-in-gitprime',
  apiKey: 'total_efficiency',
};

export const allCodeTypes = [codingDays, commitsPerDay, impact, efficiency];

export const CodeAPI: ReportAPI<CodeAggregateMetrics> = {
  api: 'code',
  reports: allCodeTypes,
};

/*****************************************
 * Submitter Fundamentals Types
 ****************************************/
export const responsiveness: ReportType<SubmitMetrics> = {
  key: 'responsiveness',
  name: 'Responsiveness',
  metricName: 'hours',
  color: colorsBlue.base,
  hoverColor: colorsBlue[10],
  help:
    'The average time it takes to respond to a comment with either another comment or a code revision. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/submit-metrics',
  apiKey: 'tbd',
};

export const commentsAddressed: ReportType<SubmitMetrics> = {
  key: 'comments_addressed',
  name: 'Comments addressed',
  color: colorsTeal.base,
  hoverColor: colorsTeal[10],
  unit: '%',
  help:
    'The percentage of Reviewer comments that were responded to with a comment or a code revision. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/submit-metrics',
  apiKey: 'tbd',
};

export const receptiveness: ReportType<SubmitMetrics> = {
  key: 'receptiveness',
  name: 'Receptiveness',
  color: colorsLime.base,
  hoverColor: colorsLime[10],
  unit: '%',
  help:
    'The ratio of follow-on commits to comments. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/submit-metrics',
  apiKey: 'tbd',
};

export const unreviewedPrs: ReportType<SubmitMetrics> = {
  key: 'unreviewed_prs',
  name: 'Unreviewed PRs',
  color: colorsYellow.base,
  hoverColor: colorsYellow[10],
  secondaryLabel: 'Max',
  unit: '%',
  help:
    'The percentage of PRs submitted that had no comments. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/submit-metrics',
  apiKey: 'tbd',
};

export const allSubmitterTypes = [
  responsiveness,
  commentsAddressed,
  receptiveness,
  unreviewedPrs,
];

export const SubmitAPI: ReportAPI<SubmitMetrics> = {
  api: 'submit',
  reports: allSubmitterTypes,
};

/*****************************************
 * Reviewer Fundamentals Types
 ****************************************/
export const reactionTime: ReportType<ReviewMetrics> = {
  key: 'reaction_time',
  name: 'Reaction time',
  metricName: 'hours',
  help:
    'The average time it took to respond to a comment. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/review-metrics',
  color: colorsBlue.base,
  hoverColor: colorsBlue[10],
  apiKey: 'tbd',
};

export const involvement: ReportType<ReviewMetrics> = {
  key: 'involvement',
  name: 'Involvement',
  help:
    'Involvement is the percentage of PRs that a reviewer, team or organization participated in. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/review-metrics',
  color: colorsTeal.base,
  hoverColor: colorsTeal[10],
  unit: '%',
  apiKey: 'tbd',
};

export const influence: ReportType<ReviewMetrics> = {
  key: 'influence',
  name: 'Influence',
  help:
    'The ratio of follow-on commits to comments made in PRs. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/review-metrics',
  color: colorsLime.base,
  hoverColor: colorsLime[10],
  unit: '%',
  apiKey: 'tbd',
};

export const reviewCoverage: ReportType<ReviewMetrics> = {
  key: 'review_coverage',
  name: 'Review coverage',
  color: colorsYellow.base,
  hoverColor: colorsYellow[10],
  unit: '%',
  help:
    'The percentage of code blocks reviewed. A trend will only be displayed if there are more than four, complete (M-Sun) weeks selected.',
  helpLink: 'https://help.pluralsight.com/help/review-metrics',
  apiKey: 'tbd',
};

export const allReviewerTypes = [
  reactionTime,
  involvement,
  influence,
  reviewCoverage,
];

export const allReportTypes = [
  ...allCodeTypes,
  ...allSubmitterTypes,
  ...allReviewerTypes,
];

export const ReviewAPI: ReportAPI<ReviewMetrics> = {
  api: 'review',
  reports: allReviewerTypes,
};
