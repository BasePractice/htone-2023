import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import {EMethod} from '../../app/api/enums';
import {EReferenceBooks, ERoles} from '../../app/router/enums';
import {useAppDispatch, useAppSelector} from '../../app/store/store';
import {colors, theme} from '../../app/themes/customTheme';
import {setConfirmationAlert} from '../../common/alert/alertSlice';
import ModalComponent from '../../common/modal/ModalComponent';
import {generalMuiColumnSettings} from '../../common/table/constants';
import TableNoRowsOverlay from '../../common/table/TableNoRowsOverlay';
import {confirmationBlockingState} from '../platforms/helpers';
import {useCreateUpdateCompanyMutation, useLazyGetCompaniesQuery, useVerifyCompanyMutation} from './companiesApiSlice';
import CompanyCardComponent from './components/CompanyCardComponent';
import {ICompany} from './types';

const buttonStyle = {
    my: 2,
    mr: 1,
    minWidth: 'unset',
    p: 1,
    width: 40,
    borderRadius: 40
};

function Companies() {
    const [openModal, setOpenModal] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);
    const dispatch = useAppDispatch();
    const {access_token} = useAppSelector(state => state.authSession);
    const {leading_role} = useAppSelector(state => state.user);
    const [getCompanies] = useLazyGetCompaniesQuery();
    const [createUpdateCompany] = useCreateUpdateCompanyMutation();
    const [companiesList, setCompaniesList] = useState<ICompany[]>([]);
    const [verifyCompany] = useVerifyCompanyMutation();

    useEffect(() => {
        if (leading_role && access_token)
            (async () => {
                const response = await getCompanies({
                    role: leading_role,
                    token: access_token
                }).unwrap();
                setCompaniesList(response);
            })();
    },[access_token, leading_role]);

    /**
     * Поиск организации в списке
     *
     * @param id идентификатор организации
     */
    const getCompany = (id: string): ICompany | undefined => {
        return companiesList.find(item => item.id === id);
    };

    /**
     * Открытие модального окна для просмотра данных организации арендодателя
     *
     * @param id идентификатор организации
     */
    const openCompany = (id: string) => {
        const company = getCompany(id);
        if (company) {
            setCurrentCompany(company);
            setOpenModal(true);
        }
    };

    /**
     * Изменение активности организации
     *
     * @param id идентификатор организации в БД
     */
    const changeActiveCompany = async (id: string) => {
        const company = getCompany(id);
        if (company) {
            if (!company.verified && leading_role === ERoles.ROLE_ADMIN) {
                // подтверждение платформы
                access_token && await verifyCompany({
                    id,
                    token: access_token
                }).unwrap();
                company.activated = true;
                company.verified = true;
            } else if (company.verified && company.activated)
                dispatch(setConfirmationAlert(confirmationBlockingState(EReferenceBooks.COMPANIES, id.toString())));
            else {
                access_token && await createUpdateCompany({
                    data: {
                        ...company,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        activated: true
                    },
                    id: company.id ?? '',
                    token: access_token,
                    method: EMethod.UPDATE
                });
            }
        }
    };

    /**
     * Отрисовка ячейки таблицы с действиями
     *
     * @param row Строка таблицы.
     */
    const renderCell = ({row}: GridRenderCellParams) => {
        return (
            <>
                {((leading_role === ERoles.ROLE_LANDLORD && row.activated) ||
                    (leading_role === ERoles.ROLE_ADMIN)) && <Button
                    variant={row.activated ?
                        'contained' :
                        'outlined'}
                    onClick={() => changeActiveCompany(row.id)}
                    sx={buttonStyle}
                >
                    {leading_role === ERoles.ROLE_ADMIN && !row.verified &&
                        <Tooltip title="Подтвердить">
                            <CheckIcon sx={{
                                color: colors.main
                            }}/>
                        </Tooltip>}
                    {row.verified && row.activated &&
                        <Tooltip title="Блокировать">
                            <BlockIcon sx={{
                                color: colors.white
                            }}/>
                        </Tooltip>}
                    {row.verified && !row.activated &&
                        <Tooltip title="Разблокировать">
                            <UndoIcon sx={{
                                color: colors.main
                            }}/>
                        </Tooltip>}
                </Button>}
                <Button
                    variant="contained"
                    onClick={() => openCompany(row.id)}
                    sx={buttonStyle}
                >
                    <Tooltip title="Посмотреть">
                        <VisibilityIcon sx={{
                            color: colors.white3
                        }}/>
                    </Tooltip>
                </Button>
            </>
        );
    };

    /**
     * Описание колонок таблицы
     */
    const columns: GridColDef[] = [
        {
            field: 'companyName',
            headerName: 'Наименование',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.name,
            ...generalMuiColumnSettings
        },
        {
            field: 'companyInn',
            headerName: 'ИНН',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.inn,
            ...generalMuiColumnSettings
        },
        {
            field: 'companyOgrn',
            headerName: 'ОГРН',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.ogrn,
            ...generalMuiColumnSettings
        },
        {
            field: 'companyLegalAddress',
            headerName: 'Юр.адрес',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.legal_address,
            ...generalMuiColumnSettings
        },
        {
            field: 'companyPostalAddress',
            headerName: 'Почт.адрес',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.postal_address,
            ...generalMuiColumnSettings
        },
        {
            field: 'director',
            headerName: 'Директор',
            minWidth: 180,
            flex: 1,
            valueGetter: ({row}) => row.director,
            ...generalMuiColumnSettings
        },
        {
            field: 'userAction',
            headerName: 'Действия',
            minWidth: 180,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: renderCell,
            ...generalMuiColumnSettings
        },
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
                Список компаний
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
                    loading={!companiesList.length}
                    autoHeight
                    sx={{
                        padding: '0px 16px',
                        border: 'none',
                        [theme.breakpoints.down(769)]: {
                            padding: '4px'
                        }
                    }}
                    rowSelection={false}
                    rows={companiesList}
                    rowSpacingType={'border'}
                    columns={columns}
                    getRowId={(row) => row.id}
                    hideFooter
                    slots={{
                        noRowsOverlay: () => <TableNoRowsOverlay/>,
                    }}
                />
            </Card>
            <ModalComponent open={openModal} size="large" close={setOpenModal}>
                <CompanyCardComponent data={currentCompany} setOpenModal={setOpenModal} isEdit={!!leading_role}/>
            </ModalComponent>
        </>
    );
}

export default Companies;
