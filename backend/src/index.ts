import { create_users } from './db/create_users';
import { create_tokens } from './db/create_tokens';
import { create_tg_users } from './db/create_tg_users';
import { create_wokobular_tables } from './db/create_wokobular_tables';
import { make_auth_link_daemon } from './daemons/make_auth_link_daemon';
import { pipe } from 'ramda';
import { create_server } from './server/create_server';
import { launch_tg_service } from './telegram/launch_tg_service';
import { google_words_daemon } from './daemons/google_words_daemon';

create_users()
    .then(() =>
        Promise.all([
            create_users(),
            create_tokens(),
            create_tg_users(),
            create_wokobular_tables()
        ]))
    .then(pipe(
        make_auth_link_daemon,
        google_words_daemon
    ))
    .then(pipe(
        create_server,
        launch_tg_service
    ));