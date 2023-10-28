import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import TweetToolbar from "./TweetToolbar";
import { MAX_LENGTH_OF_TWEET } from "./TweetCreator";

function getDate(milliseconds) {
  const date = new Date(milliseconds);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleString("ko-KR", options);
}

const Tweet = ({ tweetObj, userObj, isCreator }) => {
  const [isEditingTweet, setIsEditingTweet] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [newAttachment, setNewAttachment] = useState(tweetObj.attachmentUrl);
  const [isTweetLengthValid, setIsTweetLengthValid] = useState(true);
  const [isUploadingTweet, setIsUploadingTweet] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const editTweet = () => {
    if (!isEditingTweet) {
      setIsEditingTweet(true);
    } else {
      const ok = window.confirm("변경한 내용을 저장하시겠습니까?");

      if (ok) {
        uploadTweet();
      } else {
        setIsEditingTweet(false);
        setNewTweet(tweetObj.text);
        setNewAttachment(tweetObj.attachmentUrl);
        setIsTweetLengthValid(true);
      }
    }
  };

  useEffect(() => {
    if (isEditingTweet) {
      textareaRef.current.focus();
    }
  }, [isEditingTweet]);

  useEffect(() => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [newTweet]);

  const onTweetFocus = (event) => {
    event.target.selectionStart = event.target.value.length;
  };

  const onTweetChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value !== "") {
      setIsTweetLengthValid(true);
    } else {
      setIsTweetLengthValid(false);
    }

    if (value.length > MAX_LENGTH_OF_TWEET) {
      setNewTweet(value.substr(0, MAX_LENGTH_OF_TWEET));
    } else {
      setNewTweet(value);
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
      setNewAttachment(result);
    };

    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onFileClear = () => {
    setNewAttachment("");
    fileInputRef.current.value = "";
  };

  const uploadTweet = async () => {
    let attachmentUrl;

    setIsUploadingTweet(true);

    if (tweetObj.attachmentUrl !== newAttachment) {
      if (newAttachment.startsWith("https")) {
        attachmentUrl = newAttachment;
      } else if (newAttachment === "") {
        attachmentUrl = "";
      } else {
        const attachmentRef = storageService
          .ref()
          .child(`${userObj.id}/${uuidv4()}`);

        const response = await attachmentRef.putString(
          newAttachment,
          "data_url"
        );

        attachmentUrl = await response.ref.getDownloadURL();
      }
    }

    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
      attachmentUrl,
    });

    setIsEditingTweet(false);
    setIsUploadingTweet(false);
  };

  const deleteTweet = async () => {
    const ok = window.confirm("트윗을 삭제하시겠습니까?");

    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      if (tweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(tweetObj.attachmentUrl).delete();
      }
    }
  };

  return (
    <Wrapper>
      <Header>
        <HeaderProfile>
          <Photo
            src={
              tweetObj.creatorPhotoUrl ||
              process.env.PUBLIC_URL + "/assets/default-profile.jpg"
            }
          />
        </HeaderProfile>
        <HeaderInfo>
          <Username>{tweetObj.creatorName}</Username>
          <CreatedAt>{getDate(tweetObj.createdAt)}</CreatedAt>
        </HeaderInfo>
        {isCreator && (
          <HeaderToolbar>
            <ToolbarButton onClick={editTweet}>
              <ToolbarButtonIcon icon={faPencil} />
            </ToolbarButton>
            <ToolbarButton onClick={deleteTweet}>
              <ToolbarButtonIcon icon={faTrashCan} />
            </ToolbarButton>
          </HeaderToolbar>
        )}
      </Header>
      <Main onSubmit={uploadTweet}>
        <Textarea
          value={newTweet}
          onChange={onTweetChange}
          onFocus={onTweetFocus}
          disabled={!isEditingTweet}
          ref={textareaRef}
          rows={1}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          hidden
        />
        {newAttachment && (
          <Preview>
            <PreviewImg src={newAttachment} />
            <ClearButton
              type="button"
              onClick={onFileClear}
              disabled={!isEditingTweet}
            >
              <ClearButtonIcon icon={faXmark} />
            </ClearButton>
          </Preview>
        )}
        {isEditingTweet && (
          <TweetToolbar
            onFileClick={onFileClick}
            length={newTweet.length}
            disabled={!isTweetLengthValid || isUploadingTweet}
            uploadTweet={uploadTweet}
            isUploadingTweet={isUploadingTweet}
          />
        )}
      </Main>
    </Wrapper>
  );
};
export default Tweet;

const Wrapper = styled.article`
  width: 100%;
  padding: 5%;
  padding-right: 2.5%;
  display: flex;
  flex-direction: column;
  border-bottom: 5px solid var(--area-color);
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const HeaderProfile = styled.div`
  width: calc(40px + 4%);
`;

const Photo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const HeaderInfo = styled.div`
  flex: 1;
  padding-top: 3px;
  font-size: var(--fs-basic);
`;

const Username = styled.div`
  margin-bottom: 5px;
  font-size: var(--fs-basic);
  font-weight: 700;
`;

const CreatedAt = styled.div`
  color: var(--sub-text-color);
  font-size: var(--fs-sm);
`;

const HeaderToolbar = styled.div`
  display: flex;
`;

const ToolbarButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--sub-color);
      color: var(--main-color);
    }
  }
`;

const ToolbarButtonIcon = styled(FontAwesomeIcon)`
  font-size: var(--fs-basic);
`;

const Main = styled.div`
  width: 97.5%;
  padding: 20px 0;
  font-size: var(--fs-basic);
`;

const Textarea = styled.textarea`
  width: 100%;
  height: fit-content;
  resize: none;
  border-radius: var(--radius-sm);
  outline: 1px solid var(--border-color);
  line-height: 1.3;

  &:disabled {
    outline: none;
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

  &:disabled {
    display: none;
  }
`;

const ClearButtonIcon = styled(FontAwesomeIcon)`
  font-size: var(--fs-basic);
`;
