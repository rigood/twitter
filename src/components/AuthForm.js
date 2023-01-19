import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { authService } from "fbase";

function AuthForm({ isLoginPage }) {
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
  }, [isLoginPage]);

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
      if (isLoginPage) {
        await authService.signInWithEmailAndPassword(email, password);
      } else {
        await authService.createUserWithEmailAndPassword(email, password);
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
      <Form onSubmit={onSubmit}>
        <InputGroup>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="이메일 주소"
            value={email}
            onChange={onChange}
            required
          />
          <Label htmlFor="email">이메일</Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="비밀번호"
            value={password}
            onChange={onChange}
            required
            minLength={6}
            ref={passwordInputRef}
          />
          <Label htmlFor="password">비밀번호</Label>
        </InputGroup>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <SubmitButton
          type="submit"
          disabled={!isEmailValid || !isPasswordValid}
        >
          {isLoginPage ? "로그인" : "가입"}
        </SubmitButton>
      </Form>
    </>
  );
}

export default AuthForm;

const Form = styled.form`
  width: 85%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: 30px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const Input = styled.input`
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  padding: 15px;
  font-size: var(--fs-basic);
  font-weight: 700;

  &::placeholder {
    color: var(--sub-text-color);
    font-size: var(--fs-basic);
    font-weight: 400;
  }

  &:focus {
    outline: 2px solid var(--main-color);
  }

  &:focus + ${Label} {
    color: var(--main-color);
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const ErrorMsg = styled.div`
  margin-bottom: 30px;
  color: var(--error-msg-color);
`;

const SubmitButton = styled.button`
  cursor: pointer;
  margin-bottom: 30px;
  padding: 15px;
  border-radius: var(--radius-lg);
  background-color: var(--main-color);
  color: white;
  font-size: var(--fs-button);
  font-weight: 700;

  &:disabled {
    opacity: 0.3;
  }
`;
