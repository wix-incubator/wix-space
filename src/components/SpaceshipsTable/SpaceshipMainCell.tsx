import { Spaceship } from '../../types/Spaceship';
import { MainCellLayout } from '../MainCellLayout/MainCellLayout';
import React from 'react';
import {Avatar} from "@wix/design-system";

export function SpaceshipMainCell({ spaceship }: { spaceship: Spaceship }) {
  return (
    <MainCellLayout
      title={spaceship.name}
      subtitle={spaceship.model}
      image={
        <Avatar
          size="size48"
          shape="square"
          name={spaceship.name}
          imgProps={{ src: spaceship.imageUrl, alt: spaceship.name }}
        />
      }
    />
  );
}
