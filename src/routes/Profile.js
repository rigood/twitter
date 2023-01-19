import { useState, useEffect } from "react";
import styled from "styled-components";
import { dbService } from "fbase";
import Tweet from "components/Tweet";
import ProfileEditor from "components/ProfileEditor";

const Profile = ({ userObj, refreshUser }) => {
  const [myTweets, setMyTweets] = useState([]);

  useEffect(() => {
    dbService
      .collection("tweets")
      .where("creatorId", "==", userObj.id)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const tweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyTweets(tweetArray);
      });
  }, []);

  return (
    <>
      <ProfileEditor userObj={userObj} refreshUser={refreshUser} />
      {myTweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweetObj={tweet}
          userObj={userObj}
          isOwner={tweet.creatorId === userObj.id}
        />
      ))}
      {myTweets.length === 0 && <EmptyMsg>작성한 트윗이 없습니다.</EmptyMsg>}
    </>
  );
};

export default Profile;

const EmptyMsg = styled.div`
  margin: 50px auto;
  font-size: var(--fs-lg);
`;
