import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Tweet from "components/Tweet/Tweet";
import TweetCreator from "components/Tweet/TweetCreator";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    dbService
      .collection("tweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const tweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(tweetArray);
      });
  }, []);

  return (
    <>
      <>
        <TweetCreator userObj={userObj} />
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            userObj={userObj}
            isCreator={tweet.creatorId === userObj.id}
          />
        ))}
      </>
    </>
  );
};
export default Home;
