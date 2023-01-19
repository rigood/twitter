import { useState, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faImage } from "@fortawesome/free-solid-svg-icons";
import TweetToolbar from "./TweetToolbar";

function TweetCreator({ userObj }) {
  const [tweet, setTweet] = useState("");
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [attachment, setAttachment] = useState("");

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const onChange = (event) => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";

    const {
      target: { value },
    } = event;

    if (value !== "") {
      setIsLengthValid(true);
    } else {
      setIsLengthValid(false);
    }

    setTweet(value);
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

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";

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
    setIsLengthValid(false);
    fileInputRef.current.value = "";
  };

  return (
    <Container>
      <Profile>
        <Photo
          src={
            userObj.photoURL ||
            process.env.PUBLIC_URL + "/assets/default-profile.jpg"
          }
        />
      </Profile>
      <Write onSubmit={onSubmit}>
        <Textarea
          value={tweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
          required
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
          disabled={!isLengthValid}
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
  cursor: pointer;
`;

const ClearButtonIcon = styled(FontAwesomeIcon)`
  font-size: var(--fs-basic);
`;
