import { InMemoryBackend } from '@wix/dashboard-components-alpha/testkit/backend';
import { Chance } from 'chance';
import { Spaceship } from '../types/Spaceship';
import { SpaceshipFilters } from '../types/SpaceshipFilters';
import { spaceshipModels } from '../data/spaceshipModels';
import { spaceshipNames } from '../data/spaceshipNames';
import { spaceshipFiltersPredicate } from './spaceshipFiltersPredicate';

export const createSpaceshipsBackend = () => {
  const chance = new Chance();

  return new InMemoryBackend<Spaceship, SpaceshipFilters>({
    createOne: (i) => {
      const crewMembersCount = chance.integer({ min: 2, max: 23 });
      const name = spaceshipNames[i % spaceshipNames.length];
      const launchDate = new Date(
        chance.date({
          min: new Date(2000, 0, 1),
          max: new Date(2024, 0, 1),
        }),
      );
      return {
        id: chance.guid(),
        name,
        model: chance.pickone(spaceshipModels),
        crewMembersCount,
        launchDate,
        lastUpdated: launchDate,
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
    predicate: spaceshipFiltersPredicate,
    orderBy: (query) => [...(query.sort ?? [])],
  });
};
