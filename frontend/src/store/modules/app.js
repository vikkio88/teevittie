import api from "api";
import a from "../actions";

const initialState = {
    isLoading: false,
    catalog: null,
    history: null,
    seasonsMap: null,
    error: false,
    meta: { version: null }
};



const app = store => {
    store.on(a._INIT, () => {
        return { app: { ...initialState } };
    });

    store.on(a.BOOT.LOAD, async () => {
        store.dispatch(a.LOADING.STARTED);
        try {
            const resp = await api.boot.get();
            const { catalog, history, seasonsMap, meta } = resp.data;
            store.dispatch(a.BOOT.LOADED, { catalog, seasonsMap, history, meta });
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

    store.on(a.BOOT.LOADED, ({ app }, { catalog, history, seasonsMap, meta }) => {
        return {
            app: {
                ...app,
                isLoading: false,
                meta,
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
        store.dispatch(a.HISTORY.LOADED, data);
    });

    store.on(a.HISTORY.PATCH, async (_, dataToSync) => {
        const resp = await api.history.patch(dataToSync);
        const data = resp.data;
        store.dispatch(a.HISTORY.LOADED, data);
    });

    store.on(a.HISTORY.LOADED, ({ app }, { history }) => {
        return {
            app: {
                ...app,
                history
            }
        };
    });
};

export default app;