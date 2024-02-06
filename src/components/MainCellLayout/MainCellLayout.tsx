import { Box, Text } from '@wix/design-system';
import React, { ReactNode } from 'react';

export interface MainCellLayoutProps {
  dataHook?: string;
  image?: ReactNode;
  title?: ReactNode;
  subtitle?: string;
}

export function MainCellLayout(props: MainCellLayoutProps) {
  const { dataHook, image, title, subtitle } = props;
  return (
    <Box
      direction="horizontal"
      verticalAlign="middle"
      dataHook={dataHook}
      minWidth={0}
    >
      {image && (
        <Box height="48px" paddingInlineEnd="12px" dataHook="image">
          {image}
        </Box>
      )}
      <Box direction="vertical" minWidth={0} minHeight={0}>
        <Text ellipsis size="small" weight="normal" dataHook="title">
          {title}
        </Text>

        {subtitle && (
          <Text ellipsis size="tiny" secondary light dataHook="subtitle">
            {subtitle}
          </Text>
        )}
      </Box>
    </Box>
  );
}
