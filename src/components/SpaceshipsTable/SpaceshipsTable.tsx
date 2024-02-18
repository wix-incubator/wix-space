import React, { useState } from 'react';
import {
  CollectionPage,
  CollectionToolbarFilters,
  CustomColumns,
  DateRangeFilter,
  dateRangeFilter,
  deleteSecondaryAction,
  InfiniteScrollTable,
  MultiBulkActionToolbar,
  RadioGroupFilter,
  stringsArrayFilter,
  useCursorInfiniteScrollTable,
  useOptimisticActions,
} from '@wix/dashboard-components-alpha';
import { Breadcrumbs, Page } from '@wix/design-system';
import { StatusComplete, StatusStop } from '@wix/wix-ui-icons-common';
import { Spaceship } from '../../types/Spaceship';
import { SpaceshipFilters } from '../../types/SpaceshipFilters';
import { createSpaceshipsBackend } from '../../services/createSpaceshipsBackend';
import { SpaceshipMainCell } from './SpaceshipMainCell';
import { useEnvironment } from '@wix/sdk-react';
import { EnvironmentState } from '@wix/dashboard-react';
import { spaceshipFiltersPredicate } from '../../services/spaceshipFiltersPredicate';
import { updateSpaceships } from './updateSpaceships';
import { deleteSpaceships } from './deleteSpaceships';

