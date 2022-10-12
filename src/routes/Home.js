import React, { useEffect, useState } from "react";
import { dbService } from "fbase";

const Home = () => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const getTweets = async () => {
    const dbTweets = await dbService.collection("tweets").get();
    dbTweets.forEach((document) => {
      const tweetObject = {
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getTweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("tweets").add({
      tweet,
      createdAt: Date.now(),
    });
    setTweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  console.log(tweets);
  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input value={tweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
          <input type="submit" value="Tweet" />
        </form>
      </div>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <h4>{tweet.tweet}</h4>
          </div>
        ))}
      </div>
    </>
  );
};
export default Home;
