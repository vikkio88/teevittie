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
    const shows = tree.children.filter(directories).map(show => {
        const id = sha1(show.name);
        const name = show.name;
        const seasons = show.children.filter(directories).map(s => {
            const id = sha1(s.name);
            const name = s.name;
            const episodes = s.children.filter(files).map(e => {
                const id = sha1(e.name);
                return {
                    id,
                    name: e.name,
                    path: e.path
                };
            });
            return {
                id,
                name,
                episodes
            };
        });

        return {
            id,
            name,
            seasons
        };
    });

    return shows;
};
const fromDir = directory => {
    const tree = dirTree(directory, {
        extensions: new RegExp(`\.(${VIDEO_FILE_EXTENSIONS.join('|')})$`)
    });
    return format(tree);
};

module.exports = {
    fromDir
};