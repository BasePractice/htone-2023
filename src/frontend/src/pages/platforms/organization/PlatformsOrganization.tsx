import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import {EReferenceBooks, ERoles} from '../../../app/router/enums';
import {useAppDispatch, useAppSelector} from '../../../app/store/store';
import {colors, theme} from '../../../app/themes/customTheme';
import {setConfirmationAlert} from '../../../common/alert/alertSlice';
import ModalComponent from '../../../common/modal/ModalComponent';
import {generalMuiColumnSettings} from '../../../common/table/constants';
import TableNoRowsOverlay from '../../../common/table/TableNoRowsOverlay';
import {useLazyGetCompanyQuery} from '../../companies/companiesApiSlice';
import CompanyCardComponent from '../../companies/components/CompanyCardComponent';
import {ICompany} from '../../companies/types';
import PlatformCardComponent from '../components/PlatformCardComponent';
import {ECategoriesTypes, EStatusRecordsDesc} from '../enums';
import {confirmationBlockingState} from '../helpers';
import {useActivatePlatformsMutation, useLazyGetPlatformsQuery, useVerifyPlatformsMutation} from '../platformsApiSlice';
import {IPlatform} from '../types';

const platformInitialValues = {
    email: '',
    phone: '',
    category: '' as ECategoriesTypes,
    name: '',
    description: '',
    address: '',
    url: '',
    working: '',
    unit_price: '',
    latitude: '',
    longitude: ''
    /*booking_type: '',
    facilitiesEquipment: '',
    freeRentableArea: '',
    objectsCollectiveUse: '',
    services: '',
    totalArea: '',
    locationCoordinatesLat: '',
    locationCoordinatesLon: '',
    locationAdditionalInfo: '',
    contacts: [],
    presentation: '',
    photos: [],
    rentTerms: '',
    status: 'UNCONFIRMED' as EStatusRecords*/
} as IPlatform;

const buttonStyle = {
    my: 2,
    mr: 1,
    minWidth: 'unset',
    p: 1,
    width: 40,
    borderRadius: 40
};

