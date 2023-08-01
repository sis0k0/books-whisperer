import { weaviateClient } from "./initWeaviateClient.js";

export async function nearTextQuery(className, fields, concepts, limit = 5) {
    validateNearTextInput({ className, fields, concepts, limit });

    const res = await weaviateClient.graphql
        .get()
        .withClassName(className)
        .withFields(fields.join(' '))
        .withNearText({ concepts })
        .withLimit(limit)
        .do();

    const books = res?.data?.Get?.[className] || [];

    return books;
}

function validateNearTextInput(args) {
    const errors = [];
    if (!args) {
        throw new Error('Required parameters: `\className\', \'fields\', \'query\'.');
    }

    const { className, fields, concepts, limit } = args;

    if (!className || typeof className !== 'string') {
        errors.push('\'className\' is required and must be a \'string\'.');
    }

    if (!fields || !Array.isArray(fields)) {
        errors.push('\'fields\' is required and must be an \'Array\'.');
    }

    if (!concepts || !Array.isArray(concepts)) {
        errors.push('\'concepts\' is required and must be an \'Array\'.');
    }

    if (!!limit && typeof limit !== 'number' && typeof limit !== 'string') {
        errors.push('\'limit\' must be a \'number\' or \'string\'.');
    }

    if (errors.length) {
        throw new Error(errors.join('\n'));
    }
}
