import React, { useEffect, useState } from 'react';
import Button from '@pluralsight/ps-design-system-button';
import Theme from '@pluralsight/ps-design-system-theme';

import BarChart from './BarChart';
// import styles from './styles.css';

// d3 code from https://app.pluralsight.com/guides/drawing-charts-in-react-with-d3
const datas = [
  [10, 30, 40, 20],
  [10, 40, 30, 20, 50, 10],
  [60, 30, 40, 20, 30],
];
var i = 0;

export const App = ({ name }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    changeData();
  }, []);

  const changeData = () => {
    setData(datas[i++]);
    if (i === datas.length) i = 0;
  };

  return (
    <Theme name={Theme.names.light}>
      <div style={{ margin: '20px' }}>
        <Button>React is cool {name}</Button>
        <div style={{ height: '20px' }} />
        <div>
          <button onClick={changeData}>Change Data</button>
          <BarChart width={600} height={400} data={data} />
        </div>
      </div>
    </Theme>
  );
};
