import { createDomain } from 'effector';
import { NavigateFunction } from 'react-router-dom';
import { always } from 'ramda';
import { createGate } from 'effector-react';

export const coreD = createDomain();

export const NavigateG = createGate<NavigateState>({
    domain: coreD,
    defaultState: {
        navigate: always(void 0)
    }
});

export const navigate_e = coreD.createEvent<string>();

export type NavigateState = {
    navigate: NavigateFunction;
}
