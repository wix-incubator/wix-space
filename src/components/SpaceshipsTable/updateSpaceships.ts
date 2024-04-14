import { ComputedQuery } from '@wix/bex-core';
import {
  CollectionOptimisticActions,
  TableState,
} from '@wix/patterns';
import { Spaceship } from '../../types/Spaceship';
import { SpaceshipFilters } from '../../types/SpaceshipFilters';
import { InMemoryBackend } from '@wix/patterns/testkit/backend';

export function updateSpaceships({
  optimisticActions,
  backend,
  patch,
                                   allSelected,
  clearSelection,
  selectedValues,
  query,
}: {
  table: TableState<Spaceship, SpaceshipFilters>;
  optimisticActions: CollectionOptimisticActions<Spaceship, SpaceshipFilters>;
  backend: InMemoryBackend<Spaceship, SpaceshipFilters>;
  patch: Partial<Spaceship>;
  selectedValues: Spaceship[];
  allSelected: boolean;
  clearSelection: () => void;
  query: ComputedQuery<SpaceshipFilters>;
}) {
  if (allSelected) {
    optimisticActions.updateAll(patch, {
      successToast: `${
        query.hasActiveFilters ? 'Filtered' : 'All'
      } spaceships updated.`,
      submit: async () => {
        // This implementation accesses a mock in-memory backend
        // In a real-world scenario, you would update the data in a real backend
        await backend.updateAll(() => patch, {
          filters: query.filters,
        });
      },
      keepPosition: true,
    });
  } else {
    optimisticActions.updateMany(
      selectedValues.map((spaceship) => ({
        ...spaceship,
        ...patch,
      })),
      {
        successToast: `${selectedValues.length} spaceships updated.`,
        submit: async (updatedSpaceships) => {
          // This implementation accesses a mock in-memory backend
          // In a real-world scenario, you would update the data in a real backend
          await backend.updateMany(updatedSpaceships);
        },
        keepPosition: true,
      },
    );
  }
  clearSelection();
}
