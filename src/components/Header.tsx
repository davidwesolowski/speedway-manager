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
import checkAdminRole from '../utils/checkAdminRole';

const unauthorizedMenuItems = [
	{
		link: '/',
		name: 'Start'
	},
	{
		link: '/mecze',
		name: 'Wyniki'
	},
	{
		link: '/samouczek',
		name: 'Samouczek'
	},
	{
		link: '/kluby',
		name: 'Kluby'
	}
];

const authorizedMenuItems = [
	{
		link: '/',
		name: 'Start'
	},
	{
		link: '/mecze',
		name: 'Wyniki'
	},
	{
		link: '/druzyna',
		name: 'Drużyna'
	},
	{
		link: '/ranking',
		name: 'Ranking'
	},
	{
		link: '/uzytkownicy',
		name: 'Użytkownicy'
	},
	{
		link: '/zawodnicy',
		name: 'Zawodnicy'
	},
	{
		link: '/kluby',
		name: 'Kluby'
	},
	{
		link: '/samouczek',
		name: 'Samouczek'
	}
];

const adminMenuItems = [
	...authorizedMenuItems,
	{
		link: '/konto',
		name: 'Konto'
	},
	{
		link: '/dodaj-druzyna',
		name: 'Dodaj zawodników do drużyny'
	},
	{
		link: '/dodaj-mecz',
		name: 'Dodaj mecz'
	},
	{
		link: '/znajomi',
		name: 'Znajomi'
	},
	{
		link: '/ligi',
		name: 'Ligi'
	},
	{
		link: '/moje-ligi',
		name: 'Moje ligi'
	},
	{
		link: '/historia',
		name: 'Historia'
	}
];

const Header: FunctionComponent = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { push } = useHistory();
	const { userData, loggedIn, setLoggedIn } = useContext(AppContext);
	const isMenuOpen = Boolean(anchorEl);
	const isAdmin = checkAdminRole(userData.role) && loggedIn;

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

	const adminHeader = (
		<ul className="header__nav">
			<li className="header__item" onClick={handleDrawerToggle}>
				<span className="header__link header__link-admin">
					Panel administratora
				</span>
			</li>
		</ul>
	);

	const menuItemsList = (menuItems: { name: string; link: string }[]) =>
		menuItems.map(({ link, name }, index) => (
			<ListItem
				key={link}
				divider={index + 1 == menuItems.length ? false : true}
				button
				onClick={() => setMobileOpen(false)}
			>
				<Link to={link} className="header__mobileLink">
					{name}
				</Link>
			</ListItem>
		));

	const drawer = (
		<div>
			<div className="header__drawerClose">
				<IconButton onClick={handleDrawerToggle}>
					<FiChevronLeft className="header__drawerCloseIcon" />
				</IconButton>
			</div>
			<Divider />
			<List>
				{isAdmin
					? menuItemsList(adminMenuItems)
					: loggedIn
					? menuItemsList(authorizedMenuItems)
					: menuItemsList(unauthorizedMenuItems)}
			</List>
		</div>
	);
	return (
		<>
			<AppBar position="sticky" className="header">
				<Toolbar className="header__toolbar">
					{!isAdmin && (
						<Hidden mdUp={loggedIn} smUp={!loggedIn}>
							<IconButton onClick={handleDrawerToggle}>
								<FiMenu className="header__mobileIcon" />
							</IconButton>
						</Hidden>
					)}
					<div className="header__logo">LOGO</div>
					{isAdmin ? (
						adminHeader
					) : loggedIn ? (
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
			{isAdmin ? (
				<Drawer
					anchor="left"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					className="adminDrawer"
				>
					{drawer}
				</Drawer>
			) : (
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
			)}
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
