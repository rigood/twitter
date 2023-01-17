import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

function getDate(milliseconds) {
  const date = new Date(milliseconds);
  return date.toLocaleString();
}

const Tweet = ({ tweetObj, userObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [newAttachment, setNewAttachment] = useState(tweetObj.attachmentUrl);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [newTweet]);

  const onEditClick = () => setIsEditing((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
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

  const onClearAttachment = () => {
    setNewAttachment("");
    fileInputRef.current.value = "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";
    if (newAttachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(newAttachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
      attachmentUrl,
    });

    setIsEditing(false);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("트윗을 삭제하시겠습니까?");
    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      if (tweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(tweetObj.attachmentUrl).delete();
      }
    }
  };

  return (
    <div className="tweet">
      <div className="tweet-header">
        <div className="tweet-header__profile">
          <img
            src={
              tweetObj.creatorPhotoUrl ||
              process.env.PUBLIC_URL + "/assets/default-profile.jpg"
            }
          />
        </div>
        <div className="tweet-header__info">
          <div className="tweet-header__info-username">
            {tweetObj.creatorName}
          </div>
          <div className="tweet-header__info-createdAt">
            {getDate(tweetObj.createdAt)}
          </div>
        </div>
        {isOwner && (
          <div className="tweet-header__menu">
            <button onClick={onEditClick} className="tweet-header__menu-icon">
              <i className="fa-solid fa-pencil"></i>
            </button>
            <button onClick={onDeleteClick} className="tweet-header__menu-icon">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="tweet-main">
        <textarea
          value={newTweet}
          onChange={onChange}
          disabled={!isEditing}
          maxLength={120}
          required
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
          <div className="tweet-main__preview">
            <img src={newAttachment} />
            <button
              type="button"
              onClick={onClearAttachment}
              className="tweet-clear"
              disabled={!isEditing}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
        {isEditing && (
          <div className="tweet-main__toolbar">
            <div className="tweet-main__toolbar-left">
              <button
                type="button"
                className="tweet-button"
                onClick={onFileClick}
              >
                <i className="fa-solid fa-image"></i>
              </button>
            </div>
            <div className="tweet-main__toolbar-right">
              <span className="tweet-length">{newTweet.length}/120</span>
              <input type="submit" value="Tweet" className="tweet-submit" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default Tweet;
