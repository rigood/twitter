import { useState } from "react";
import styled from "styled-components";
import AuthForm from "components/Auth/AuthForm";
import AuthSocialLogin from "components/Auth/AuthSocialLogin";

const Auth = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  const toggleAuthPage = () => setIsLoginPage((prev) => !prev);

  return (
    <>
      <AuthHeader>
        <Logo alt="트위터 로고" src={process.env.PUBLIC_URL + "/favicon.ico"} />
        <Title>{isLoginPage ? "로그인" : "회원가입"}</Title>
      </AuthHeader>

      <AuthForm isLoginPage={isLoginPage} />

      <AuthToggle>
        <AuthToggleText>
          {isLoginPage ? "처음이신가요?" : "이미 회원이신가요?"}
        </AuthToggleText>
        <AuthToggleButton type="button" onClick={toggleAuthPage}>
          {isLoginPage ? "회원가입" : "로그인"}
        </AuthToggleButton>
      </AuthToggle>

      {isLoginPage && <AuthSocialLogin />}
    </>
  );
};

export default Auth;

const AuthHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
`;

const Logo = styled.img`
  width: 30px;
`;

const Title = styled.h1`
  margin-top: 20px;
  font-size: var(--fs-title);
  font-weight: 700;
`;

const AuthToggle = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const AuthToggleText = styled.span`
  font-size: var(--fs-basic);
`;

const AuthToggleButton = styled.button`
  margin-left: 3px;
  color: var(--main-color);
  font-size: var(--fs-basic);
`;
