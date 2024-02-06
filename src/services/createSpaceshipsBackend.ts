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
        launchDate: chance.date(),
        code: chance.string({
          length: 10,
          casing: 'upper',
          alpha: false,
          numeric: true,
        }),
        imageUrl: `https://source.unsplash.com/300x300/?spaceship,${name}`,
        status: chance.pickone(['active', 'inactive']),
        maxDistance: chance.integer({ min: 1000, max: 100000 }),
        maxCrewMembers: chance.integer({ min: crewMembersCount, max: 100 }),
      };
    },
    itemKey: (item) => item.id,
    total: 500,
    delay: { min: 300, max: 900 },
    predicate: ({ search }) => {
      const rgx = new RegExp(`(\\s+|^)${escapeRegExp(search)}`, 'i');
      return (item) => {
        if (search && !rgx.test(`${item.name}`)) {
          return false;
        }

        return true;
      };
    },
  });
};
