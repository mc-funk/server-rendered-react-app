import { RawApexUser, RawTeam } from 'state/types';

type SortableMembers = RawApexUser | RawTeam;

export const orderOnAvg = (asc: boolean, averages: Record<number, number>) => (
  a: SortableMembers,
  b: SortableMembers
) => {
  return asc
    ? averages[a.id] - averages[b.id]
    : averages[b.id] - averages[a.id];
};

export const orderOnAlpha = (asc: boolean) => (
  a: SortableMembers,
  b: SortableMembers
) => {
  return asc ? (a.name < b.name ? -1 : 1) : a.name > b.name ? -1 : 1;
};
