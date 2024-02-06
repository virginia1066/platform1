declare module 'knex/types/tables' {
    import { User } from 'types/general';

    interface Tables {
        users: User;
    }

}