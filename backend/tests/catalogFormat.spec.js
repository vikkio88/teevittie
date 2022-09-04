const { test } = require('@japa/runner');

const { format } = require('../src/models/catalog');

const treeExample = {
  children: [
    { name: 'SomeEmptyFolder', type: 'directory', children: [] },
  ]
};

test.group('Catalog Generation', () => {
  test('format rejects empty folders', ({ expect }) => {
    const treeExample = {
      children: [
        { name: 'SomeEmptyFolder', type: 'directory', children: [] },
      ]
    };

    const result = format(treeExample);
    expect(result.formatted).toEqual([]);
    expect(result.indexed).toEqual({});
  });

  test('format rejects empty folders but adds the one that have it', ({ expect }) => {
    const treeExample = {
      children: [
        { name: 'SomeEmptyFolder', type: 'directory', children: [] },
        {
          name: 'SomeNotEmptyFolderButEmptyEpisodes', type: 'directory', children: [
            { name: 'Season1', type: 'directory', children: [] }
          ]
        },
        {
          name: 'SomeNotEmptyFolder', type: 'directory', children: [
            {
              name: 'Season1', type: 'directory', children: [
                { name: 'Episode 1', path: 'some/file/path', type: 'file' }
              ]
            }
          ]
        },
      ]
    };
    const { formatted, indexed } = format(treeExample);

    expect(formatted.length).toBeGreaterThan(0);
    expect(formatted[0].name).toBe('SomeNotEmptyFolder');
    expect(formatted[0].seasons.length).toBeGreaterThan(0);
    expect(formatted[0].seasons[0].name).toBe('Season1');
    expect(formatted[0].seasons[0].episodes.length).toBeGreaterThan(0);
    expect(formatted[0].seasons[0].episodes[0].name).toBe('Episode 1');


    expect(Object.keys(indexed)).toContain(formatted[0].seasons[0].episodes[0].fullId);
    expect(indexed[formatted[0].seasons[0].episodes[0].fullId]).toBe(formatted[0].seasons[0].episodes[0].path);

  });

});
