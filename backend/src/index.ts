import { create_users } from './db/create_users';
import { create_server } from './server/create_server';

create_users()
    .then(create_server);