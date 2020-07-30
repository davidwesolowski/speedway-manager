import React, {
	FunctionComponent,
	useContext,
	useState,
	MouseEvent
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	AppBar,
	Toolbar,
	IconButton,
	Avatar,
	Menu,
	MenuItem
} from '@material-ui/core';
import { FaUserCircle } from 'react-icons/fa';
import { AppContext } from './AppProvider';
import Cookies from 'universal-cookie';

const Header: FunctionComponent = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { push } = useHistory();
	const { userData } = useContext(AppContext);
	const isMenuOpen = Boolean(anchorEl);
	const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => setAnchorEl(null);
	const handleLogout = () => {
		const cookies = new Cookies();
		cookies.remove('access_token');
		push('/login');
	};

	return (
		<>
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
					<IconButton onClick={handleProfileMenuOpen}>
						<Avatar
							alt="user-avatar"
							className="header__avatar"
							src={userData.avatar_url}
						/>
						<span className="header__username">
							{userData.username}
						</span>
					</IconButton>
				</Toolbar>
			</AppBar>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClick={handleMenuClose}
			>
				<MenuItem>
					<Link to="/konto" className="header__menu-item">
						Profil
					</Link>
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<span className="header__menu-item">Wyloguj</span>
				</MenuItem>
			</Menu>
		</>
	);
};

export default Header;
