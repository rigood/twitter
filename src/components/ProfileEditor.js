import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function ProfileEditor({ userObj, refreshUser }) {
  const [mode, setMode] = useState("view");
  const [newName, setNewName] = useState(userObj.name);
  const [newPhotoUrl, setNewPhotoUrl] = useState(userObj.photoUrl);

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
      setNewPhotoUrl(result);
    };

    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewName(value);
  };

  const updateProfile = async () => {
    setMode("loading");

    if (newName === "") {
      alert("1글자 이상 입력해주세요.");
      setMode("edit");
      return;
    }

    if (userObj.name !== newName) {
      await userObj.updateProfile({
        displayName: newName,
      });
      refreshUser();
    }

    if (userObj.photoUrl !== newPhotoUrl) {
      const photoRef = storageService.ref().child(`${userObj.id}/${uuidv4()}`);
      const response = await photoRef.putString(newPhotoUrl, "data_url");
      const url = await response.ref.getDownloadURL();
      await userObj.updateProfile({
        photoURL: url,
      });
      refreshUser();
    }

    setMode("view");
  };

  return (
    <Wrapper>
      <Preview>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          hidden
        />
        <Photo
          src={
            newPhotoUrl ||
            process.env.PUBLIC_URL + "/assets/default-profile.jpg"
          }
        />
        {mode === "edit" && (
          <UploadButton onClick={onFileClick}>
            <UploadButtonIcon icon={faImage} />
          </UploadButton>
        )}
      </Preview>
      <Name>
        <NameInput
          type="text"
          value={newName}
          onChange={onChange}
          disabled={mode !== "edit"}
          maxLength={10}
          ref={nameInputRef}
        />
      </Name>
      <EditModeButton onClick={onButtonClick}>
        {mode === "edit" && "프로필 저장"}
        {mode === "view" && "프로필 변경"}
        {mode === "loading" && "저장중"}
      </EditModeButton>
    </Wrapper>
  );
}

export default ProfileEditor;

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 0;
  background-color: var(--sub-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Preview = styled.div`
  margin: 0 auto;
  position: relative;
  margin-bottom: 15px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  object-fit: cover;
`;

const UploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const UploadButtonIcon = styled(FontAwesomeIcon)`
  color: white;
  font-size: var(--fs-basic);
`;

const Name = styled.form`
  width: 50%;
  margin: 0 auto;
  margin-bottom: 15px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
`;

const NameInput = styled.input`
  flex: 1;
  width: 100%;
  text-align: center;
  padding: 5px;
  font-size: var(--fs-lg);
  font-weight: 700;

  &:enabled {
    background-color: white;
  }
`;

const EditModeButton = styled.button`
  width: fit-content;
  margin: 0 auto;
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  background-color: var(--main-color);
  color: white;
  font-size: var(--fs-sm);
  cursor: pointer;
`;
