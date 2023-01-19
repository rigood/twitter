import { useEffect, useState } from "react";
import styled from "styled-components";
import { authService } from "fbase";
import GlobalStyle from "styles/GloablStyle";
import Loader from "components/Loader";
import Router from "./Router";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userObj, setUserObj] = useState("");

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          id: user.uid,
          name: user.displayName || "익명",
          photoUrl:
            user.photoURL ||
            process.env.PUBLIC_URL + "/assets/default-profile.jpg",
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj("");
      }
      setIsLoading(false);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      id: user.uid,
      name: user.displayName,
      photoUrl: user.photoURL,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      <GlobalStyle />
      <Layout>
        {isLoading ? (
          <Loader />
        ) : (
          <Router
            isLoggedIn={Boolean(userObj)}
            userObj={userObj}
            refreshUser={refreshUser}
          />
        )}
      </Layout>
    </>
  );
}

export default App;

const Layout = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: var(--inner-bg-color);
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
