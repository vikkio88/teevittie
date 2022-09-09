const { test } = require('@japa/runner');

const format = require('../../src/libs/treeFormat');

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
                { name: 'Episode.1_omg_sick_.mp4', path: 'some/file/path/1', type: 'file' },
                { name: 'Episode 2', path: 'some/file/path/2', type: 'file' }
              ]
            },
            {
              name: 'Season2', type: 'directory', children: [
                { name: 'Episode 1 s02', path: 'some/file/path2/1', type: 'file' },
                { name: 'Episode 2 s02', path: 'some/file/path2/2', type: 'file' }
              ]
            },
          ]
        },
      ]
    };
    const { formatted, indexed, seasonsMap } = format(treeExample, name => name.replace(/[\s\.]+/g, '_', name));


    expect(formatted.length).toBeGreaterThan(0);
    expect(formatted[0].name).toBe('SomeNotEmptyFolder');
    expect(formatted[0].seasons.length).toBeGreaterThan(0);
    expect(formatted[0].seasons[0].name).toBe('Season1');
    expect(formatted[0].seasons[0].episodes.length).toBeGreaterThan(0);
    expect(formatted[0].seasons[0].episodes[0].name).toBe('Episode 1 omg sick');
    expect(formatted[0].seasons[0].episodes[1].name).toBe('Episode 2');
    expect(formatted[0].seasons[1].name).toBe('Season2');
    expect(formatted[0].seasons[1].episodes[0].name).toBe('Episode 1 s02');
    expect(formatted[0].seasons[1].episodes[1].name).toBe('Episode 2 s02');
    const showId = formatted[0].id;
    const seasonIds = {
      s1: formatted[0].seasons[0].id,
      s2: formatted[0].seasons[1].id,
    };

    const episodeIds = {
      s1e1: formatted[0].seasons[0].episodes[0].fullId,
      s1e2: formatted[0].seasons[0].episodes[1].fullId,
      s2e1: formatted[0].seasons[1].episodes[0].fullId,
      s2e2: formatted[0].seasons[1].episodes[1].fullId,
    };

    //{ name: 'Episode 1', path: 'some/file/path/1', type: 'file' },
    expect(formatted[0].seasons[0].episodes[0]).toEqual({
      id: 'Episode_1_omg_sick__mp4',
      fullId: 'SomeNotEmptyFolder.Season1.Episode_1_omg_sick__mp4',
      name: 'Episode 1 omg sick',
      path: 'some/file/path/1',
      show: 'SomeNotEmptyFolder',
      season: 'Season1'
    });


    expect(Object.keys(indexed)).toContain(episodeIds.s1e1);
    expect(indexed[episodeIds.s1e1]).toBe(formatted[0].seasons[0].episodes[0].path);


    expect(seasonsMap).not.toBe(null);
    expect(seasonsMap[showId]).not.toBe(null);
    expect(seasonsMap[showId][seasonIds.s1]).not.toBe(null);
    expect(seasonsMap[showId][seasonIds.s1][episodeIds.s1e1]).toBe(episodeIds.s1e2);
    expect(seasonsMap[showId][seasonIds.s1][episodeIds.s1e2]).not.toBe(null);
    // checking link among 2 seasons
    expect(seasonsMap[showId][seasonIds.s1][episodeIds.s1e2]).toBe(episodeIds.s2e1);
    expect(seasonsMap[showId][seasonIds.s2][episodeIds.s2e1]).toBe(episodeIds.s2e2);
    expect(seasonsMap[showId][seasonIds.s2][episodeIds.s2e2]).toBe(null);
  });

});
