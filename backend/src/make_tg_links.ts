import { make_auth_link_daemon } from './daemons/make_auth_link_daemon';
import { get_student_list } from './utils/request_mk';
import { make_link_params } from './utils/make_link_params';

make_auth_link_daemon();

const loop = (offset: number) => {
    get_student_list({
        offset,
        limit: 50,
        sort: 'createdAt',
        sortDirection: 'asc'
    }).then(({ users }) => {
        if (!users.length) {
            process.exit(0);
        }
        const to_make_params = users.map(i => ({ userId: i.id }));

        return make_link_params({ users: to_make_params })
            .then(() => {
                if (users.length < 50) {
                    process.exit(0);
                }
                loop(offset + users.length);
            });
    });
};

loop(0);
