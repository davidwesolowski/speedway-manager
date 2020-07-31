import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import addNotification from './addNotification';

export interface IImageData {
	name: string;
	imageBuffer: string | ArrayBuffer | null;
	imageUrl: string | ArrayBuffer | null;
}

export const defaultImageData: IImageData = {
	name: '',
	imageBuffer: '',
	imageUrl: ''
};

const handleImgFile = (setState: Dispatch<SetStateAction<IImageData>>) => (
	event: ChangeEvent<HTMLInputElement>
): void => {
	if (event.target.files && event.target.files[0]) {
		const image = event.target.files[0];
		const { name, size } = image;
		if (size <= 1048576) {
			const imageBufferReader = new FileReader();
			const imageUrlReader = new FileReader();
			imageBufferReader.onload = () => {
				imageBufferReader.result;
				setState({
					name,
					imageBuffer: imageBufferReader.result,
					imageUrl: ''
				});
			};
			imageBufferReader.readAsArrayBuffer(image);
			imageUrlReader.onload = () => {
				const imageUrl = imageUrlReader.result;
				setState((prevState: IImageData) => ({
					...prevState,
					imageUrl
				}));
			};
			imageUrlReader.readAsDataURL(image);
		} else {
			event.target.value = '';
			const title = 'Informacja!';
			const message = 'Maksymalny rozmiar awataru to 1MB!';
			const type = 'info';
			const duration = 3000;
			addNotification(title, message, type, duration);
		}
	}
};
export default handleImgFile;
