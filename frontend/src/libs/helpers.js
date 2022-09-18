const catalogHelper = {
    //@TODO fix this shit
    getEpisodeById(episodeId, catalog = [], { isFullId = true } = {}) {
        const ids = episodeId.split('.');
        if (isFullId && ids.length === 3) {
            return catalog.find(s => s.id === ids[0])?.seasons?.find(s => s.id === ids[1])?.episodes.find(e => e.id === ids[2]) ?? null;
        }

        return null;
    },
    getShowById(showId, catalog = []) {
        return catalog.find(s => s.id === showId);
    }
};


export { catalogHelper };