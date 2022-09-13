const { test } = require('@japa/runner');

const { latestStackHelper } = require('../../src/libs/latestStack');

const basicInfo = { name: 'yo' };
const makeEpisode = ({ id = 'anEpisodeId', info = { ...basicInfo }, finished = false }) => ({ id, info, finished });
const MAX = 3;

test.group('Latest Stack Handling', () => {
  test('when empty adds an episode that is not finished on top', ({ expect }) => {
    const result = latestStackHelper.handle(makeEpisode({ id: 'anId' }), MAX, []);
    expect(result).toEqual([{ id: 'anId', info: basicInfo, finished: false }]);
  });

  test('when almost full adds an episode that is not finished on top', ({ expect }) => {
    const result = latestStackHelper.handle(makeEpisode({ id: 'anId3' }), MAX, [makeEpisode({ id: 'anId2' }), makeEpisode({ id: 'anId1' })]);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(makeEpisode({ id: 'anId3' }));
  });

  test('when full adds an episode that is not finished on top an removes the oldest one', ({ expect }) => {
    const result = latestStackHelper.handle(
      makeEpisode({ id: 'anId4' }),
      MAX, [
      makeEpisode({ id: 'anId3' }), makeEpisode({ id: 'anId2' }), makeEpisode({ id: 'anId1' })
    ]);
    expect(result.length).toBe(MAX);
    expect(result[0]).toEqual(makeEpisode({ id: 'anId4' }));
    expect(result[2]).toEqual(makeEpisode({ id: 'anId2' }));
  });

  test('if an episode is already in place it updates the info, then moves it to the first place', ({ expect }) => {
    const stack = [makeEpisode({ id: 'anId3' }), makeEpisode({ id: 'anId2' }), makeEpisode({ id: 'anId1' })];
    const result = latestStackHelper.handle(makeEpisode({ id: 'anId2', info: { name: 'someOtherStuff' } }), MAX, [...stack]);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(makeEpisode({ id: 'anId2', info: { name: 'someOtherStuff' } }));
    expect(result[1]).toEqual(makeEpisode({ id: 'anId3' }));
    expect(result[2]).toEqual(makeEpisode({ id: 'anId1' }));
  });

  test('when the episode is finished it does not add it to latestStack if it wanst there', ({ expect }) => {
    const result = latestStackHelper.handle(
      makeEpisode({ id: 'anId4', finished: true }),
      MAX, [
      makeEpisode({ id: 'anId3' }), makeEpisode({ id: 'anId2' }), makeEpisode({ id: 'anId1' })
    ]);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(makeEpisode({ id: 'anId3' }));
    expect(result[1]).toEqual(makeEpisode({ id: 'anId2' }));
    expect(result[2]).toEqual(makeEpisode({ id: 'anId1' }));
  });

  test('when the episode is finished it does remove it from the latestStack if it was there', ({ expect }) => {
    const result = latestStackHelper.handle(
      makeEpisode({ id: 'anId3', finished: true }),
      MAX, [
      makeEpisode({ id: 'anId3' }), makeEpisode({ id: 'anId2' }), makeEpisode({ id: 'anId1' })
    ]);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(makeEpisode({ id: 'anId2' }));
    expect(result[1]).toEqual(makeEpisode({ id: 'anId1' }));
  });

});
