import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import client from "../client.js";
import BlockContent from '@sanity/block-content-to-react';
import './Singlepost.css';

export default function Singlepost() {
    const [singlePost, setSinglePost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        client.fetch(
            `*[slug.current == $slug] {
                title,
                body,
                mainImage{
                    asset->{
                        _id,
                        url
                    },
                    alt
                },
                // Add null checks for references
                "author": author->name,
                publishedAt
            }[0]`,
            { slug }
        )
            .then(data => {
                if (!data) {
                    throw new Error('Post not found');
                }
                // Handle missing mainImage case
                if (!data.mainImage?.asset?.url) {
                    console.warn('Post has no main image');
                }
                setSinglePost(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
                setError(error);
                setIsLoading(false);
            });
    }, [slug]);

    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <div>Error loading post: {error.message}</div>;
    if (!singlePost) return <div>Post not found</div>;

    return (
        <section>
            <h1>{singlePost.title}</h1>

            {/* Add optional chaining for image */}
            {singlePost.mainImage?.asset?.url && (
                <div className="image-container">
                    <img
                        src={singlePost.mainImage.asset.url}
                        alt={singlePost.mainImage.alt || 'Post image'}
                    />
                    {singlePost.mainImage?.alt && (
                        <p className="image-caption">{singlePost.mainImage.alt}</p>
                    )}
                </div>
            )}

            <div className="post-meta">
                {singlePost.author && <p className="author">By {singlePost.author}</p>}
                {singlePost.author && singlePost.publishedAt && (
                    <span className="separator">·</span>
                )}
                {singlePost.publishedAt && (
                    <p className="date">
                        {new Date(singlePost.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                )}
            </div>

            {/* Single BlockContent with proper config */}
            <div className="post-body">
                <BlockContent
                    blocks={singlePost.body || []}
                    // Corrected client config access:
                    projectId={client.config().projectId}
                    dataset={client.config().dataset}
                    apiVersion={client.config().apiVersion || "2023-05-03"}
                    serializers={{
                        types: {
                            block: (props) => <p>{props.children}</p>,
                        },
                    }}
                />
            </div>
        </section>
    );
}