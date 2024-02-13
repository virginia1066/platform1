import { get_student } from '../utils/request_mk';
import { info, warn } from '../utils/log';

export const make_auth_link_daemon = () => {

    // const add_email = (student_info: GetStudentResponse) => {
    //     if (student_info.email) {
    //         info(`Email already exist!`);
    //         return Promise.resolve(student_info);
    //     }
    //     const email = generate_email(student_info.id);
    //     info(`Generated email! ${email}`);
    //
    //     return update_student(student_info.id, {
    //         name: student_info.name,
    //         email
    //     });
    // };
    // const make_auth_link = (class_user_id: number) => {
    //     info(`Add auth link for user ${class_user_id}`);
    //     return get_student({ student_id: class_user_id })
    //         .then(add_email)
    //         .then(() => {
    //
    //         });
    // };
    //
    // MESSAGE_BUS.on('user_create', ({ class_id }) => make_auth_link(class_id));
    //
    // knex('users_from_webhook')
    //     .select('class_id')
    //     .where({ attribute_status: WebhookUserStatus.Pending })
    //     .then(map(pipe(prop('class_id'), make_auth_link)));

    Promise.all([
        get_student({ student_id: 5012122 })
            .then(info, warn),
        get_student({ student_id: 5014450 })
            .then(info, warn),
        get_student({ student_id: 5014621 })
            .then(info, warn)
    ]);


};