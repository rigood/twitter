import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "fbase";

function ProfileEditor({ userObj, refreshUser }) {
  const [mode, setMode] = useState("view");
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);

  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (mode === "edit") {
      nameInputRef.current.focus();
    }
  }, [mode]);

  const onButtonClick = () => {
    if (mode === "view") {
      setMode("edit");
      return;
    } else if (mode === "edit") {
      updateProfile();
      return;
    } else if (mode === "loading") {
      return;
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
      setNewPhotoURL(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const updateProfile = async () => {
    setMode("loading");

    if (newDisplayName === "") {
      alert("1글자 이상 입력해주세요.");
      setMode("edit");
      return;
    }

    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }

    if (userObj.photoURL !== newPhotoURL) {
      const photoRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await photoRef.putString(newPhotoURL, "data_url");
      const url = await response.ref.getDownloadURL();
      await userObj.updateProfile({
        photoURL: url,
      });
      refreshUser();
    }

    setMode("view");
  };

  return (
    <div className="editor">
      <div className="editor-preview">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          hidden
        />
        <img
          src={
            newPhotoURL ||
            process.env.PUBLIC_URL + "/assets/default-profile.jpg"
          }
        />
        {mode === "edit" && (
          <button className="editor-file" onClick={onFileClick}>
            <i className="fa-solid fa-image" />
          </button>
        )}
      </div>
      <form className="editor-name">
        <input
          type="text"
          value={newDisplayName}
          onChange={onChange}
          ref={nameInputRef}
          disabled={mode !== "edit"}
          maxLength={10}
        />
      </form>
      <button className="editor-button" onClick={onButtonClick}>
        {mode === "edit" && "프로필 저장"}
        {mode === "view" && "프로필 변경"}
        {mode === "loading" && "저장중"}
      </button>
    </div>
  );
}

export default ProfileEditor;
