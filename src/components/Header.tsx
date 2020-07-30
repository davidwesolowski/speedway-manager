import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';
import { FaUserCircle } from 'react-icons/fa';

const Header: FunctionComponent = () => {
	return (
		<AppBar position="sticky" className="header">
			<Toolbar className="header__toolbar">
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
					<li className="header__item">
						<Link to="/konto" className="header__link">
							Konto
						</Link>
					</li>
				</ul>
				<Link to="/login" className="header__link header__login">
					<div>Zaloguj</div>
					<FaUserCircle />
				</Link>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
