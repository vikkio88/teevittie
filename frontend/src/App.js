import { useEffect } from 'react';
import { useStoreon } from 'storeon/react';
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Spinner, Error } from 'components/common';
import { Shows, Show } from 'components/pages';

const App = () => {
  const { dispatch, app: { isLoading, error } } = useStoreon('app');
  useEffect(() => dispatch('loadCatalog'), []);

  const hasError = Boolean(error);
  const isReady = !isLoading && !hasError;
  return (
    <main>
      <header>
        <Link to='/'><h1 className="logo" >Tivitti</h1></Link>
      </header>
      <section>
        {isLoading && <Spinner />}
        {!isLoading && hasError && <Error>{error}</Error>}
        {isReady && (
            <Routes>
              <Route path='/' element={<Shows />} />
              <Route path='/show/:id' element={<Show />} />
              <Route path="*" element={<Error>Link Error</Error>} />
            </Routes>
        )}
      </section>
    </main>
  );
};

export default App;
