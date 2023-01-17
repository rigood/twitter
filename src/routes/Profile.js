import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Tweet from "components/Tweet";
import ProfileEditor from "components/ProfileEditor";

const Profile = ({ userObj, refreshUser }) => {
  const [myTweets, setMyTweets] = useState([]);

  useEffect(() => {
    dbService
      .collection("tweets")
      .where("creatorId", "==", userObj.uid)
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
          isOwner={tweet.creatorId === userObj.uid}
        />
      ))}
    </>
  );
};

export default Profile;
