export const config = {
  cardImages: {
    // URL to the JSON file containing card image mappings
    jsonUrl: process.env.REACT_APP_CARD_IMAGES_JSON_URL || 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/small.json',
    // Base URL for card images
    baseUrl: process.env.REACT_APP_CARD_IMAGES_BASE_URL || 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/',
    // Cache key for localStorage
    cacheKey: 'ptcg_card_images_cache',
    // Cache expiration time in milliseconds (7 days)
    cacheExpiration: 7 * 24 * 60 * 60 * 1000
  }
}; 