import { knex, SYSTEM_PACK_ID } from '../../constants';
import { head } from 'ramda';
import { Pack, PackStatus } from '../../types/Wokobular';
import { info } from '../../utils/log';

export const get_or_create_pack = (name: string): Promise<Pack> =>
    knex('packs')
        .select('*')
        .where({
            name,
            parent_user_id: SYSTEM_PACK_ID,
            status: PackStatus.Active,
        })
        .then<Pack | undefined>(head)
        .then((pack) => {
            if (!pack) {
                info(`Detect new system pack! Create pack.`);
                return knex('packs')
                    .insert({
                        name,
                        parent_user_id: SYSTEM_PACK_ID,
                        status: PackStatus.Active,
                        user_can_edit: false
                    })
                    .returning('*')
                    .then<Pack>(head);
            }
            return pack;
        });