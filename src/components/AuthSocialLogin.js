import styled from "styled-components";
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
    <Container>
      <SocialLoginButton name="google" onClick={onSocialClick}>
        <Logo
          alt="구글 로고"
          src={process.env.PUBLIC_URL + "/assets/google.ico"}
        />
        <Text>구글 계정으로 로그인</Text>
      </SocialLoginButton>
      <SocialLoginButton name="github" onClick={onSocialClick}>
        <Logo
          alt="깃허브 로고"
          src={process.env.PUBLIC_URL + "/assets/github.png"}
        />
        <Text>깃허브 계정으로 로그인</Text>
      </SocialLoginButton>
    </Container>
  );
}

export default AuthSocialLogin;

const Container = styled.div`
  width: 85%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SocialLoginButton = styled.button`
  cursor: pointer;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  font-size: var(--fs-basic);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--area-color);
    }
  }
`;

const Logo = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 30px;
`;

const Text = styled.span`
  flex: 1;
  margin-left: 30px;
`;
