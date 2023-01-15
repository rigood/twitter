import { useEffect, useState } from "react";
import { authService } from "fbase";
import Loader from "components/Loader";
import Router from "./Router";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setIsLoading(false);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <div className="app-layout">
      {isLoading ? (
        <Loader />
      ) : (
        <Router
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      )}
    </div>
  );
}

export default App;
