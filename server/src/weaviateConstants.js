export const WEAVIATE_CLASS_NAME = 'Book';

export const WEAVIATE_CLASS = {
    class: WEAVIATE_CLASS_NAME,
    vectorizer: 'text2vec-palm',
    moduleConfig: {
        'text2vec-palm': {
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
        }
    },
    properties: [
        {
            name: 'title',
            dataType: ['text'],
            description: 'Book title that will be vectorized',
            moduleConfig: {
                'text2vec-palm': {
                    skip: false,
                    vectorizePropertyName: false
                },
            },
        },
        {
            name: 'desc',
            dataType: ['text'],
            description: 'Book description that will be vectorized',
            moduleConfig: {
                'text2vec-palm': {
                    skip: false,
                    vectorizePropertyName: false
                },
            },
        },
        {
            name: 'genre',
            dataType: ['text'],
            description: 'Book genre that will be vectorized',
            moduleConfig: {
                'text2vec-palm': {
                    skip: false,
                    vectorizePropertyName: false
                },
            },
        },
    ],
};

