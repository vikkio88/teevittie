const sha1 = require('tiny-hashes/sha1');

const TYPE = {
    DIRECTORY: 'directory',
    FILE: 'file',
};

const directories = s => s.type === TYPE.DIRECTORY;
const files = s => s.type === TYPE.FILE;
const isSubtitle = f => f.name.endsWith('.vtt') || f.name.endsWith('.VTT');

const cleanFilename = filename => filename.replace(/\.[^.]*$/, '').replace(/\./g, ' ').replace(/_/g, ' ').trim();

const removeExtension = filename => filename.replace(/\.[^/.]+$/, '');

const formatEpisode = (episode, getId, indexedSubs = {}) => {
    const plainName = removeExtension(episode.name);
    const name = cleanFilename(episode.name);
    const id = getId(episode.name);
    return {
        id,
        name,
        subs: indexedSubs[plainName] ?? null,
        path: episode.path,
    };
};

const format = (tree, getId = sha1) => {
    const formatted = [];
    const indexed = {};
    const seasonsMap = {};

    const rootFolders = tree.children.filter(directories);
    let singleFiles = tree.children.filter(files);

    for (const rootFolder of rootFolders) {
        const showId = getId(rootFolder.name);
        const seasonsUnformatted = (rootFolder.children && rootFolder.children.filter(directories)) || [];
        singleFiles = [...singleFiles, ...((rootFolder.children && rootFolder.children.filter(files)) || [])];
        const hasSeasons = Boolean(seasonsUnformatted.length);
        if (!hasSeasons) continue;

        const seasons = [];
        seasonsMap[showId] = {};
        const episodesLinks = {};
        let previousEpisode = null;
        for (const season of seasonsUnformatted) {
            const unformattedFilesInSeason = (season.children && season.children.filter(files)) || [];
            const unformattedEpisodes = unformattedFilesInSeason.filter(f => !isSubtitle(f));
            const hasEpisodes = Boolean(unformattedEpisodes.length);
            if (!hasEpisodes) continue;
            const indexedSubs = indexSubs(unformattedFilesInSeason);
            const seasonId = getId(season.name);
            const episodes = [];
            for (const episode of unformattedEpisodes) {
                let formattedEpisode = formatEpisode(episode, getId, indexedSubs);

                //@TODO Id for single files should break here
                const fullId = `${showId}.${seasonId}.${formattedEpisode.id}`;
                //

                if (Boolean(previousEpisode)) {
                    episodesLinks[previousEpisode] = fullId;
                }
                episodesLinks[fullId] = null;
                previousEpisode = fullId;

                formattedEpisode = {
                    ...formattedEpisode,
                    // Additional info for episode inside season
                    fullId,
                    show: rootFolder.name,
                    season: season.name,
                };

                indexed[fullId] = { ...formattedEpisode };
                episodes.push(formattedEpisode);
            }

            seasonsMap[showId][seasonId] = episodesLinks;
            seasons.push({
                id: seasonId,
                name: season.name,
                episodes,
            });
        }
        if (!Boolean(seasons.length)) continue;
        const name = rootFolder.name;
        // here could add other episodes if there are any in the folder itself
        formatted.push({
            id: showId, name, seasons
        });
    }

    if (singleFiles.length > 0) {
        const unformattedMovies = singleFiles.filter(f => !isSubtitle(f));
        const hasMovies = unformattedMovies.length > 0;
        const indexedSubs = indexSubs(singleFiles);
        const rootId = getId(tree.name);
        const movies = [];
        for (const unformattedMovie of unformattedMovies) {
            let movie = formatEpisode(unformattedMovie, getId, indexedSubs);
            const fullId = `${rootId}.${movie.id}`;
            movie = {
                ...movie,
                fullId
            };
            movies.push(movie);
            indexed[fullId] = { ...movie };
        }

        if (hasMovies) {
            formatted.push({
                id: rootId,
                meta: { stray: true },
                name: cleanFilename(tree.name),
                movies
            });
        }
    };

    return { formatted, indexed, seasonsMap };
};

module.exports = { format, TYPE };

function indexSubs(files) {
    const indexedSubs = {};
    const subs = files.filter(isSubtitle).map(({ name, path }) => ({ name, path, plainName: removeExtension(name) }));
    for (const sub of subs) {
        // atm I am only adding 1, but I will
        // make it an array just in case I will
        // need to add more languages
        indexedSubs[sub.plainName] = [sub];
    }

    return indexedSubs;
}
