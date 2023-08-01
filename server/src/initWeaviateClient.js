import weaviate, { ApiKey } from 'weaviate-ts-client';

export const weaviateClient = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_HOST,
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
    headers: {
        'Content-Type': 'application/json',
        'X-Palm-Api-Key': process.env.PALM_TOKEN,
    },
});
