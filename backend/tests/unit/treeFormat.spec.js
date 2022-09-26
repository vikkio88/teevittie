const { test } = require('@japa/runner');

const { format, TYPE } = require('../../src/libs/treeFormat');

const cleanNameAsTestId = name => name.replace(/[\s\.]/g, '_', name);


test.group('Catalog Generation', () => {

  test('format rejects empty folders', ({ expect }) => {
    const treeExample = {
      name: 'moviesFolder',
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
      name: 'moviesFolder',
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
    const { formatted, indexed, seasonsMap } = format(treeExample, cleanNameAsTestId);


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
      subs: null,
      season: 'Season1',
    });


    expect(Object.keys(indexed)).toContain(episodeIds.s1e1);
    expect(indexed[episodeIds.s1e1]).toEqual(formatted[0].seasons[0].episodes[0]);


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

test.group('Catalog Subtitles Indexing', ({ expect }) => {
  test('testing whether the subtitle gets associated to the episode if it has the same filename', ({ expect }) => {
    const treeExample = {
      name: 'moviesFolder',
      children: [
        {
          name: 'SomeShowFolder', type: TYPE.DIRECTORY, children: [
            {
              name: 'Season1', type: 'directory', children: [
                { name: 'Episode.1_omg_sick.mp4', path: 'some/file/path/1', type: TYPE.FILE },
                { name: 'Episode.1_omg_sick.vtt', path: 'some/file/path/1.vtt', type: TYPE.FILE },
              ]
            }
          ]
        },
      ]
    };

    const { formatted } = format(treeExample, cleanNameAsTestId);
    expect(formatted.length).toBe(1);
    expect(formatted[0].seasons.length).toBe(1);
    expect(formatted[0].seasons[0].episodes.length).toBe(1);
    expect(formatted[0].seasons[0].episodes[0]).toEqual({
      'fullId': 'SomeShowFolder.Season1.Episode_1_omg_sick_mp4',
      'id': 'Episode_1_omg_sick_mp4',
      'name': 'Episode 1 omg sick',
      'path': 'some/file/path/1',
      'season': 'Season1',
      'show': 'SomeShowFolder',
      'subs': [{
        'name': 'Episode.1_omg_sick.vtt',
        'path': 'some/file/path/1.vtt',
        'plainName': 'Episode.1_omg_sick',
      }]
    });

  });
});

// TESTS TO COLLECT VIDEO FILES FROM OTHER DIRECTORIES TOO
test.group('Catalog Single Files Addition', () => {
  test('format single files from thee of folders', ({ expect }) => {
    const treeExample = {
      name: 'moviesFolder',
      children: [
        {
          name: 'SomeShowFolder', type: TYPE.DIRECTORY, children: [
            { name: 'ARandomVideoFileWithoutSeason.mp4', path: 'some/Rando', type: TYPE.FILE },
            {
              name: 'SomeSeasonFolder', type: TYPE.DIRECTORY, children: [
                { name: 'VideoFileWithinSeason.mp4', path: 'some/season/video', type: TYPE.FILE },
              ]
            }
          ]
        },
        { name: 'SomeEmptyFolder', type: TYPE.DIRECTORY, children: [] },
        {
          name: 'SomeOtherFolder', type: TYPE.DIRECTORY, children: [
            { name: 'AVideoInOtherF.mp4', path: 'some2/f', type: TYPE.FILE },
            { name: 'AVideoInOtherF.vtt', path: 'some2/f.vtt', type: TYPE.FILE },
            { name: 'AVideoInOtherF2.mp4', path: 'some2/f2', type: TYPE.FILE },
          ]
        },
        { name: 'ARandomVideoInRoot.mp4', path: 'root/file1', type: TYPE.FILE },
        { name: 'ARandomVideoInRoot2.mp4', path: 'root/file2', type: TYPE.FILE },
        { name: 'ARandomVideoInRoot2.vtt', path: 'root/file2.vtt', type: TYPE.FILE },
      ]
    };

    const result = format(treeExample, cleanNameAsTestId);
    expect(result.formatted).toEqual([
      {
        id: cleanNameAsTestId('SomeShowFolder'), name: 'SomeShowFolder',
        seasons: [
          {
            id: cleanNameAsTestId('SomeSeasonFolder'), name: 'SomeSeasonFolder', episodes: [
              {
                id: cleanNameAsTestId('VideoFileWithinSeason.mp4'), fullId: `SomeShowFolder.SomeSeasonFolder.VideoFileWithinSeason_mp4`,
                name: 'VideoFileWithinSeason', path: 'some/season/video', season: 'SomeSeasonFolder', show: 'SomeShowFolder', subs: null,
              }
            ]
          }
        ]
      },
      {
        id: cleanNameAsTestId('moviesFolder'),
        name: 'moviesFolder',
        movies: [
          {
            id: cleanNameAsTestId('ARandomVideoFileWithoutSeason.mp4'), fullId: `moviesFolder.ARandomVideoFileWithoutSeason_mp4`,
            name: 'ARandomVideoFileWithoutSeason', path: 'some/Rando', subs: null,
          },
          {
            id: cleanNameAsTestId('ARandomVideoInRoot.mp4'), fullId: `moviesFolder.ARandomVideoInRoot_mp4`,
            name: 'ARandomVideoInRoot', path: 'root/file1', subs: null,
          },
          {
            id: cleanNameAsTestId('ARandomVideoInRoot2.mp4'), fullId: `moviesFolder.ARandomVideoInRoot2_mp4`,
            name: 'ARandomVideoInRoot2', path: 'root/file2', subs: [
              {
                'name': 'ARandomVideoInRoot2.vtt',
                'path': 'root/file2.vtt',
                'plainName': 'ARandomVideoInRoot2',
              }
            ],
          },
        ]
      }
    ]);
    expect(result.indexed).toEqual(
      {
        'SomeShowFolder.SomeSeasonFolder.VideoFileWithinSeason_mp4': {
          'fullId': 'SomeShowFolder.SomeSeasonFolder.VideoFileWithinSeason_mp4',
          'id': 'VideoFileWithinSeason_mp4',
          'name': 'VideoFileWithinSeason',
          'path': 'some/season/video',
          'season': 'SomeSeasonFolder',
          'show': 'SomeShowFolder',
          'subs': null,
        }
      });
  });
});
