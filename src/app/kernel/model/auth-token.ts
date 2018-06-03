import { User } from './user';

export class AuthToken {
    public id: number;

    constructor ( 
        public value: string,
        public createdDate: Date,
        public user: User
    ) {}
}