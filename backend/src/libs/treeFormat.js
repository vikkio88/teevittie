const sha1 = require('tiny-hashes/sha1');

const TYPE = {
    DIRECTORY: 'directory',
    FILE: 'file',
};

const directories = s => s.type === TYPE.DIRECTORY;
const files = s => s.type === TYPE.FILE;

const format = tree => {
    const formatted = [];
    const indexed = {};
    const seasonsMap = {};

    const shows = tree.children.filter(directories);
    for (const show of shows) {
        const showId = sha1(show.name);
        const seasonsUnformatted = (show.children && show.children.filter(directories)) || [];
        const hasSeasons = Boolean(seasonsUnformatted.length);
        if (!hasSeasons) continue;

        const seasons = [];
        seasonsMap[showId] = {};
        for (const season of seasonsUnformatted) {
            const unformattedEpisodes = (season.children && season.children.filter(files)) || [];
            const hasEpisodes = Boolean(unformattedEpisodes.length);
            if (!hasEpisodes) continue;

            const seasonId = sha1(season.name);
            const episodes = [];
            const episodesLinks = {};
            let previousEpisode = null;
            for (const episode of unformattedEpisodes) {
                const id = sha1(episode.name);
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
                    name: episode.name,
                    path: episode.path
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

module.exports = format;