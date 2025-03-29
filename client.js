// client.js
import { createClient } from '@sanity/client'; // Named import

const config = {
    projectId: '4hqs26rj',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: true
};

export const sanityClient = createClient(config);