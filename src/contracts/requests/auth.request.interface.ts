export interface IBasicAuthRequest {
	email: string;
	password: string;
}

export interface IRegisterAuthRequest extends IBasicAuthRequest {
	username: string;
	name: string;
	bio?: string;
}
