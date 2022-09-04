export default {
    _INIT: '@init',
    INIT: {
        LOAD: 'initLoad',
        LOADED: 'initLoaded',
    },
    CATALOG: {
        LOAD: 'loadCatalog',
        LOADED: 'catalogLoaded',
    },
    HISTORY: {
        SYNC: 'syncHistory',
        LOADED: 'historyLoaded',
    },
    LOADING: {
        STARTED: 'loadingStarted',
        FINISHED: 'loadingFinished',
    },
    ERROR: 'error',
}