export const SpaceshipsTable = () => {
  const [backend] = useState(() => createSpaceshipsBackend());

  const table = useCursorInfiniteScrollTable<Spaceship, SpaceshipFilters>({
    queryName: 'spaceships',
    limit: 50,
    fetchData: async (query) => {
      // This implementation accesses a mock in-memory backend
      // In a real-world scenario, you would fetch the data from a real backend
      const { items, total, cursor } = await backend.fetchData({
        limit: query.limit,
        cursor: query.cursor,
        filters: {
          status: query.filters.status,
          maxDistance: query.filters.maxDistance,
          launchDate: query.filters.launchDate,
        },
        sort: query.sort,
        search: query.search,
      });

      return {
        items,
        total,
        cursor,
      };
    },
    fetchErrorMessage: () => 'An error occurred while fetching the data',
    filters: {
      status: stringsArrayFilter({
        itemName: (status) => (status === 'active' ? 'Active' : 'Inactive'),
      }),
      maxDistance: stringsArrayFilter(),
      launchDate: dateRangeFilter(),
      lastUpdated: dateRangeFilter(),
    },
  });

  const { locale } = useEnvironment<EnvironmentState>();

  const [dateFormatter] = useState(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
      }),
  );

  const optimisticActions = useOptimisticActions(table.collection, {
    predicate: spaceshipFiltersPredicate,
    orderBy: () => [], // will force keeping the order of the items after updating them
  });

  return (
    <CollectionPage state={table.collection} height="100vh">
      <Page.Header
        title="Spaceships"
        subtitle="I'm a relatively long subtitle to fill this space in"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { id: 'WixSpace', value: 'Wix Space' },
              {
                id: 'Spaceships',
                value: <span style={{ fontWeight: 500 }}>Spaceships</span>,
              },
            ]}
          />
        }
      />
      <Page.Content>
        <InfiniteScrollTable
          state={table}
          horizontalScroll
          bulkActionToolbar={({
            isSelectAll,
            selectedValues,
            query,
            clearSelection,
            openConfirmModal,
          }) => (
            <MultiBulkActionToolbar
              primaryActionItems={[
                {
                  text: 'Activate',
                  onClick: () => {
                    updateSpaceships({
                      table,
                      optimisticActions,
                      backend,
                      patch: { status: 'active', lastUpdated: new Date() },
                      query,
                      clearSelection,
                      selectedValues,
                      isSelectAll,
                    });
                  },
                },
                {
                  text: 'Deactivate',
                  onClick: () => {
                    updateSpaceships({
                      table,
                      optimisticActions,
                      backend,
                      patch: { status: 'inactive', lastUpdated: new Date() },
                      query,
                      clearSelection,
                      selectedValues,
                      isSelectAll,
                    });
                  },
                },
              ]}
              secondaryActionItems={[
                {
                  text: 'Delete',
                  onClick: () => {
                    openConfirmModal({
                      theme: 'destructive',
                      primaryButtonOnClick: () => {
                        deleteSpaceships({
                          selectedValues,
                          query,
                          clearSelection,
                          optimisticActions,
                          backend,
                          isSelectAll,
                        });
                      },
                    });
                  },
                },
              ]}
            />
          )}
          customColumns={<CustomColumns />}
          stickyColumns={2}
          columns={[
            {
              id: 'shipNameAndModel',
              title: 'Ship Name / Model',
              width: '220px',
              render: (spaceship) => (
                <SpaceshipMainCell spaceship={spaceship} />
              ),
              hideable: false,
            },
            {
              id: 'crewMembers',
              title: 'Crew Members',
              width: '100px',
              render: (spaceship) => spaceship.crewMembersCount,
              align: 'center',
            },
            {
              id: 'launchDate',
              title: 'First Launched',
              width: '140px',
              render: (spaceship) => dateFormatter.format(spaceship.launchDate),
              align: 'center',
            },
            {
              id: 'idNumber',
              title: 'ID Number',
              width: '140px',
              render: (spaceship) => spaceship.code,
              infoTooltipProps: {
                content: 'The unique identifier of the spaceship',
              },
            },
            {
              id: 'status',
              title: 'Status',
              width: '100px',
              render: (spaceship) =>
                spaceship.status === 'active' ? 'Active' : 'Inactive',
              align: 'center',
            },
            {
              id: 'maxDistance',
              title: 'Max Distance',
              width: '100px',
              render: (spaceship) => spaceship.maxDistance,
              align: 'center',
              defaultHidden: true,
              infoTooltipProps: {
                panelContent: 'The maximum distance the spaceship can travel',
              },
            },
            {
              id: 'maxCrewMembers',
              title: 'Max Crew Members',
              width: '140px',
              render: (spaceship) => spaceship.maxCrewMembers,
              align: 'center',
              defaultHidden: true,
            },
            {
              id: 'lastUpdated',
              title: 'Last Updated',
              width: '140px',
              render: (spaceship) => dateFormatter.format(spaceship.lastUpdated),
              align: 'center',
              sortable: true,
              defaultSortDirection: 'desc',
            },
          ]}
          actionsCell={(spaceship, _index, actionsCellAPI) => ({
            secondaryActions: [
              {
                icon:
                  spaceship.status === 'active' ? (
                    <StatusStop />
                  ) : (
                    <StatusComplete />
                  ),
                text: spaceship.status === 'active' ? 'Deactivate' : 'Activate',
                onClick: () => {
                  optimisticActions.updateOne(
                    {
                      ...spaceship,
                      status:
                        spaceship.status === 'active' ? 'inactive' : 'active',
                      lastUpdated: new Date(),
                    },
                    {
                      submit: async (updatedSpaceships) => {
                        // This implementation accesses a mock in-memory backend
                        // In a real-world scenario, you would update the data in a real backend
                        await backend.updateMany(updatedSpaceships);
                      },
                      keepPosition: true,
                    },
                  );
                },
              },
              deleteSecondaryAction({
                optimisticActions,
                actionsCellAPI,
                submit: async (deletedSpaceships) => {
                  // This implementation accesses a mock in-memory backend
                  // In a real-world scenario, you would delete the data in a real backend
                  await backend.deleteMany(deletedSpaceships);
                },
              }),
            ],
          })}
          filters={
            <CollectionToolbarFilters inline={0}>
              <RadioGroupFilter
                initiallyOpen
                accordionItemProps={{ title: 'Max Distance' }}
                data={['5', '10', '15']}
                filter={table.collection.filters.maxDistance}
              />

              <DateRangeFilter
                initiallyOpen
                mode="ONLY_CUSTOM"
                accordionItemProps={{ title: 'First Launched' }}
                filter={table.collection.filters.launchDate}
              />

              <RadioGroupFilter
                initiallyOpen
                accordionItemProps={{ title: 'Status' }}
                data={['active', 'inactive']}
                filter={table.collection.filters.status}
              />
            </CollectionToolbarFilters>
          }
        />
      </Page.Content>
    </CollectionPage>
  );
};
