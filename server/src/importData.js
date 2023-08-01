import './loadEnvironmentVariables.js';

import weaviate, { ApiKey } from 'weaviate-ts-client';
import Papa from 'papaparse';
import { WEAVIATE_CLASS_NAME, WEAVIATE_CLASS } from './weaviateConstants.js';

const FILE_URL = 'https://raw.githubusercontent.com/sis0k0/books-data/main/GoodReads_100k_books-1.csv';
const client = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_HOST,
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
    headers: {
        'Content-Type': 'application/json',
        'X-Palm-Api-Key': process.env.PALM_TOKEN,
    },
});

const bookObjectTransformer = book => ({
    class: WEAVIATE_CLASS_NAME,
    properties: {
        isbn: book?.isbn || book?.isbn13,
        author: book?.author,
        title: book?.title,
        desc: book?.desc,
        rating: Number(book?.rating),
        genres: book?.genre,
        cover: book?.img,
    },
});

await upsertWeaviateClass(WEAVIATE_CLASS_NAME, WEAVIATE_CLASS);
const data = await loadCSVData(FILE_URL);
await importDataToWeaviate(data, bookObjectTransformer);

console.log('Successfully imported data!');

async function upsertWeaviateClass(weaviateClassName, weaviateClass) {
    // Delete existing class with the same name
    await client.schema
        .classDeleter()
        .withClassName(weaviateClassName)
        .do();

    try {
        // Create a new class
        await client
            .schema
            .classCreator()
            .withClass(weaviateClass)
            .do();
    } catch (error) {
        console.error('Failed to add schema.', weaviateClass, error);
        throw error;
    }
}

async function loadCSVData(fileUrl) {
    let file;
    try {
        file = await fetch(fileUrl, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8'
            }
        });
    } catch (error) {
        console.error(`Failed to fetch CSV file from ${fileUrl}`);
        throw error;
    }

    try {
        const text = await file.text();
        const { data } = Papa.parse(text, {
            header: true,
            transformHeader: h => h.trim()
        });

        return data;
    } catch (error) {
        console.error(`Failed to parse CSV file from ${fileUrl}`);
        throw error;
    }
}

async function importDataToWeaviate(data, transformerFn) {
    let batcher = client.batch.objectsBatcher();
    var counter = 0;
    const batchSize = 100;

    for (let i = 0; i < data.length; i++) {
        const weaviateObject = transformerFn(data[i]);
        batcher = batcher.withObject(weaviateObject);

        if (counter++ >= batchSize) {
            try {
                const _res = await batcher.do();
            } catch (error) {
                console.error('Batch import into Weaviate failed.', error);
                throw error;
            }

            counter = 0;
            batcher = client.batch.objectsBatcher();
        }

    }

    try {
        await batcher.do();
    } catch (error) {
        console.error('Batch import into Weaviate failed.', error);
        throw error;
    }
}
