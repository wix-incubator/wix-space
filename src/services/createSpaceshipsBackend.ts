import { InMemoryBackend } from '@wix/dashboard-components-alpha/testkit/backend';
import { Chance } from 'chance';
import { escapeRegExp } from 'lodash';
import { Spaceship } from '../types/Spaceship';
import { SpaceshipFilters } from '../types/SpaceshipFilters';
import { spaceshipModels } from '../data/spaceshipModels';
import { spaceshipNames } from '../data/spaceshipNames';

export const createSpaceshipsBackend = () => {
  const chance = new Chance();

  return new InMemoryBackend<Spaceship, SpaceshipFilters>({
    createOne: (i) => {
      const crewMembersCount = chance.integer({ min: 2, max: 23 });
      const name = spaceshipNames[i % spaceshipNames.length];
      return {
        id: chance.guid(),
        name,
        model: chance.pickone(spaceshipModels),
        crewMembersCount,
        launchDate: new Date(
          chance.date({
            min: new Date(2000, 0, 1),
            max: new Date(2024, 0, 1),
          }),
        ),
        code: chance.string({
          length: 10,
          casing: 'upper',
          alpha: false,
          numeric: true,
        }),
        imageUrl: `https://source.unsplash.com/48x48/?spaceship,${name}`,
        status: chance.pickone(['active', 'inactive']),
        maxDistance: chance.floating({ min: 0, max: 20, fixed: 1 }),
        maxCrewMembers: chance.integer({ min: crewMembersCount, max: 100 }),
      };
    },
    itemKey: (item) => item.id,
    total: 500,
    delay: { min: 300, max: 900 },
    predicate: ({ search, filters }) => {
      const rgx = new RegExp(`(\\s+|^)${escapeRegExp(search)}`, 'i');
      const { status, maxDistance: [maxDistance] = [], launchDate } = filters;
      return (item) => {
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

        return true;
      };
    },
  });
};
