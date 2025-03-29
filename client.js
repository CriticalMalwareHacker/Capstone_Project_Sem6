// client.js
import { createClient } from '@sanity/client' // Named import

const config = {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    apiVersion: '2023-05-03',
    useCdn: true
};

export const sanityClient = createClient(config);