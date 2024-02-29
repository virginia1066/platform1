import { knex, SYSTEM_PACK_ID } from '../../constants';
import { head } from 'ramda';
import { Pack, PackStatus } from '../../types/Wokobular';
import { info } from '../../utils/log';

export const get_or_create_pack = ({ name, parent_user_id, user_can_edit, insert_id }: Props): Promise<Pack> =>
    knex('packs')
        .select('*')
        .where({
            name,
            parent_user_id,
            status: PackStatus.Active,
        })
        .then<Pack | undefined>(head)
        .then((pack) => {
            if (!pack) {
                info(`Detect new system pack! Create pack.`);
                return knex('packs')
                    .insert({
                        name,
                        parent_user_id,
                        status: PackStatus.Active,
                        user_can_edit,
                        insert_id
                    })
                    .returning('*')
                    .then<Pack>(head);
            }
            return pack;
        });

type Props = {
    name: string;
    parent_user_id: number;
    user_can_edit: boolean;
    insert_id: string;
}