function PlatformsOrganization () {
    const [openModal, setOpenModal] = useState(false);
    const [openModalCompany, setOpenModalCompany] = useState(false);
    const [platformsList, setPlatformsList] = useState<IPlatform[]>([]);
    const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);
    const [currentPlatform, setCurrentPlatform] = useState<IPlatform>(platformInitialValues);
    const {access_token} = useAppSelector(state => state.authSession);
    const {leading_role, companies} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    //const {platformsList} = useAppSelector(state => state.platformsList);
    const [getPlatforms] = useLazyGetPlatformsQuery();
    const [activatePlatforms] = useActivatePlatformsMutation();
    const [verifyPlatform] = useVerifyPlatformsMutation();
    const [getCompany] = useLazyGetCompanyQuery();

    const sendRequest = async (role: ERoles, token: string) => {
        const platforms = await getPlatforms({
            role,
            token
        }).unwrap();
        setPlatformsList(platforms);
    };

    useEffect(() => {
        if (leading_role && access_token) {
            if (leading_role === ERoles.ROLE_LANDLORD && companies && !companies.length) {
                setOpenModalCompany(true);
            } else
                (async () => {
                    await sendRequest(leading_role, access_token);
                })();
        }
    },[access_token, leading_role]);

    /**
     * Поиск площадки в списке
     *
     * @param id идентификатор площадки
     */
    const getPlatform = (id: string): IPlatform | undefined => {
        return platformsList.find(item => item.id === id);
    };

    /**
     * Открытие модального окна для изменения параметров площадки
     *
     * @param id идентификатор площадки
     */
    const editPlatform = (id: string) => {
        const platform = getPlatform(id);
        if (platform) {
            setCurrentPlatform(platform);
            setOpenModal(true);
        }
    };

    const createPlatform = () => {
        setCurrentPlatform(platformInitialValues);
        setOpenModal(true);
    };

    /**
     * Изменение активности площадки
     * Админ может менять флаг подтверждения
     * Владелец может блокировать
     *
     * @param id идентификатор площадки
     */
    const changeActivePlatform = async (id: string) => {
        const platform = getPlatform(id);
        if (platform) {
            if (!platform.verified && leading_role === ERoles.ROLE_ADMIN) {
                // подтверждение платформы
                access_token && await verifyPlatform({
                    id,
                    token: access_token
                }).unwrap();
            } else if (platform.verified && platform.active) {
                await dispatch(setConfirmationAlert(confirmationBlockingState(EReferenceBooks.PLATFORMS, id.toString())));
            } else {
                access_token && await activatePlatforms({
                    id: platform.id ?? '',
                    token: access_token
                }).unwrap();
            }
            leading_role && access_token && await sendRequest(leading_role, access_token);
        }
    };

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
            setOpenModalCompany(true);
        }
    };

    /**
     * Отрисовка ячейки таблицы с компанией
     *
     * @param row Строка таблицы.
     */
    const renderCellCompany = ({row}: GridRenderCellParams) => {
        return (
            <>
                {row.company_name && <Button sx={{
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textDecoration: 'underline'
                }} variant="text" onClick={() => openCompany(row.company_id)}
                >{row.company_name}</Button>}
            </>
        );
    };

    /**
     * Отрисовка ячейки таблицы с действиями
     *
     * @param row Строка таблицы.
     */
    const renderCell = ({row}: GridRenderCellParams) => {
        return (
            <>
                {((leading_role === ERoles.ROLE_LANDLORD && row.verified) ||
                    (leading_role === ERoles.ROLE_ADMIN)) && <Button
                    variant={row.active ?
                        'contained' :
                        'outlined'}
                    onClick={() => changeActivePlatform(row.id)}
                    sx={buttonStyle}
                >
                    {leading_role === ERoles.ROLE_ADMIN && !row.verified &&
                            <Tooltip title="Подтвердить">
                                <CheckIcon sx={{
                                    color: colors.main
                                }}/>
                            </Tooltip>}
                    {row.verified && row.active &&
                        <Tooltip title="Блокировать">
                            <BlockIcon sx={{
                                color: colors.white
                            }}/>
                        </Tooltip>}
                    {row.verified && !row.active &&
                        <Tooltip title="Разблокировать">
                            <UndoIcon sx={{
                                color: colors.main
                            }}/>
                        </Tooltip>}
                </Button>}
                <Button
                    variant="contained"
                    onClick={() => editPlatform(row.id)}
                    sx={buttonStyle}
                >

                    <Tooltip title="Редактировать">
                        <EditIcon sx={{
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
            field: 'platformName',
            headerName: 'Наименование площадки',
            minWidth: 200,
            flex: 1,
            valueGetter: ({row}) => row.name,
            ...generalMuiColumnSettings
        },
        {
            field: 'platformAddress',
            headerName: 'Адрес площадки',
            minWidth: 200,
            flex: 1,
            valueGetter: ({row}) => row.address,
            ...generalMuiColumnSettings
        },
        {
            field: 'platformCategory',
            headerName: 'Категория',
            minWidth: 200,
            flex: 1,
            valueGetter: ({row}) => row.category,
            ...generalMuiColumnSettings
        },
        {
            field: 'platformCompany',
            headerName: 'Компания',
            minWidth: 200,
            flex: 1,
            renderCell: renderCellCompany,
            ...generalMuiColumnSettings
        },
        {
            field: 'platformStatus',
            headerName: 'Статус',
            minWidth: 200,
            flex: 1,
            valueGetter: ({row}) => !row.verified ?
                EStatusRecordsDesc.UNCONFIRMED :
                !row.active ?
                    EStatusRecordsDesc.BLOCKING :
                    EStatusRecordsDesc.ACTIVE,
            ...generalMuiColumnSettings
        },
        {
            field: 'platformAction',
            headerName: 'Действия',
            minWidth: 200,
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
                    Список площадок
            </Typography>
            {leading_role === ERoles.ROLE_LANDLORD && <Button
                size="large"
                variant="contained"
                onClick={() => createPlatform()}
                sx={{
                    color: colors.white,
                    mb: '20px'
                }}
            >
                добавить площадку
            </Button>}
            <Card sx={{
                display: 'block',
                p: '24px',
                mb: '100px',
                [theme.breakpoints.down(769)]: {
                    padding: '10px'
                }
            }}>
                <DataGrid
                    loading={!platformsList.length}
                    autoHeight
                    sx={{
                        padding: '0px 16px',
                        border: 'none',
                        [theme.breakpoints.down(769)]: {
                            padding: '4px'
                        }
                    }}
                    rowSelection={false}
                    rows={platformsList}
                    rowSpacingType={'border'}
                    columns={columns}
                    hideFooter
                    getRowId={(row) => row.id}
                    slots={{
                        noRowsOverlay: () => <TableNoRowsOverlay/>,
                    }}
                />
            </Card>
            <ModalComponent open={openModalCompany} close={setOpenModalCompany} size="large">
                <CompanyCardComponent data={currentCompany} setOpenModal={setOpenModalCompany} isEdit={true}/>
            </ModalComponent>
            <ModalComponent open={openModal} close={setOpenModal} size="large">
                <PlatformCardComponent data={currentPlatform} isOpenModal={setOpenModal}/>
            </ModalComponent>
        </>
    );
}

export default PlatformsOrganization;
