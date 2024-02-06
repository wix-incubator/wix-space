import { withDashboard } from '@wix/dashboard-react';
import { WixDesignSystemProvider } from '@wix/design-system';
import { CairoProvider } from '@wix/dashboard-components-alpha/provider';
import React from 'react';
import { SpaceshipsTable } from '../../components/SpaceshipsTable/SpaceshipsTable';

export default withDashboard(() => {
  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <CairoProvider>
        <SpaceshipsTable />
      </CairoProvider>
    </WixDesignSystemProvider>
  );
});
