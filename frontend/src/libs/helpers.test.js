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
});