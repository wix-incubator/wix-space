import { Filter, RangeItem } from '@wix/dashboard-components-alpha';

export type SpaceshipFilters = {
  status: Filter<string[]>;
  maxDistance: Filter<string[]>;
  launchDate: Filter<RangeItem<Date>>;
  lastUpdated: Filter<RangeItem<Date>>;
};
