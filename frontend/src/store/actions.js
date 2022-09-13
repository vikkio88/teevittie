const actions = {
    _INIT: '@init',
    BOOT: {
        LOAD: 'bootload',
        LOADED: 'bootLoaded',
    },
    CATALOG: {
        LOAD: 'loadCatalog',
        LOADED: 'catalogLoaded',
    },
    HISTORY: {
        SYNC: 'syncHistory',
        PATCH: 'patchHistory',
        LOADED: 'historyLoaded',
    },
    LOADING: {
        STARTED: 'loadingStarted',
        FINISHED: 'loadingFinished',
    },
    ERROR: 'error',
};

export default actions;