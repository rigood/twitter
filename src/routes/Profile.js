import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Tweet from "components/Tweet";
import ProfileEditor from "components/ProfileEditor";

const Profile = ({ userObj, refreshUser }) => {
  const [myTweets, setMyTweets] = useState([]);

  const getMyTweets = async () => {
    await dbService
      .collection("tweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) => {
        const tweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyTweets(tweetArray);
      });
  };

  useEffect(() => {
    getMyTweets();
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
