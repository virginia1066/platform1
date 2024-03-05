import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGate } from 'effector-react';
import { NavigateG } from '../models/core';

export const Navigate = <T, >(Component: FC<T>): FC<T> => (props) => {
    // eslint-disable-next-line
    const navigate = useNavigate();
    // eslint-disable-next-line
    useGate(NavigateG, { navigate });

    return <Component {...props as any} />;
};