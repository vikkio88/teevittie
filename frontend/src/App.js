import { useEffect } from 'react';
import { useStoreon } from 'storeon/react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { Header } from 'components/layout';
import { Spinner, Error } from 'components/common';
import { Shows, Show, Episode } from 'pages';

import a from "store/actions";

const App = () => {
  const { dispatch, app: { isLoading, error, meta } } = useStoreon('app');
  useEffect(() => dispatch(a.INIT.LOAD), [dispatch]);

  const hasError = Boolean(error);
  const isReady = !isLoading && !hasError;
  return (
    <main>
      <Header version={meta && meta.version}/>
      <section>
        {isLoading && <Spinner />}
        {!isLoading && hasError && <Error>{error}</Error>}
        {isReady && (
          <Routes>
            <Route path='/' element={<Shows />} />
            <Route path='/show/:id' element={<Show />} />
            <Route path='/episode/:id' element={<Episode />} />
            <Route path="*" element={<Error>Link Error</Error>} />
          </Routes>
        )}
      </section>
    </main>
  );
};

export default App;
