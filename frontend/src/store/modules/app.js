import api from "api";
import a from "../actions"

const initialState = {
    isLoading: false,
    catalog: null,
    history: null,
    seasonsMap: null,
    error: false
};



export default store => {
    store.on(a._INIT, () => {
        return { app: { ...initialState } };
    });

    store.on(a.INIT.LOAD, async () => {
        store.dispatch(a.LOADING.STARTED);
        try {
            const resp = await api.catalog.all();
            const data = resp.data;
            store.dispatch(a.INIT.LOADED, data);
        } catch (error) {
            store.dispatch(a.ERROR, 'Loading Catalog Failed');
        }
    });

    store.on(a.ERROR, ({ app }, error) => {
        return {
            app: {
                ...app,
                isLoading: false,
                error
            }
        };
    });

    store.on(a.INIT.LOADED, ({ app }, { catalog, history, seasonsMap }) => {
        return {
            app: {
                ...app,
                isLoading: false,
                catalog,
                history,
                seasonsMap
            }
        };
    });

    store.on(a.CATALOG.LOADED, ({ app }, catalog) => {
        return {
            app: {
                ...app,
                isLoading: false,
                catalog
            }
        };
    });
    store.on(a.LOADING.STARTED, ({ app }) => {
        return {
            app: {
                ...app,
                isLoading: true
            }
        };
    });

    store.on(a.HISTORY.SYNC, async (_, dataToSync) => {
        const resp = await api.history.sync(dataToSync);
        const data = resp.data;
        store.dispatch(a.HISTORY.LOADED, data)
    });

    store.on(a.HISTORY.LOADED, ({ app }, history) => {
        return {
            app: {
                ...app,
                history
            }
        };
    });
};