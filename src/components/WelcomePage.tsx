import React, { FunctionComponent, useEffect } from 'react';
import { FaCoins } from 'react-icons/fa';
import { BsBarChartFill, BsTrophy } from 'react-icons/bs';

const WelcomePage: FunctionComponent = () => {
	useEffect(() => {
		setTimeout(() => {
			document.body.style.overflowY = 'auto';
		}, 500);
	}, []);

	return (
		<main className="welcome-box">
			<div className="welcome-box__img"></div>
			<section className="welcome-box__head">
				<div className="welcome-box__logo">Żużlowa liga fantasy</div>
				<h2 className="heading-2">
					Stwórz swoją wymarzoną drużynę i wygraj ligę!
				</h2>
			</section>
			<section className="welcome-box__preview">
				<div className="welcome-box__card">
					<FaCoins className="welcome-box__icon welcome-box__icon-1" />
					<h2 className="heading-2 welcome-box__text">
						Typuj i wygrywaj!
					</h2>
					<p className="welcome-box__description">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed placerat mauris egestas hendrerit maximus. Morbi
						hendrerit tincidunt nisi ac placerat. Nam ac eleifend
						justo, vitae luctus ante. Quisque id pretium metus. Duis
						id magna interdum, condimentum erat non, fringilla quam.
						Morbi lacus sapien, iaculis ac lacus at, malesuada
						maximus orci. Phasellus vitae consectetur diam, sit amet
						sollicitudin nibh. Sed vitae lorem mattis, tristique est
						at, euismod purus. Nam suscipit tincidunt sapien, sit
						amet aliquet diam congue nec. Phasellus ut tincidunt
						neque.
					</p>
				</div>
				<div className="welcome-box__card">
					<BsBarChartFill className="welcome-box__icon welcome-box__icon-2" />
					<h2 className="heading-2 welcome-box__text">
						Rywalizuj z innymi!
					</h2>
					<p className="welcome-box__description">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed placerat mauris egestas hendrerit maximus. Morbi
						hendrerit tincidunt nisi ac placerat. Nam ac eleifend
						justo, vitae luctus ante. Quisque id pretium metus. Duis
						id magna interdum, condimentum erat non, fringilla quam.
						Morbi lacus sapien, iaculis ac lacus at, malesuada
						maximus orci. Phasellus vitae consectetur diam, sit amet
						sollicitudin nibh. Sed vitae lorem mattis, tristique est
						at, euismod purus. Nam suscipit tincidunt sapien, sit
						amet aliquet diam congue nec. Phasellus ut tincidunt
						neque.
					</p>
				</div>
				<div className="welcome-box__card">
					<BsTrophy className="welcome-box__icon welcome-box__icon-3" />
					<h2 className="heading-2 welcome-box__text">
						Śledź wyniki!
					</h2>
					<p className="welcome-box__description">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed placerat mauris egestas hendrerit maximus. Morbi
						hendrerit tincidunt nisi ac placerat. Nam ac eleifend
						justo, vitae luctus ante. Quisque id pretium metus. Duis
						id magna interdum, condimentum erat non, fringilla quam.
						Morbi lacus sapien, iaculis ac lacus at, malesuada
						maximus orci. Phasellus vitae consectetur diam, sit amet
						sollicitudin nibh. Sed vitae lorem mattis, tristique est
						at, euismod purus. Nam suscipit tincidunt sapien, sit
						amet aliquet diam congue nec. Phasellus ut tincidunt
						neque.
					</p>
				</div>
			</section>
		</main>
	);
};

export default WelcomePage;
