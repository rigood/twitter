import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function TweetToolbar({
  onFileClick,
  length,
  disabled,
  uploadTweet,
  isUploadingTweet,
}) {
  return (
    <Toolbar>
      <ToolbarGroup>
        <UploadButton type="button" onClick={onFileClick}>
          <UploadButtonIcon icon={faImage} />
        </UploadButton>
      </ToolbarGroup>
      <ToolbarGroup>
        <Length>{length}/120</Length>
        <TweetButton type="button" disabled={disabled} onClick={uploadTweet}>
          {isUploadingTweet ? "Uploading..." : "Tweet"}
        </TweetButton>
      </ToolbarGroup>
    </Toolbar>
  );
}

export default TweetToolbar;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
`;

const UploadButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const UploadButtonIcon = styled(FontAwesomeIcon)`
  color: var(--main-color);
`;

const Length = styled.span`
  margin: 0 10px;
  font-size: var(--fs-sm);
`;

const TweetButton = styled.button`
  margin: 0 10px;
  padding: 5px 10px;
  background-color: var(--main-color);
  border-radius: var(--radius-sm);
  color: white;
  font-size: var(--fs-basic);

  &:enabled {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
