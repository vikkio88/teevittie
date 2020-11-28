import { useEffect } from 'react';
import { useStoreon } from 'storeon/react';

import { Spinner, Error } from 'components/common';
import { Show } from 'components/show/Show';

const App = () => {
  const { dispatch, app: { isLoading, catalog, error } } = useStoreon('app');
  useEffect(() => dispatch('loadCatalog'), []);

  console.log(catalog);
  return (
    <main>
      <header>
        <h1 className="logo">Tivitti</h1>
      </header>
      <section>
        {isLoading && <Spinner />}
        {!isLoading && error && <Error>{error}</Error>}
        {!isLoading && Array.isArray(catalog) && catalog.map(s => (
          <Show key={s.id} {...s} />
        ))}
      </section>
    </main>
  );
};

export default App;
