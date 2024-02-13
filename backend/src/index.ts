import { create_users } from './db/create_users';
import { create_server } from './server/create_server';
import { create_tokens } from './db/create_tokens';
import { make_auth_link_daemon } from './daemons/make_auth_link_daemon';

create_users()
    .then(() =>
        Promise.all([
            create_users(),
            create_tokens()
        ]))
    .then(make_auth_link_daemon)
    .then(create_server);