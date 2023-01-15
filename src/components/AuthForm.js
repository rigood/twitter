import { useState } from "react";
import { authService } from "fbase";

function AuthForm({ isNewAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
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
            onChange={onChange}
            required
          />
          <label htmlFor="password" className="auth-label">
            비밀번호
          </label>
        </div>
        {error && <div className="auth-error-msg">{error}</div>}
        <button type="submit" className="auth-submit">
          {isNewAccount ? "가입" : "로그인"}
        </button>
      </form>
    </>
  );
}

export default AuthForm;
