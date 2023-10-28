import styled, { keyframes } from "styled-components";

function Loader() {
  return (
    <Wrapper>
      <Logo
        alt="트위터 로고"
        src={process.env.PUBLIC_URL + "/favicon.ico"}
      ></Logo>
      <Title>사용자 정보를 불러오는 중</Title>
    </Wrapper>
  );
}

export default Loader;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;

const boom = keyframes`
 0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale(0.9);
  }
`;

const Logo = styled.img`
  animation: ${boom} 1s ease-in-out infinite;
`;

const Title = styled.h1`
  margin-top: 20px;
  font-size: var(--fs-basic);
  text-align: center;
`;
