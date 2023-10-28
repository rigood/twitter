import { useState } from "react";
import styled from "styled-components";
import { authService, firebaseInstance } from "fbase";

function AuthSocialLogin() {
  const [error, setError] = useState("");

  const onSocialClick = async (event) => {
    const {
      currentTarget: { name },
    } = event;

    let provider;

    try {
      if (name === "google") {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new firebaseInstance.auth.GithubAuthProvider();
      }

      await authService.signInWithPopup(provider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Button name="google" onClick={onSocialClick}>
        <Logo
          alt="구글 로고"
          src={process.env.PUBLIC_URL + "/assets/google.ico"}
        />
        <Text>구글 계정으로 로그인</Text>
      </Button>
      <Button name="github" onClick={onSocialClick}>
        <Logo
          alt="깃허브 로고"
          src={process.env.PUBLIC_URL + "/assets/github.png"}
        />
        <Text>깃허브 계정으로 로그인</Text>
      </Button>
      <ErrorMsg>{error}</ErrorMsg>
    </Container>
  );
}

export default AuthSocialLogin;

const Container = styled.div`
  width: 85%;
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  position: relative;
  width: 100%;
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

const ErrorMsg = styled.div`
  margin-top: 20px;
  color: var(--error-msg-color);
  word-break: break-word;
`;
