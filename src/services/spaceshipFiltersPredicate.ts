import { SpaceshipFilters } from '../types/SpaceshipFilters';
import { escapeRegExp } from 'lodash';
import { Spaceship } from '../types/Spaceship';
import { ComputedQuery } from '@wix/patterns';

export function spaceshipFiltersPredicate({
  search,
  filters,
}: Pick<ComputedQuery<SpaceshipFilters>, 'filters' | 'search'>) {
  const rgx = new RegExp(`(\\s+|^)${escapeRegExp(search)}`, 'i');
  const { status, maxDistance: [maxDistance] = [], launchDate } = filters;

  return (item: Spaceship) => {
    if (search && !rgx.test(`${item.name}`)) {
      return false;
    }

    if (status && status.length > 0 && !status.includes(item.status)) {
      return false;
    }

    if (
      maxDistance != null &&
      maxDistance !== 'all' &&
      item.maxDistance > parseInt(maxDistance)
    ) {
      return false;
    }

    if (
      launchDate &&
      launchDate.from &&
      item.launchDate.valueOf() < launchDate.from.valueOf()
    ) {
      return false;
    }

    if (
      launchDate &&
      launchDate.to &&
      item.launchDate.valueOf() > launchDate.to.valueOf()
    ) {
      return false;
    }
    if (
      launchDate &&
      launchDate.to &&
      item.launchDate.valueOf() > launchDate.to.valueOf()
    ) {
      return false;
    }

    return true;
  };
}
