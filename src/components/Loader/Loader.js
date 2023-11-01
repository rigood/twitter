import styled, { keyframes } from "styled-components";

function Loader() {
  return (
    <Wrapper>
      <Image
        alt="트위터 로고"
        src={process.env.PUBLIC_URL + "/assets/twitter.ico"}
      />
      <Text>사용자 정보를 불러오는 중</Text>
    </Wrapper>
  );
}

export default Loader;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const Image = styled.img`
  animation: ${boom} 1s ease-in-out infinite;
`;

const Text = styled.div`
  margin-top: 20px;
  font-size: var(--fs-basic);
  text-align: center;
`;
