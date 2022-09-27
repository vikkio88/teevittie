const dirTree = require('directory-tree');
const { date } = require('../libs/formatters');
const db = require('../db').getDb();
const { format } = require('../libs/treeFormat');

const { VIDEO_FILE_EXTENSIONS, SUBTITLES_EXTENSIONS } = require('./enums');

// 20 minutes cache of catalog
const CATALOG_CACHE_TIMEOUT = 20 * 60 * 1000;
const hasCacheExpired = ({ indexedTime = null }) => {
    if (!Boolean(indexedTime)) return true;

    const now = new Date();
    const lastIndexed = new Date(indexedTime);

    return (now - lastIndexed) > CATALOG_CACHE_TIMEOUT;
};

const fromDir = directory => {
    const data = db.data;
    if (!Boolean(data.catalog) || hasCacheExpired(db.data)) {
        const tree = dirTree(directory, {
            extensions: new RegExp(`\.(${[...VIDEO_FILE_EXTENSIONS, ...SUBTITLES_EXTENSIONS].join('|')})$`)
        });
        const { formatted, indexed, seasonsMap } = format(tree);
        /**
         formatted: 
         [ 
            //Show
            {  
                name,
                seasons: [
                    { 
                        name,
                        episodes: [
                            {
                                id,
                                fullId,
                                name
                                subs: [] ?? null,
                                path, // file path
                                // Additional info
                                show: show.name,
                                season: season.name,
                            };
                            }
                        ]
                    }
                ]
            }
            // or
            {
                id,
                name,
                meta: { stray: true }, // this indicates that is a collection of stray files
                movies: [ { same as episode -(show,season)}]
            }
         ]

         // indexed
         {
            fullEpisodeId : {
                    id,
                    fullId,
                    name: cleanFilename(episode.name),
                    subs: indexedSubs[plainName] ?? null,
                    path: episode.path,
                    // Additional info
                    show: show.name,
                    season: season.name,
            }
         }
         */
        data.catalog = formatted;
        data.indexed = indexed;
        data.seasonsMap = seasonsMap;
        data.indexedTime = date();
        db.save(data);
        db.write();
    }

    return { catalog: db.data.catalog, seasonsMap: db.data.seasonsMap };
};

module.exports = {
    fromDir
};