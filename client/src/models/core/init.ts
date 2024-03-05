import { sample } from 'effector';
import { navigate_e, NavigateG } from './dictionary';

sample({
    clock: navigate_e,
    source: NavigateG.state,
    fn: ({ navigate }, url) => {
        navigate(url);
    }
});
