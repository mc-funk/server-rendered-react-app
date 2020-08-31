import React from 'react';
import Button from '@pluralsight/ps-design-system-button';
import Theme from '@pluralsight/ps-design-system-theme';

export const App = ({ name }) => (
  <div className="ps-type-font-family">
    <Theme name={Theme.names.light}>
      <Button>React is cool {name}</Button>
    </Theme>
  </div>
);
