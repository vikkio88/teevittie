const catalogHelper = {
    //@TODO fix this shit
    getEpisodeById(episodeId, catalog = []) {
        const ids = episodeId.split('.');
        if (ids.length === 3) {
            return catalog.find(s => s.id === ids[0])?.seasons?.find(s => s.id === ids[1])?.episodes.find(e => e.id === ids[2]) ?? null;
        }
        
        // check whether last one has a `meta: { stray: true }`        
        const strayFolder = catalog.find(f => f?.meta?.stray ?? false);
        if (!strayFolder) return null;

        return strayFolder?.movies?.find(m => m.fullId === episodeId) ?? null;
    },
    getShowById(showId, catalog = []) {
        return catalog.find(s => s.id === showId);
    }
};


export { catalogHelper };