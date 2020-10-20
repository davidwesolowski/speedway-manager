import React, { FunctionComponent, useEffect } from 'react';
import { FaCoins } from 'react-icons/fa';
import { BsBarChartFill, BsTrophy } from 'react-icons/bs';
import { checkCookies } from '../utils/checkCookies';
import fetchUserData from '../utils/fetchUserData';
import { useStateValue } from './AppProvider';
import { useHistory } from 'react-router-dom';

const WelcomePage: FunctionComponent = () => {
	const { dispatchUserData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	useEffect(() => {
		if (checkCookies()) {
			fetchUserData(dispatchUserData, setLoggedIn, push);
		}
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
						Kontraktuj ulubionych zawodników
					</h2>
					<p className="welcome-box__description">
						Myślisz, że posiadzasz predyspozycje do pracy jako menedżer klubu żużlowego?
						Uważasz, że potrafisz perfekcyjnie przewidywać rozstrzygnięcia w najlepszych ligach żużlowych?
						Masz niepowtarzalną okazję sprawdzić swoje umiejętności.
						Stwórz swój własny, wymarzony klub i umieść w nim najlepszych zawodników ligi,
						takich jak Zmarzlik, Sayfutdinov czy Laguta. Zarządzaj kadrą, ustalaj skład meczowy,
						zdobywaj punkty za wyniki swoich zawodników w rzeczywistości i osiągaj
						sukcesy jako kapitan za sterami swojej drużyny!
					</p>
				</div>
				<div className="welcome-box__card">
					<BsBarChartFill className="welcome-box__icon welcome-box__icon-2" />
					<h2 className="heading-2 welcome-box__text">
						Rywalizuj z innymi!
					</h2>
					<p className="welcome-box__description">
						Wydaje Ci się, że masz najlepszego "nosa" i potrafisz wybrać najlepszych zawodników?
						Porównaj swoje zdolności przewidywania z innymi graczami. Sprawdź swoje miejsce w rankingu
						z pozostałymi fanatykami czarnego sportu, twórz własne rankingi do rywalizacji ze znajomymi 
						i walcz o miano najlepszego wirtualnego menedżera żużlowego!
					</p>
				</div>
				<div className="welcome-box__card">
					<BsTrophy className="welcome-box__icon welcome-box__icon-3" />
					<h2 className="heading-2 welcome-box__text">
						Śledź wyniki!
					</h2>
					<p className="welcome-box__description">
						Interesują Cię dokładne wyniki każdego meczu Twojej ulubionej ligi?
						Żaden problem! Skorzystaj z naszej aplikacji i przeglądaj wyniki meczów ligi żużlowej.
						Sprawdzaj rezultaty swoich ulubionych zawodników i analizuj postępy potencjalnych przyszłych
						zawodników swojego zespołu!
					</p>
				</div>
			</section>
		</main>
	);
};

export default WelcomePage;
