import { Router } from 'express';
import { WEAVIATE_CLASS_NAME } from '../weaviateConstants.js';
import { weaviateClient } from '../initWeaviateClient.js';
import { nearTextQuery } from '../nearTextSearch.js';

// The router will be added as a middleware and will take control of requests starting with /book.
const routes = Router();
export default routes;

const commonFieldsToRetrieve = [
    'title',
    'author',
    'cover',
    'desc',
    'rating',
    'genres'
];

routes.route('/').get(async (req, res) => {
    let limit = req?.query?.limit || 12;
    if (!limit || limit > 100) {
        limit = 12;
    }

    const result = await weaviateClient.graphql
        .get()
        .withClassName(WEAVIATE_CLASS_NAME)
        .withFields(commonFieldsToRetrieve.join(' '))
        .withWhere({
            operator: 'GreaterThan',
            path: [ 'rating' ],
            valueNumber: 4
        })
        .withLimit(limit)
        .do();

    const records = result?.data?.Get?.[WEAVIATE_CLASS_NAME] || [];
    res.json(records);
});

routes.route('/search').get(async (req, res) => {
    let limit = req?.query?.limit || 4;
    if (!limit || limit > 100) {
        limit = 4;
    }

    const conceptsString = req?.query?.concepts;
    const concepts = conceptsString.split(' ');

    const records = await nearTextQuery(WEAVIATE_CLASS_NAME, commonFieldsToRetrieve, concepts, limit);
    res.json(records);
});
