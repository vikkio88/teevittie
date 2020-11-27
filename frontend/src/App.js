import api from './api';

function App() {
  return (
    <main>
      <h1>Tivitti</h1>
      <button
        onClick={async () => {
          const resp = await api.catalog.all();
          console.log(resp)
        }}
      >
        Test
      </button>
    </main>
  );
}

export default App;
