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
	MenuItem,
	Hidden,
	Divider,
	List,
	ListItem,
	Drawer,
	ListItemText
} from '@material-ui/core';
import { FaUserCircle } from 'react-icons/fa';
import { AppContext } from './AppProvider';
import Cookies from 'universal-cookie';
import { FiChevronLeft, FiMenu } from 'react-icons/fi';

const unauthorizedMenuItems = [
	{
		link: '/',
		name: 'Start',
		icon: ''
	},
	{
		link: '/mecze',
		name: 'Wyniki',
		icon: ''
	},
	{
		link: '/samouczek',
		name: 'Samouczek',
		icon: ''
	},
	{
		link: '/kluby',
		name: 'Kluby',
		icon: ''
	}
];

const authorizedMenuItems = [
	{
		link: '/',
		name: 'Start',
		icon: ''
	},
	{
		link: '/mecze',
		name: 'Wyniki',
		icon: ''
	},
	{
		link: '/druzyna',
		name: 'Drużyna',
		icon: ''
	},
	{
		link: '/ranking',
		name: 'Ranking',
		icon: ''
	},
	{
		link: '/uzytkownicy',
		name: 'Użytkownicy',
		icon: ''
	},
	{
		link: '/zawodnicy',
		name: 'Zawodnicy',
		icon: ''
	},
	{
		link: '/kluby',
		name: 'Kluby',
		icon: ''
	},
	{
		link: '/samouczek',
		name: 'Samouczek',
		icon: ''
	}
];

const Header: FunctionComponent = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { push } = useHistory();
	const { userData, loggedIn, setLoggedIn } = useContext(AppContext);
	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => setAnchorEl(null);
	const handleLogout = () => {
		const cookies = new Cookies();
		cookies.remove('accessToken');
		setLoggedIn(false);
		push('/login');
	};

	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	const unauthorized = (
		<Hidden xsDown>
			<ul className="header__nav">
				{unauthorizedMenuItems.map(({ link, name }) => (
					<li className="header__item" key={link}>
						<Link to={link} className="header__link">
							{name}
						</Link>
					</li>
				))}
			</ul>
		</Hidden>
	);

	const authorized = (
		<Hidden smDown>
			<ul className="header__nav">
				{authorizedMenuItems.map(({ link, name }) => (
					<li className="header__item" key={link}>
						<Link to={link} className="header__link">
							{name}
						</Link>
					</li>
				))}
			</ul>
		</Hidden>
	);

	const drawer = (
		<div>
			<div className="header__drawerClose">
				<IconButton onClick={handleDrawerToggle}>
					<FiChevronLeft className="header__drawerCloseIcon" />
				</IconButton>
			</div>
			<Divider />
			<List>
				{loggedIn
					? authorizedMenuItems.map(({ link, name }) => (
							<ListItem
								key={link}
								divider
								button
								onClick={() => setMobileOpen(false)}
							>
								<Link to={link} className="header__mobileLink">
									{name}
								</Link>
							</ListItem>
					  ))
					: unauthorizedMenuItems.map(({ link, name }) => (
							<ListItem
								key={link}
								divider
								button
								onClick={() => setMobileOpen(false)}
							>
								<Link to={link} className="header__mobileLink">
									{name}
								</Link>
							</ListItem>
					  ))}
			</List>
		</div>
	);

	return (
		<>
			<AppBar position="sticky" className="header">
				<Toolbar className="header__toolbar">
					<Hidden mdUp={loggedIn} smUp={!loggedIn}>
						<IconButton onClick={handleDrawerToggle}>
							<FiMenu className="header__mobileIcon" />
						</IconButton>
					</Hidden>
					<Hidden mdDown={loggedIn} smDown={!loggedIn}>
						<div className="header__logo">
							<Link to="/">
								<img src='img/logo41.png' className="header__logo-img"/>
							</Link>
						</div>
					</Hidden>
					<Hidden lgUp={loggedIn} smDown={loggedIn} xsUp={!loggedIn}>
						<div className="header__logo-bike">
							<Link to="/">
								<img src='img/motologo.png' className="header__logo-bike-img"/>
							</Link>
						</div>
					</Hidden>
					{loggedIn ? (
						<>
							{authorized}
							<IconButton onClick={handleProfileMenuOpen}>
								<Avatar
									alt="user-avatar"
									className="header__avatar"
									src={userData.avatarUrl}
								/>
								<span className="header__username">
									{userData.username}
								</span>
							</IconButton>
						</>
					) : (
						<>
							{unauthorized}
							<Link
								to="/login"
								className="header__link header__login"
							>
								<div>Zaloguj</div>
								<FaUserCircle />
							</Link>
						</>
					)}
				</Toolbar>
			</AppBar>
			<Hidden mdUp={loggedIn} smUp={!loggedIn}>
				<Drawer
					anchor="left"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
				>
					{drawer}
				</Drawer>
			</Hidden>
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
				<MenuItem>
					<Link to="/znajomi" className="header__menu-item">
						Znajomi
					</Link>
				</MenuItem>
				<MenuItem>
					<Link to="/samouczek" className="header__menu-item">
						Samouczek
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
