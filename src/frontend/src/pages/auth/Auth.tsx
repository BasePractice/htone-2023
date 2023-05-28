import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import isEmpty from 'lodash/isEmpty';
import * as queryString from 'query-string';
import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/store/store';
import ModalComponent from '../../common/modal/ModalComponent';
import {getQuerySearch} from '../../common/utils/apiUtils';
import {parseJWT, sendForAuthorization} from '../../common/utils/authUtils';
import {IAnyObject} from '../platforms/types';
import {getLeadingRole} from '../users/helpers';
import {useLazyGetUserQuery} from '../users/userApiSlice';
import {setUserLeadingRole} from '../users/userSlice';
import {useLazyGetTokenQuery} from './authApiSlice';
import {setSessionFromPage} from './authSlice';

/**
 * Копонент авторизации через keycloak
 * @constructor
 */
function Auth() {
    const [getToken, {
        isSuccess,
        isError,
        isLoading
    }] = useLazyGetTokenQuery();
    const [getUser] = useLazyGetUserQuery();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {local_state, from_page} = useAppSelector(state => state.authSession);

    useEffect(() => {
        (async () => {
            if (location) {
                const rawParams = queryString.parse(location.search);
                const state = rawParams.state as string;
                const code = rawParams.code as string;
                //если пришёл code
                if (!isEmpty(code) && state === local_state) {
                    const data: IAnyObject = {
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: `${process.env.REACT_APP_AUTH_REDIRECT_URL}${process.env.REACT_APP_AUTH_REDIRECT_URL_PATH}`,
                    };
                    const authSession = await getToken(getQuerySearch(data, {
                        questionMark: false
                    })).unwrap();
                    if (authSession && authSession.access_token) {
                        const data = parseJWT(authSession.access_token);
                        console.log(data);
                        // список ролей из токена
                        const roles = data.resource_access[data.azp].roles.map((item: string) => ({
                            name: item
                        }));
                        getUser(authSession.access_token);
                        dispatch(setUserLeadingRole(getLeadingRole(roles)));
                    }
                } else {
                    // сохраняем адрес, который пытались открыть
                    const fromPage = location.state?.from?.pathname || '/';
                    dispatch(setSessionFromPage(fromPage));
                    sendForAuthorization(local_state);
                }
            }
        })();
    }, []);

    useEffect(() => {
        // произвести навигацию по адресу from_page сохранённом в хранилище
        if (isSuccess) {
            console.log('переход', from_page);
            navigate(from_page, {
                replace: true
            });
        }
    }, [isSuccess]);

    return (
        <ModalComponent open={true} size="small">
            <Box sx={{
                textAlign: 'center'
            }}>
                <Typography>
                    {isLoading ?
                        'Выполняется авторизация' :
                        isError ?
                            'Произошла ошибка, попробуйте ещё раз' :
                            'Загрузка'}
                </Typography>
                {isError &&
                <Button
                    variant="outlined"
                    sx={{
                        mt: 2
                    }}
                    onClick={() => navigate('/')} >назад</Button>
                }
            </Box>
        </ModalComponent>
    );
}

export default Auth;
