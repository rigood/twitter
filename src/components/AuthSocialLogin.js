import { authService, firebaseInstance } from "fbase";

function AuthSocialLogin() {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <div className="auth-social-login">
      <button name="google" onClick={onSocialClick}>
        <img
          src={process.env.PUBLIC_URL + "/assets/google.ico"}
          alt="구글 로고"
        />
        <span>구글 계정으로 로그인</span>
      </button>
      <button name="github" onClick={onSocialClick}>
        <img
          src={process.env.PUBLIC_URL + "/assets/github.png"}
          alt="깃허브 로고"
        />
        <span>깃허브 계정으로 로그인</span>
      </button>
    </div>
  );
}

export default AuthSocialLogin;
