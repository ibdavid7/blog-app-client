import React from "react";
import {useParams} from "react-router";
import AddPostModal from "../../components/AddPostModal/AddPostModal";
import Post from "../../components/Post/Post";
import {gql, useQuery} from "@apollo/client";

export const GET_PROFILE = gql`
    query profile($userId: ID!) {
        profile(userId: $userId) {
            id
            bio
            isMyProfile
            user {
                id
                name
                email
                posts {
                    id
                    title
                    content
                    published
                }
            }
        }
    }
`;

export default function Profile() {
    const {id} = useParams();

    const {loading, error, data} = useQuery(GET_PROFILE, {
        variables: {
            userId: id,
        }
    });

    if (error) return <div>Error Page</div>;

    if (loading) return <div>Loading...</div>;

    const {profile} = data;

    return (
        <div>
            <div
                style={{
                    marginBottom: "2rem",
                    display: "flex ",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h1>{profile.user.name}</h1>
                    <p>{profile.bio}</p>
                </div>
                <div>{profile.isMyProfile ? <AddPostModal/> : null}</div>
            </div>
            <div>{profile.user.posts.map(post => {
                return (<p key={post.id}><Post id={post.id}
                                               date={post.createdAt}
                                               title={post.title}
                                               content={post.content}
                                               user={profile.user.name}
                                               published={post.published}
                                               isMyProfile={profile.isMyProfile}
                /></p>);
            })
            }</div>
        </div>
    );
}
