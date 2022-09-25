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

const format = (tree, getId = sha1) => {
    const formatted = [];
    const indexed = {};
    const seasonsMap = {};

    const rootFolders = tree.children.filter(directories);
    const singleFiles = tree.children.filter(files);

    for (const rootFolder of rootFolders) {
        const showId = getId(rootFolder.name);
        const seasonsUnformatted = (rootFolder.children && rootFolder.children.filter(directories)) || [];
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
            const subs = unformattedFilesInSeason.filter(isSubtitle).map(({ name, path }) => ({ name, path, plainName: removeExtension(name) }));
            const indexedSubs = {};
            for (const sub of subs) {
                // atm I am only adding 1, but I will
                // make it an array just in case I will
                // need to add more languages
                indexedSubs[sub.plainName] = [sub];
            }
            const seasonId = getId(season.name);
            const episodes = [];
            for (const episode of unformattedEpisodes) {
                const id = getId(episode.name);
                //@TODO Id for single files should break here
                const fullId = `${showId}.${seasonId}.${id}`;
                //

                if (Boolean(previousEpisode)) {
                    episodesLinks[previousEpisode] = fullId;
                }
                episodesLinks[fullId] = null;
                previousEpisode = fullId;
                const plainName = removeExtension(episode.name);
                const formattedEpisode = {
                    id,
                    fullId,
                    name: cleanFilename(episode.name),
                    subs: indexedSubs[plainName] ?? null,
                    path: episode.path,
                    // Additional info
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

    return { formatted, indexed, seasonsMap };
};

module.exports = { format, TYPE };