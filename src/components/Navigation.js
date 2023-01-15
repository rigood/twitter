import { Link } from "react-router-dom";
import { authService } from "fbase";

function Navigation() {
  const onLogOutClick = (event) => {
    event.preventDefault();
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if (ok) {
      authService.signOut();
    }
  };

  return (
    <nav className="nav">
      <ul>
        <li className="nav-left">
          <Link to="/" title="홈으로 이동">
            <i className="fa-brands fa-twitter"></i>
          </Link>
        </li>
        <li className="nav-right">
          <Link to="/profile" title="프로필로 이동">
            <i className="fa-solid fa-user"></i>
          </Link>
          <Link to="/" onClick={onLogOutClick} title="로그아웃">
            <i className="fa-solid fa-right-from-bracket"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
