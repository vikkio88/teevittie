const sha1 = require('tiny-hashes/sha1');

const TYPE = {
    DIRECTORY: 'directory',
    FILE: 'file',
};

const directories = s => s.type === TYPE.DIRECTORY;
const files = s => s.type === TYPE.FILE;

const cleanFilename = filename => {
    return filename.replace(/\.[^.]*$/, '').replace(/\./g, ' ').replace(/_/g, ' ').trim();
};

const format = (tree, getId = sha1) => {
    const formatted = [];
    const indexed = {};
    const seasonsMap = {};

    const shows = tree.children.filter(directories);
    for (const show of shows) {
        const showId = getId(show.name);
        const seasonsUnformatted = (show.children && show.children.filter(directories)) || [];
        const hasSeasons = Boolean(seasonsUnformatted.length);
        if (!hasSeasons) continue;

        const seasons = [];
        seasonsMap[showId] = {};
        const episodesLinks = {};
        let previousEpisode = null;
        for (const season of seasonsUnformatted) {
            const unformattedEpisodes = (season.children && season.children.filter(files)) || [];
            const hasEpisodes = Boolean(unformattedEpisodes.length);
            if (!hasEpisodes) continue;

            const seasonId = getId(season.name);
            const episodes = [];
            for (const episode of unformattedEpisodes) {
                const id = getId(episode.name);
                const fullId = `${showId}.${seasonId}.${id}`;
                indexed[fullId] = episode.path;
                if (Boolean(previousEpisode)) {
                    episodesLinks[previousEpisode] = fullId;
                }
                episodesLinks[fullId] = null;
                previousEpisode = fullId;

                episodes.push({
                    id,
                    fullId,
                    name: cleanFilename(episode.name),
                    path: episode.path,
                    // Additional info
                    show: show.name,
                    season: season.name,
                });
            }

            seasonsMap[showId][seasonId] = episodesLinks;
            seasons.push({
                id: seasonId,
                name: season.name,
                episodes,
            });
        }
        if (!Boolean(seasons.length)) continue;
        const name = show.name;
        // here could add other episodes if there are any in the folder itself
        formatted.push({
            id: showId, name, seasons
        });
    }

    return { formatted, indexed, seasonsMap };
};

module.exports = { format, TYPE };