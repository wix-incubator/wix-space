import { Filter, RangeItem } from '@wix/patterns';

export type SpaceshipFilters = {
  status: Filter<string[]>;
  maxDistance: Filter<string[]>;
  launchDate: Filter<RangeItem<Date>>;
  lastUpdated: Filter<RangeItem<Date>>;
};
