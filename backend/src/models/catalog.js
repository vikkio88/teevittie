const dirTree = require('directory-tree');

const TYPE = {
    DIRECTORY: 'directory',
    FILE: 'file',
};

const directories = s => s.type === TYPE.DIRECTORY;
const files = s => s.type === TYPE.FILE;

const format = tree => {
    const shows = tree.children.filter(directories).map(show => {
        const name = show.name;
        const seasons = show.children.filter(directories).map(s => {
            const name = s.name;
            const episodes = s.children.filter(files).map(e => ({ name: e.name, path: e.path }));
            return {
                name,
                episodes
            };
        });

        return {
            name,
            seasons
        };
    });

    return shows;
};
const fromDir = directory => {
    const tree = dirTree(directory);
    return format(tree);
};

module.exports = {
    fromDir
};