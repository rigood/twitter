import { useState } from "react";
import AuthForm from "components/AuthForm";
import AuthSocialLogin from "components/AuthSocialLogin";

const Auth = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const toggleAuthPage = () => setIsLoginPage((prev) => !prev);

  return (
    <>
      <div className="auth-header">
        <img src="favicon.ico" alt="로고" />
        <h1>{isLoginPage ? "로그인" : "회원가입"}</h1>
      </div>

      <AuthForm isNewAccount={!isLoginPage} />

      <div className="auth-toggle">
        <span>{isLoginPage ? "이미 회원이신가요?" : "처음이신가요?"}</span>
        <button onClick={toggleAuthPage}>
          {isLoginPage ? "회원가입" : "로그인"}
        </button>
      </div>

      {isLoginPage && <AuthSocialLogin />}
    </>
  );
};

export default Auth;
