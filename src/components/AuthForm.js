import { useState, useEffect, useRef } from "react";
import { authService } from "fbase";

function AuthForm({ isNewAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [error, setError] = useState("");

  const passwordInputRef = useRef(null);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setIsEmailValid(false);
    setIsPasswordValid(false);
    setError("");
  }, [isNewAccount]);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (name === "email") {
      setIsEmailValid(emailRegex.test(value) ? true : false);
      setEmail(value);
    } else if (name === "password") {
      setIsPasswordValid(value.length >= 6 ? true : false);
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isNewAccount) {
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
      setPassword("");
      setIsPasswordValid(false);
      passwordInputRef.current.focus();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="auth-input-group">
          <input
            type="email"
            name="email"
            id="email"
            className="auth-input"
            placeholder="이메일 주소"
            value={email}
            onChange={onChange}
            required
          />
          <label htmlFor="email" className="auth-label">
            이메일
          </label>
        </div>
        <div className="auth-input-group">
          <input
            type="password"
            name="password"
            id="password"
            className="auth-input"
            placeholder="비밀번호"
            value={password}
            minLength={6}
            onChange={onChange}
            required
            ref={passwordInputRef}
          />
          <label htmlFor="password" className="auth-label">
            비밀번호
          </label>
        </div>
        {error && <div className="auth-error-msg">{error}</div>}
        <button
          type="submit"
          className="auth-submit"
          disabled={!isEmailValid || !isPasswordValid}
        >
          {isNewAccount ? "가입" : "로그인"}
        </button>
      </form>
    </>
  );
}

export default AuthForm;
