import React from "react";
import "./Post.css";
import {gql, useMutation, useQuery} from "@apollo/client";
import EditPostModal from "../EditPostModal/EditPostModal";
import {Button} from "react-bootstrap";
import {GET_PROFILE} from "../../pages/Profile/Profile";

const PUBLISH_UNPUBLISH_TOGGLE = gql`
    mutation togglePublished($postPublishTogglePostId: ID!) {
        postPublishToggle(postId: $postPublishTogglePostId) {
            userErrors {
                message
            }
            post {
                id
                title
                content
                published
            }
        }
    }
`;

const DELETE_POST = gql`
    mutation postDelete($postId: ID!){
        postDelete(postId: $postId) {
            userErrors {
                message
            }
            post {
                id
                title
                content
            }
        }
    }
`;

export default function Post({
                                 title,
                                 content,
                                 date,
                                 user,
                                 published,
                                 id,
                                 isMyProfile,
                             }) {

    const [publishToggleFunction, {loading, data}] = useMutation(PUBLISH_UNPUBLISH_TOGGLE);
    const [postDelete, {loadingDelete, dataDelete}] = useMutation(DELETE_POST, {
        refetchQueries: [
            GET_PROFILE, // DocumentNode object parsed with gql
            'profile' // Query name
        ],
    });


    // if (loading) return <p>Loading...</p>;

    const formatedDate = new Date(Number(date));

    return (
        <div
            className="Post"
            style={published === false ? {backgroundColor: "hotpink"} : {}}
        >
            {isMyProfile && published === false && (
                <p className="Post__publish" onClick={() => {
                    console.log("post id", id);
                    publishToggleFunction({
                        variables: {
                            postPublishTogglePostId: id,
                        }
                    })
                }}>
                    publish
                </p>
            )}
            {isMyProfile && published === true && (
                <p className="Post__publish" onClick={() => {
                    publishToggleFunction({
                        variables: {
                            postPublishTogglePostId: id,
                        }
                    })
                }}>
                    unpublish
                </p>
            )}
            {isMyProfile && (<EditPostModal postId={id} title={title} content={content}/>)}
            {isMyProfile && (
                <Button variant="primary" onClick={() => {
                    postDelete({
                        variables: {
                            postId: id,
                        }
                    });

                    if (dataDelete?.postDelete?.userErrors?.length === 0) {

                    }

                }}>
                    Delete
                </Button>
            )}
            <div className="Post__header-container">
                <h2>{title}</h2>
                <h4>
                    Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
                    {user}
                </h4>
            </div>
            <p>{content}</p>
        </div>
    );
}
