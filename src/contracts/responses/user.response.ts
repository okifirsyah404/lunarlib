import { IAccountEntity } from '@contract/entities/users/account.entity.interface';
import { IUserEntity } from '@contract/entities/users/user.entity.interface';

export interface IAccountResponse extends Omit<IAccountEntity, 'password'> {}

export interface IUserResponse extends Omit<IUserEntity, 'account'> {
	account?: IAccountResponse;
}
