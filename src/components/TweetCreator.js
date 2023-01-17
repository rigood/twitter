import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

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
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorName: userObj.displayName,
      creatorPhotoUrl: userObj.photoURL,
      attachmentUrl,
    };
    await dbService.collection("tweets").add(tweetObj);
    setTweet("");
    setAttachment("");
    setIsLengthValid(false);
    fileInputRef.current.value = "";
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInputRef.current.value = "";
  };

  return (
    <form onSubmit={onSubmit} className="creator-form">
      <div className="creator-profile">
        <img
          src={
            userObj.photoURL ||
            process.env.PUBLIC_URL + "/assets/default-profile.jpg"
          }
        />
      </div>
      <div className="creator-write">
        <textarea
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
          <div className="creator-write__preview">
            <img src={attachment} />
            <button onClick={onClearAttachment} className="creator-clear">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
        <div className="creator-write__toolbar">
          <div className="creator-write__toolbar-left">
            <button
              type="button"
              className="creator-button"
              onClick={onFileClick}
            >
              <i className="fa-solid fa-image"></i>
            </button>
          </div>
          <div className="creator-write__toolbar-right">
            <span className="creator-length">{tweet.length}/120</span>
            <input
              type="submit"
              value="Tweet"
              className="creator-submit"
              disabled={!isLengthValid}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default TweetCreator;
