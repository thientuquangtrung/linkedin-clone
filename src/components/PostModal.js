import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import styled from "styled-components";
import { postArticleApi } from "../features/article/articleSlice";


function PostModal(props) {
    const [textEditor, setTextEditor] = useState("");
    const [shareImg, setShareImg] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [assetArea, setAssetArea] = useState("");

    const handleChange = (e) => {
        const img = e.target.files[0];

        if (img === "" || img === undefined) {
            alert("Please select a file");
            return;
        } else {
            setShareImg(img);
        }
    };

    const switchAssetArea = (area) => {
        setShareImg("");
        setVideoLink("");
        setAssetArea(area);
    };

    const postArticle = e => {
        e.preventDefault();

        if (e.target !== e.currentTarget) {
            return;
        }

        const payload = {
            image: shareImg,
            video: videoLink,
            user: props.user,
            description: textEditor,
            timestamp: Timestamp.now(),
        }

        props.postArticle(payload)
        reset(e)
    }

    const reset = (e) => {
        setTextEditor("");
        setShareImg("");
        setVideoLink("");
        setAssetArea("");
        props.handleClick(e);
    };

    return (
        <>
            {props.showModal === "open" && (
                <Container>
                    <Content>
                        <Header>
                            <h2>Create a post</h2>
                            <button onClick={reset}>
                                <img src="/images/close-icon.svg" alt=""></img>
                            </button>
                        </Header>
                        <SharedContent>
                            <UserInfo>
                                {props.user ? (
                                    <img src={props.user.photoURL} alt='' />
                                ) : (
                                    <img src="/images/user.svg" alt=""></img>
                                )}
                                <span>
                                    {props.user && props.user.displayName}
                                </span>
                            </UserInfo>
                            <Editor>
                                <textarea
                                    value={textEditor}
                                    onChange={(e) =>
                                        setTextEditor(e.target.value)
                                    }
                                    placeholder="What do you want to talk about?"
                                    autoFocus={true}
                                />
                                {assetArea === "image" ? (
                                    <UploadImage>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="image"
                                            id="file"
                                            style={{ display: "none" }}
                                            onChange={handleChange}
                                        />
                                        <p>
                                            <label htmlFor="file">
                                                Select an image to share
                                            </label>
                                        </p>
                                        {shareImg && (
                                            <img
                                                src={URL.createObjectURL(
                                                    shareImg
                                                )}
                                                alt=""
                                            />
                                        )}
                                    </UploadImage>
                                ) : (
                                    assetArea === "video" && (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="please input a video link"
                                                value={videoLink}
                                                onChange={(e) =>
                                                    setVideoLink(e.target.value)
                                                }
                                            />
                                            {videoLink && (
                                                <ReactPlayer
                                                    width="100%"
                                                    url={videoLink}
                                                />
                                            )}
                                        </>
                                    )
                                )}
                            </Editor>
                        </SharedContent>
                        <ShareCreation>
                            <AttachAssets>
                                <AssetButton
                                    onClick={() => switchAssetArea("image")}
                                >
                                    <img src="/images/photo-icon.svg" alt="" />
                                </AssetButton>
                                <AssetButton
                                    onClick={() => switchAssetArea("video")}
                                >
                                    <img src="/images/video-icon.svg" alt="" />
                                </AssetButton>
                            </AttachAssets>
                            <ShareComment>
                                <AssetButton>
                                    <img
                                        src="/images/comment-icon.svg"
                                        alt=""
                                    />
                                    Anyone
                                </AssetButton>
                            </ShareComment>
                            <PostButton disabled={!textEditor ? true : false} onClick={e => postArticle(e)}>
                                Post
                            </PostButton>
                        </ShareCreation>
                    </Content>
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    position: fixed;
    inset: 0;
    z-index: 99999;
    color: #000;
    background: rgba(0, 0, 0, 0.8);
    animation: fadeIn 0.3s;
`;

const Content = styled.div`
    background: #fff;
    width: 100%;
    max-width: 552px;
    max-height: 90%;
    overflow: initial;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    top: 32px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: block;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
        width: 40px;
        height: 40px;
        min-width: auto;
        color: rgba(0, 0, 0, 0.15);

        svg,
        img {
            pointer-events: none;
        }
    }
`;
const SharedContent = styled.div`
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    vertical-align: baseline;
    background: transparent;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 24px;

    svg,
    img {
        width: 48px;
        height: 48px;
        background-clip: content-box;
        border: 2px solid transparent;
        border-radius: 50%;
    }

    span {
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        margin-left: 5px;
    }
`;

const ShareCreation = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
    display: flex;
    align-items: center;
    height: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.5);
`;

const AttachAssets = styled.div`
    display: flex;
    align-items: center;
    padding-right: 8px;

    ${AssetButton} {
        width: 40px;
    }
`;

const ShareComment = styled.div`
    padding-left: 8px;
    margin-right: auto;
    border-left: 1px solid rgba(0, 0, 0, 0.15);

    ${AssetButton} {
        img {
            margin-right: 5px;
        }
    }
`;

const PostButton = styled.button`
    min-width: 60px;
    border-radius: 20px;
    padding-right: 16px;
    padding-left: 16px;
    background: ${(props) =>
        props.disabled ? "rgba(0, 0, 0, 0.8)" : "#0a66c2"};
    color: ${(props) => (props.disabled ? "rgba(1, 1, 1, 0.2)" : "#fff")};

    &:hover {
        background: ${(props) =>
            props.disabled ? "rgba(0, 0, 0, 0.08)" : "#004182"};
    }
`;

const Editor = styled.div`
    padding: 12px 24px;

    textarea {
        width: 100%;
        min-height: 100px;
        resize: none;
    }

    input {
        width: 100%;
        height: 35px;
        font-size: 16px;
        margin-bottom: 20px;
    }
`;

const UploadImage = styled.div`
    text-align: center;

    img {
        width: 100%;
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => ({
    postArticle: payload => dispatch(postArticleApi(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
