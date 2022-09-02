import api from "api";

const initialState = {
    isLoading: false,
    catalog: null,
    history: null,
    error: false
};

export default store => {
    store.on('@init', () => {
        return { app: { ...initialState } };
    });

    store.on('loadCatalog', async ({ app }) => {
        store.dispatch('startLoading');
        try {
            const resp = await api.catalog.all();
            const data = resp.data;
            store.dispatch('catalogLoaded', data.catalog);
        } catch (error) {
            store.dispatch('error', 'Loading Catalog Failed');
        }
    });

    store.on('error', ({ app }, error) => {
        return {
            app: {
                ...app,
                isLoading: false,
                error
            }
        };
    });

    store.on('catalogLoaded', ({ app }, catalog) => {
        return {
            app: {
                ...app,
                isLoading: false,
                catalog
            }
        };
    });
    store.on('startLoading', ({ app }) => {
        return {
            app: {
                ...app,
                isLoading: true
            }
        };
    });
};