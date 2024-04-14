import { withDashboard } from '@wix/dashboard-react';
import { WixDesignSystemProvider } from '@wix/design-system';
import { WixPatternsProvider } from '@wix/patterns/provider';
import React from 'react';
import { SpaceshipsTable } from '../../components/SpaceshipsTable/SpaceshipsTable';

export default withDashboard(() => {
  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <WixPatternsProvider>
        <SpaceshipsTable />
      </WixPatternsProvider>
    </WixDesignSystemProvider>
  );
});
