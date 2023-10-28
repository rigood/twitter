import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import { authService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Navigation() {
  const history = useHistory();

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if (ok) {
      authService.signOut();
      history.push("/");
    }
  };

  return (
    <Nav>
      <Wrapper>
        <Left>
          <NavItemLink
            exact
            to="/"
            title="홈으로 이동"
            activeClassName="nav-active"
          >
            <Icon icon={faTwitter} />
          </NavItemLink>
        </Left>
        <Right>
          <NavItemLink
            to="/profile"
            title="프로필로 이동"
            activeClassName="nav-active"
          >
            <Icon icon={faUser} />
          </NavItemLink>
          <NavItemButton onClick={onLogOutClick} title="로그아웃">
            <Icon icon={faRightFromBracket} />
          </NavItemButton>
        </Right>
      </Wrapper>
    </Nav>
  );
}

export default Navigation;

const Nav = styled.nav`
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--inner-bg-color);
  border-bottom: 1px solid var(--border-color);
`;

const Wrapper = styled.ul`
  height: 100%;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.li``;

const Right = styled.li`
  display: flex;
  align-items: center;
  a,
  button {
    margin-left: 15px;
  }
`;

const NavItemLink = styled(NavLink)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.nav-active {
    background-color: var(--sub-color);
  }
`;

const NavItemButton = styled.button``;

const Icon = styled(FontAwesomeIcon)`
  color: var(--main-color);
  font-size: var(--fs-button);
`;
