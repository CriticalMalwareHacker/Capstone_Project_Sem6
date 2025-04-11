// Remove Sanity client and create API helper if needed
const API = {
    getPosts: async () => {
        const response = await fetch("http://localhost:5000/api/posts");
        return response.json();
    },
    getPost: async slug => {
        const response = await fetch(`http://localhost:5000/api/posts/${slug}`);
        return response.json();
    }
};

export default API;