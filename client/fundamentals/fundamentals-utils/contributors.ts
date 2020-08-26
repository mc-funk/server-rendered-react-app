import {
  DRFResponse,
  RawContributor,
  MembershipType,
  RawApexUser,
} from '../types/state-types';

/*
 * Takes results from a team membership api call and reduces to include
 * contributors only apex user info, excluding viewers.
 */
export const contributorsFromResults = (res: DRFResponse<RawContributor>) =>
  res.results.reduce(
    (acc: Record<number, RawApexUser>, curr: RawContributor) =>
      curr.membership_type === MembershipType.CONTRIBUTOR
        ? { ...acc, [curr.apex_user.id]: { ...curr.apex_user } }
        : acc,
    {}
  );
