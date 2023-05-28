import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import {ERoles} from '../../app/router/enums';
import {useAppSelector} from '../../app/store/store';
import {colors, theme} from '../../app/themes/customTheme';
import ModalComponent from '../../common/modal/ModalComponent';
import {generalMuiColumnSettings} from '../../common/table/constants';
import TableNoRowsOverlay from '../../common/table/TableNoRowsOverlay';
import {useLazyGetPlatformsQuery} from '../platforms/platformsApiSlice';
import {useLazyGetBookingsQuery} from './bookingsApiSlice';
import BookingCardComponent from './components/BookingCardComponent';
import {IBooking, IBookingBase} from './types';

const buttonStyle = {
    my: 2,
    mr: 1,
    minWidth: 'unset',
    p: 1,
    width: 40,
    borderRadius: 40
};

function Bookings() {
    const [openModal, setOpenModal] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<IBooking | null>(null);
    const [bookingList, setBookingList] = useState<IBooking[]>([]);
    const [getPlatforms] = useLazyGetPlatformsQuery();
    const [getBookings] = useLazyGetBookingsQuery();
    const {access_token} = useAppSelector(state => state.authSession);
    const {leading_role, id} = useAppSelector(state => state.user);

    const sendRequest = async (role: ERoles, token: string) => {
        const platforms = await getPlatforms({
            role,
            token
        }).unwrap();
        let bookingsAll: IBooking[] = [];
        platforms.map(async platform => {
            platform.id && await getBookings({
                platform_id: platform.id,
                token
            }).unwrap().then((response: IBookingBase[]) => {
                if (response.length) {
                    const bookingsByPlatform = response.filter(item => leading_role !== ERoles.ROLE_TENANT || item.tenant_id === id).map(item => ({
                        ...item,
                        platform_name: platform.name,
                        platform_address: platform.address,
                        company_name: platform.company_name,
                        company_id: platform.company_id
                    }));
                    console.log(bookingsByPlatform);

                    bookingsAll = [...bookingsAll, ...bookingsByPlatform];
                    setBookingList(bookingsAll);
                }
            });

        });

    };

    useEffect(() => {
        if (leading_role && access_token)
            (async () => {
                await sendRequest(leading_role, access_token);
            })();
    },[access_token, leading_role]);

    /**
     * Поиск бронирования в списке
     *
     * @param id идентификатор бронирования
     */
    const getBooking = (id: string): IBooking | undefined => {
        return bookingList.find(item => item.id === id);
    };

    /**
     * Открытие модального окна для просмотра данных бронирования
     *
     * @param id идентификатор бронирования
     */
    const openBooking = (id: string) => {
        const booking = getBooking(id);
        if (booking) {
            setCurrentBooking(booking);
            setOpenModal(true);
        }
    };

    /**


    /**
     * Отрисовка ячейки таблицы с действиями
     *
     * @param row Строка таблицы.
     */
    const renderCell = ({row}: GridRenderCellParams) => {
        return (
            <>
                <Button
                    variant="contained"
                    onClick={() => openBooking(row.id)}
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
        /*{
            field: 'companyId',
            headerName: 'Компания',
            minWidth: 160,
            flex: 1,
            valueGetter: ({row}) => row.company_name,
            ...generalMuiColumnSettings
        },*/
        {
            field: 'platformName',
            headerName: 'Название площадки',
            minWidth: 160,
            flex: 1,
            valueGetter: ({row}) => row.platform_name,
            ...generalMuiColumnSettings
        },
        {
            field: 'platformAddress',
            headerName: 'Адрес',
            minWidth: 160,
            flex: 1,
            valueGetter: ({row}) => row.platform_address,
            ...generalMuiColumnSettings
        },
        {
            field: 'dateFrom',
            headerName: 'Дата',
            minWidth: 160,
            flex: 1,
            valueGetter: ({row}) => row.date_use,
            ...generalMuiColumnSettings
        },
        /*{
            field: 'status',
            headerName: 'Статус',
            minWidth: 160,
            flex: 1,
            valueGetter: ({row}) => row.status,
            ...generalMuiColumnSettings
        },*/
        /*{
            field: 'contractSigned',
            headerName: 'Договор',
            minWidth: 160,
            flex: 1,
            valueGetter: ({row}) => row.contract_signed ?
                'Да' :
                'Нет',
            ...generalMuiColumnSettings
        },*/
        {
            field: 'userAction',
            headerName: 'Действия',
            minWidth: 160,
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
                Список бронирований
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
                    loading={!bookingList.length}
                    autoHeight
                    sx={{
                        padding: '0px 16px',
                        border: 'none',
                        [theme.breakpoints.down(769)]: {
                            padding: '4px'
                        }
                    }}
                    rowSelection={false}
                    rows={bookingList}
                    rowSpacingType={'border'}
                    columns={columns}
                    hideFooter
                    getRowId={(row) => row.id}
                    slots={{
                        noRowsOverlay: () => <TableNoRowsOverlay/>,
                    }}
                />
            </Card>
            <ModalComponent open={openModal} size="large" close={setOpenModal}>
                <BookingCardComponent data={currentBooking} setOpenModal={setOpenModal}/>
            </ModalComponent>
        </>
    );
}

export default Bookings;
