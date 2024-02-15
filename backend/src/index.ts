import { create_users } from './db/create_users';
import { create_server } from './server/create_server';
import { create_tokens } from './db/create_tokens';
import { make_auth_link_daemon } from './daemons/make_auth_link_daemon';
import { pipe } from 'ramda';
import { launch_tg_service } from './telegram/launch_tg_service';
import { create_tg_users } from './db/create_tg_users';

create_users()
    .then(() =>
        Promise.all([
            create_users(),
            create_tokens(),
            create_tg_users()
        ]))
    .then(make_auth_link_daemon)
    .then(pipe(
        create_server,
        launch_tg_service
    ));
