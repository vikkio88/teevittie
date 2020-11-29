import { useEffect } from 'react';
import { useStoreon } from 'storeon/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Spinner, Error } from 'components/common';
import { Shows, Show } from 'components/pages';

const App = () => {
  const { dispatch, app: { isLoading, error } } = useStoreon('app');
  useEffect(() => dispatch('loadCatalog'), []);

  const hasError = !isLoading && Boolean(error);
  const isReady = !isLoading && !hasError;
  return (
    <Router>
      <main>
        <header>
          <Link to='/'><h1 className="logo" >Tivitti</h1></Link>
        </header>
        <section>
          {isLoading && <Spinner />}
          {hasError && <Error>{error}</Error>}
          {isReady && (

            <Switch>
              <Route exact path='/' component={Shows} />
              <Route exact path='/show/:id' component={Show} />
              <Route path="*" component={() => (<Error>Link Error</Error>)} />
            </Switch>
          )}
        </section>
      </main>
    </Router>
  );
};

export default App;
