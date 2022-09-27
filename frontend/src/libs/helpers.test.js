import { catalogHelper } from "./helpers";
const mockCatalog = [
    {
        id: 'show1',
        name: 'Show1',
        seasons: [
            {
                id: 'season1',
                name: 'Season 1',
                episodes: [
                    {
                        id: 'episode1',
                        fullId: 'show1.season1.episode1',
                        name: 'episode 1'
                    }
                ]
            }
        ]
    },
    {
        id: 'strayMoviesFolder',
        meta: { stray: true },
        name: 'someStuff',
        movies: [
            { fullId: 'strayMoviesFolder.movie1' }
        ]
    }
];

describe("Catalog Helper tests", () => {
    it("Get Episode By Id by default uses full Id of the episode", () => {
        const result = catalogHelper.getEpisodeById('show1.season1.episode1', mockCatalog);
        expect(result).not.toBe(null);
        expect(result.id).toBe('episode1');
    });

    it("Get Episode By Id returns null if wrong episodeFullId", () => {
        const result = catalogHelper.getEpisodeById('show1.episode1', mockCatalog);
        expect(result).toBe(null);
    });

    it("Get Episode By Id returns null if catalog empty", () => {
        const result = catalogHelper.getEpisodeById('show1.season1.episode1', []);
        expect(result).toBe(null);
    });

    it("Get movie By Id returns a correct entry from the stray movie catalog entry", () => {
        const result = catalogHelper.getEpisodeById('strayMoviesFolder.movie1', mockCatalog);
        expect(result).toEqual({ fullId: 'strayMoviesFolder.movie1' });
    });

    it("Get movie By Id returns null from the stray movie catalog entry if not a valid id", () => {
        const result = catalogHelper.getEpisodeById('strayMoviesFolder.movie2', mockCatalog);
        expect(result).toBe(null);
    });
});