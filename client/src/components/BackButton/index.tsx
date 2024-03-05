import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButton: FC<{ url: string }> = ({ url }) => {
    const navigate = useNavigate();
    const goBack = useCallback(() => navigate(url), [url, navigate]);

    return (
        <Button maxW={'50px'} onClick={goBack} w={'full'} variant={'main'} size={'lg'}>
            <ChevronLeftIcon w={'40px'} h={'40px'}/>
        </Button>
    );
};