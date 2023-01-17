import { NavLink } from "react-router-dom";
import { authService } from "fbase";

function Navigation() {
  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if (ok) {
      authService.signOut();
    }
  };

  return (
    <nav className="nav">
      <ul>
        <li className="nav-left">
          <NavLink
            exact
            to="/"
            title="홈으로 이동"
            activeClassName="nav-active"
          >
            <i className="fa-brands fa-twitter"></i>
          </NavLink>
        </li>
        <li className="nav-right">
          <NavLink
            to="/profile"
            title="프로필로 이동"
            activeClassName="nav-active"
          >
            <i className="fa-solid fa-user"></i>
          </NavLink>
          <a onClick={onLogOutClick} title="로그아웃">
            <i className="fa-solid fa-right-from-bracket"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
