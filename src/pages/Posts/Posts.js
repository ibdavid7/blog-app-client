import React from "react";
import Post from "../../components/Post/Post";
import {gql, useQuery} from "@apollo/client";


const GET_POSTS = gql`
    query getPosts {
        posts {
            id
            title
            content
            createdAt
            published
            user {
                id
                name
            }
        }
    }
`;

export default function Posts() {

    const {loading, error, data} = useQuery(GET_POSTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const posts = data.posts.map((post) => {
        return (<p><Post id={post.id}
                         date={post.createdAt}
                         title={post.title}
                         content={post.content}
                         user={post.user.name}
                         published={post.published}
        /></p>);
    });

    return <div>{posts}</div>;
}
