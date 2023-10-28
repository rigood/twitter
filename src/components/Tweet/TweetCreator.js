import { useState, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TweetToolbar from "./TweetToolbar";

export const MAX_LENGTH_OF_TWEET = 120;

function TweetCreator({ userObj }) {
  const [tweet, setTweet] = useState("");
  const [isTweetLengthValid, setIsTweetLengthValid] = useState(false);
  const [attachment, setAttachment] = useState("");
  const [isUploadingTweet, setIsUploadingTweet] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const onTweetChange = (event) => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";

    const {
      target: { value },
    } = event;

    if (value !== "") {
      setIsTweetLengthValid(true);
    } else {
      setIsTweetLengthValid(false);
    }

    if (value.length > MAX_LENGTH_OF_TWEET) {
      setTweet(value.substr(0, MAX_LENGTH_OF_TWEET));
    } else {
      setTweet(value);
    }
  };

  const onFileClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };

    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onFileClear = () => {
    setAttachment("");
    fileInputRef.current.value = "";
  };

  const uploadTweet = async () => {
    let attachmentUrl = "";

    setIsUploadingTweet(true);

    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);

      const response = await attachmentRef.putString(attachment, "data_url");

      attachmentUrl = await response.ref.getDownloadURL();
    }

    const tweetObj = {
      text: tweet,
      creatorId: userObj.id,
      creatorName: userObj.name,
      creatorPhotoUrl: userObj.photoUrl,
      createdAt: Date.now(),
      attachmentUrl,
    };

    await dbService.collection("tweets").add(tweetObj);

    setTweet("");
    setAttachment("");
    setIsTweetLengthValid(false);
    setIsUploadingTweet(false);
    fileInputRef.current.value = "";
  };

  return (
    <Container>
      <Profile>
        <Photo alt="프로필 사진" src={userObj.photoUrl} />
      </Profile>
      <Write>
        <Textarea
          value={tweet}
          onChange={onTweetChange}
          placeholder="What's on your mind?"
          ref={textareaRef}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          hidden
        />
        {attachment && (
          <Preview>
            <PreviewImg src={attachment} />
            <ClearButton onClick={onFileClear}>
              <ClearButtonIcon icon={faXmark} />
            </ClearButton>
          </Preview>
        )}
        <TweetToolbar
          onFileClick={onFileClick}
          length={tweet.length}
          disabled={!isTweetLengthValid || isUploadingTweet}
          uploadTweet={uploadTweet}
          isUploadingTweet={isUploadingTweet}
        />
      </Write>
    </Container>
  );
}

export default TweetCreator;

const Container = styled.div`
  width: 100%;
  background-color: var(--sub-color);
  display: flex;
  padding: 5%;
  padding-bottom: 2.5%;
`;

const Profile = styled.div`
  width: calc(40px + 4%);
`;

const Photo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Write = styled.form`
  flex: 1;
`;

const Textarea = styled.textarea`
  width: 100%;
  resize: none;
  padding: 2.5%;
  background-color: white;
  border-radius: var(--radius-sm);
  font-size: var(--fs-basic);

  &:focus {
    outline: 2px solid var(--main-color);
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const Preview = styled.div`
  position: relative;
  width: fit-content;
  margin: 10px 0;
`;

const PreviewImg = styled.img`
  max-width: 90%;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 0;
  padding: 1px 10px;
`;

const ClearButtonIcon = styled(FontAwesomeIcon)`
  font-size: var(--fs-basic);
`;
