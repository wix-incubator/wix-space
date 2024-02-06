import React, { useState } from 'react';
import {
  CollectionPage,
  CollectionToolbarFilters,
  CustomColumns,
  DateRangeFilter,
  dateRangeFilter,
  InfiniteScrollTable,
  MultiBulkActionToolbar,
  RadioGroupFilter,
  stringsArrayFilter,
  TabsFilter,
  TabTotalCounterBadge,
  useCursorInfiniteScrollTable,
} from '@wix/dashboard-components-alpha';
import { Breadcrumbs, Page } from '@wix/design-system';
import { Spaceship } from '../../types/Spaceship';
import { SpaceshipFilters } from '../../types/SpaceshipFilters';
import { createSpaceshipsBackend } from '../../services/createSpaceshipsBackend';
import { SpaceshipMainCell } from './SpaceshipMainCell';
import { useEnvironment } from '@wix/sdk-react';
import { EnvironmentState } from '@wix/dashboard-react';

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
    },
  });

  const { locale } = useEnvironment<EnvironmentState>();

  const [dateFormatter] = useState(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
      }),
  );

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
          bulkActionToolbar={() => <MultiBulkActionToolbar />}
          customColumns={<CustomColumns />}
          tabs={
            <TabsFilter
              filter={table.collection.filters.status}
              all="All Spaceships"
              data={['active', 'inactive']}
              renderCounterBadge={(value) => (
                <TabTotalCounterBadge value={value} skin="neutralStandard" />
              )}
            />
          }
          columns={[
            {
              id: 'shipNameAndModel',
              title: 'Ship Name / Model',
              width: '236px',
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
              width: '120px',
              render: (spaceship) => dateFormatter.format(spaceship.launchDate),
              align: 'center',
            },
            {
              id: 'idNumber',
              title: 'ID Number',
              width: '120px',
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
            },
            {
              id: 'maxDistance',
              title: 'Max Distance',
              width: '120px',
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
              width: '100px',
              render: (spaceship) => spaceship.maxCrewMembers,
              align: 'center',
              defaultHidden: true,
            },
          ]}
          actionsCell={() => ({
            secondaryActions: [
              {
                icon: <></>,
                text: 'Edit',
                onClick: () => {
                  console.log('Edit');
                },
              },
              {
                icon: <></>,
                text: 'Delete',
                onClick: () => {
                  console.log('Delete');
                },
              },
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
