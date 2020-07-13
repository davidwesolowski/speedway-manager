import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header className="header">
			<div className="header__logo">LOGO</div>
			<ul className="header__nav">
				<li className="header__item">
					<Link to="/" className="header__link">
						Start
					</Link>
				</li>
				<li className="header__item">
					<Link to="/" className="header__link">
						Ranking Ekstraligi
					</Link>
				</li>
				<li className="header__item">
					<Link to="/" className="header__link">
						Wyniki meczów
					</Link>
				</li>
			</ul>
			<Link to="/login" className="header__link header__login">
				Zaloguj
			</Link>
		</header>
	);
};

export default Header;
