const dirTree = require('directory-tree');
const sha1 = require('tiny-hashes/sha1');

const { VIDEO_FILE_EXTENSIONS } = require('./enums');

const TYPE = {
    DIRECTORY: 'directory',
    FILE: 'file',
};

const directories = s => s.type === TYPE.DIRECTORY;
const files = s => s.type === TYPE.FILE;

const format = tree => {
    const formatted = [];
    const indexed = {};

    const shows = tree.children.filter(directories);
    for (const show of shows) {
        const showId = sha1(show.name);
        const seasonsUnformatted = (show.children && show.children.filter(directories)) || [];
        const hasSeasons = Boolean(seasonsUnformatted.length);
        if (!hasSeasons) continue;

        const seasons = [];
        for (const season of seasonsUnformatted) {
            const unformattedEpisodes = (season.children && season.children.filter(files)) || [];
            const hasEpisodes = Boolean(unformattedEpisodes.length);
            if (!hasEpisodes) continue;

            const seasonId = sha1(season.name);
            const episodes = []
            for (const episode of unformattedEpisodes) {
                const id = sha1(episode.name);
                const fullId = `${showId}.${seasonId}.${id}`;
                indexed[fullId] = episode.path;
                episodes.push({
                    id,
                    fullId,
                    name: episode.name,
                    path: episode.path
                });
            }

            seasons.push({
                id: seasonId,
                name: season.name,
                episodes
            });
        }
        if (!Boolean(seasons.length)) continue;
        const name = show.name;
        // here could add other episodes if there are any in the folder itself
        formatted.push({
            showId, name, seasons
        });
    }

    return { formatted, indexed };
};
const fromDir = directory => {
    const tree = dirTree(directory, {
        extensions: new RegExp(`\.(${VIDEO_FILE_EXTENSIONS.join('|')})$`)
    });
    const { formatted, indexed } = format(tree);
    for (let show of formatted) {
        const showId = show.id;
        for (let season of show.seasons) {
            const seasonId = season.id
            for (let episode of season.episodes) {
                const episodeId = episode.id;

            }
        }
    }

    return { formatted, indexed };
};

module.exports = {
    fromDir,
    format,
};