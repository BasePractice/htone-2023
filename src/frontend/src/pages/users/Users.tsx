import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import {ERolesDesc} from '../../app/router/enums';
import {useAppSelector} from '../../app/store/store';
import {colors, theme} from '../../app/themes/customTheme';
import ModalComponent from '../../common/modal/ModalComponent';
import {generalMuiColumnSettings} from '../../common/table/constants';
import TableNoRowsOverlay from '../../common/table/TableNoRowsOverlay';
import {useLazyGetCompanyQuery} from '../companies/companiesApiSlice';
import CompanyCardComponent from '../companies/components/CompanyCardComponent';
import {ICompany} from '../companies/types';
import {getLeadingRole} from './helpers';
import {useLazyGetUsersListQuery} from './userApiSlice';

function Users() {
    const [openModal, setOpenModal] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);
    const {access_token} = useAppSelector(state => state.authSession);
    const {leading_role} = useAppSelector(state => state.user);
    const usersList = useAppSelector(state => state.usersList.list);
    const [getUsersList] = useLazyGetUsersListQuery();
    const [getCompany] = useLazyGetCompanyQuery();

    useEffect(() => {
        if (leading_role && access_token)
            (async () => {
                await getUsersList(access_token).unwrap();
            })();
    },[access_token, leading_role]);

    /**
     * Открытие модального окна для просмотра данных компании
     *
     * @param id идентификатор компании
     */
    const openCompany = async (id: string) => {
        const company = access_token && await getCompany({
            id,
            token: access_token
        }).unwrap();

        if (company) {
            setCurrentCompany(company);
            setOpenModal(true);
        }
    };

    /**
     * Отрисовка ячейки таблицы с компанией
     *
     * @param row Строка таблицы.
     */
    const renderCellCompany = ({row}: GridRenderCellParams) => {
        if (row.companies && row.companies.length)
            return (
                <Button variant="text" onClick={() => openCompany(row.companies[0].id)} sx={{
                    backgroundColor: colors.red
                }}>{row.companies[0]?.name}</Button>
            );
        return (<></>);
    };

    /**
     * Описание колонок таблицы
     */
    const columns: GridColDef[] = [
        {
            field: 'lastName',
            headerName: 'Фамилия',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.last_name,
            ...generalMuiColumnSettings
        },
        {
            field: 'firstName',
            headerName: 'Имя',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.first_name,
            ...generalMuiColumnSettings
        },
        {
            field: 'middleName',
            headerName: 'Отчество',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.mid_name,
            ...generalMuiColumnSettings
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.email,
            ...generalMuiColumnSettings
        },
        {
            field: 'phone',
            headerName: 'Телефон',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.phone,
            ...generalMuiColumnSettings
        },
        {
            field: 'type',
            headerName: 'Тип',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => ERolesDesc[getLeadingRole(row.roles)],
            ...generalMuiColumnSettings
        },
        /*{
            field: 'company',
            headerName: 'Компания',
            flex: 1,
            renderCell: renderCellCompany,
            ...generalMuiColumnSettings
        },*/
    ];

    return (
        <>
            <Typography variant="h5" sx={{
                my: 3,
                color: colors.white,
                [theme.breakpoints.down(769)]: {
                    fontSize: '24px',
                },
            }}>
                Список пользователей
            </Typography>
            <Card sx={{
                display: 'block',
                p: '24px',
                mb: '100px',
                [theme.breakpoints.down(769)]: {
                    padding: '10px'
                }
            }}>
                <DataGrid
                    loading={!usersList.length}
                    autoHeight
                    sx={{
                        padding: '0px 16px',
                        border: 'none',
                        [theme.breakpoints.down(769)]: {
                            padding: '4px'
                        }
                    }}
                    rowSelection={false}
                    rows={usersList || []}
                    rowSpacingType={'border'}
                    columns={columns}
                    hideFooter
                    getRowId={(row) => row.id}
                    slots={{
                        noRowsOverlay: () => <TableNoRowsOverlay/>,
                    }}
                />
            </Card>
            <ModalComponent open={openModal} size="large">
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(false)}
                    sx={{
                        minWidth: 'unset',
                        p: 1,
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        position: 'absolute',
                        top: 40,
                        right: 33,
                        bgcolor: colors.blue2,
                        '&:hover': {
                            bgcolor: colors.blue2_2
                        },
                        [theme.breakpoints.down(769)]: {
                            top: 40,
                            right: 20,
                            width: '40px',
                            height: '40px',
                            bgcolor: 'unset',
                            '&:hover': {
                                bgcolor: 'unset'
                            },
                        }
                    }}
                >

                    <Tooltip title="Закрыть">
                        <CloseIcon sx={{
                            color: colors.white3,
                            width: 20,
                            height: 20,
                            [theme.breakpoints.down(769)]: {
                                width: '40px',
                                height: '40px'
                            }
                        }}/>
                    </Tooltip>
                </Button>
                <CompanyCardComponent data={currentCompany} setOpenModal={setOpenModal} isEdit={!!leading_role}/>
            </ModalComponent>
        </>
    );
}

export default Users;
