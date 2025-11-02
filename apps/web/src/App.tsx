import { isBlank } from 'common';
// import { GetMakes } from 'car-query-sdk';
import { useEffect, useState } from 'react';
const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // GetMakes().then(setData).catch(console.error);
  }, []);
  return (
    <>
      {JSON.stringify(data, null, 2)}
      <p>undefined isBlank - {isBlank(undefined) ? 'true' : 'false'}</p>
      <p>false isBlank - {isBlank(false) ? 'true' : 'false'}</p>
      <p>true isBlank - {isBlank(true) ? 'true' : 'false'}</p>
      <p>Empty object isBlank - {isBlank({}) ? 'true' : 'false'}</p>
    </>
  );
};

export default App;
