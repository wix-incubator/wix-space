import { ComputedQuery } from '@wix/bex-core';
import { CollectionOptimisticActions } from '@wix/dashboard-components-alpha';
import { Spaceship } from '../../types/Spaceship';
import { SpaceshipFilters } from '../../types/SpaceshipFilters';
import { InMemoryBackend } from '@wix/dashboard-components-alpha/testkit/backend';

export function deleteSpaceships({
  optimisticActions,
  backend,
  isSelectAll,
  clearSelection,
  selectedValues,
  query,
}: {
  optimisticActions: CollectionOptimisticActions<Spaceship, SpaceshipFilters>;
  backend: InMemoryBackend<Spaceship, SpaceshipFilters>;
  selectedValues: Spaceship[];
  isSelectAll: boolean;
  clearSelection: () => void;
  query: ComputedQuery<SpaceshipFilters>;
}) {
  if (isSelectAll) {
    optimisticActions.deleteAll({
      successToast: `${query.hasActiveFilters ? 'Filtered' : 'All'} spaceships deleted.`,
      submit: async () => {
        // This implementation accesses a mock in-memory backend
        // In a real-world scenario, you would update the data in a real backend
        await backend.deleteAll({
          filters: query.filters,
        });
      },
    });
  } else {
    optimisticActions.deleteMany(selectedValues, {
      successToast: `${selectedValues.length} spaceships deleted.`,
      submit: async (deletedSpaceships) => {
        // This implementation accesses a mock in-memory backend
        // In a real-world scenario, you would update the data in a real backend
        await backend.deleteMany(deletedSpaceships);
      },
    });
  }
  clearSelection();
}
