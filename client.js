import createClient from "@sanity/client"

const client = createClient({
    projectId: "4hqs26rj",
    dataset: "production",
    useCdn: true,
    apiVersion: "2025-03-08"
})
export default client 