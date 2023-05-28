import {Navigate, Outlet} from 'react-router-dom';
import {useAppSelector} from '../../app/store/store';

/**
 * Компонент (обертка) при навигации проверяет наличие токена доступа пользователя.
 * При условии, что сессия активна, возвращает запрашиваемый route,
 * в случае если сессия не активна, отправляет на страницу логина.
 */
function RequireSessionLayout() {
    const {access_token} = useAppSelector(state => state.authSession);

    return (
        access_token ?
            <Outlet /> :
            <Navigate to="/auth" state={{
                from: location
            }} replace />
    );
}

export default RequireSessionLayout;
