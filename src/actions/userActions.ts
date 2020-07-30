import { UPDATE_USER, SET_USER } from './actionDefinitions';

export interface IUser {
	email?: string;
	username?: string;
	avatar_url?: string | null | undefined;
}

export interface UserAction {
	type: string;
	payload: IUser;
}

export const setUser = (user: IUser): UserAction => ({
	type: SET_USER,
	payload: user
});

export const updateUser = (user: IUser): UserAction => ({
	type: UPDATE_USER,
	payload: user
});