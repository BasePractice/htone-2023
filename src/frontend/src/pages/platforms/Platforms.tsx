import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from 'react';
import {useAppSelector} from '../../app/store/store';
import {colors} from '../../app/themes/customTheme';
import ModalComponent from '../../common/modal/ModalComponent';
import PlatformFilterComponent, {defaultFilters} from './components/PlatformFilterComponent';
import PlatformsCitizenTableComponent from './components/PlatformsCitizenTableComponent';
import PlatformsNewsCard from './components/PlatformsNewsCard';
import PlatformsSubscribeNewsCard from './components/PlatformsSubscribeNewsCard';
import PlatformsYandexMapComponent from './components/PlatformsYandexMapComponent';
import WelcomeComponent from './components/WelcomeComponent';
import {EViewType} from './enums';
import {useLazyGetPlatformsOpenQuery} from './platformsApiSlice';
import {IFiltersPlatforms, IPlatform} from './types';

/**
 * Компонент (обертка) для страниц с площадками.
 */
function Platforms() {
    const [viewType, setViewType] = useState(EViewType.MAP);
    const [filters, setFilters] = useState<IFiltersPlatforms>(defaultFilters);
    const [localPlatformsList, setLocalPlatformsList] = useState<IPlatform[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [getPlatformsOpen] = useLazyGetPlatformsOpenQuery();
    const {access_token} = useAppSelector(state => state.authSession);
    const {leading_role} = useAppSelector(state => state.user);
    const platformsList = useAppSelector(state => state.platformsList.platformsListOpen);

    const filter = (dataFilter: IFiltersPlatforms, viewType: EViewType) => {
        setLocalPlatformsList(platformsList.filter(item => item.category === dataFilter.category));
        setViewType(viewType);
        setFilters(dataFilter);
        setOpenModal(false);
    };

    const clearFilters = () => {
        setFilters(defaultFilters);
        setLocalPlatformsList(platformsList);
    };

    useEffect(() => {
        (async () => {
            await getPlatformsOpen();
        })();
    },[access_token, leading_role]);

    useEffect(() => {
        setLocalPlatformsList(platformsList);
    },[platformsList]);
   
    return (
        <>
            <WelcomeComponent/>
            <Typography variant="h3" sx={{
                fontSize: '56px',
                lineHeight: '70px',
                color: colors.white
            }}
            >
                Карта креативных площадок
            </Typography>
            <Box display="flex" my={'20px'}>
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => setViewType(viewType === EViewType.MAP ?
                        EViewType.TABLE :
                        EViewType.MAP)}
                    sx={{
                        mr: '20px',
                        color: colors.white
                    }}
                >
                    {viewType === EViewType.MAP ?
                        'список' :
                        'карта'}
                </Button>
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                    sx={{
                        mr: '20px',
                        color: colors.white
                    }}
                >
                    фильтр
                </Button>
                {filters.category && <Button
                    size="large"
                    variant="outlined"
                    sx={{
                        fontSize: '17px'
                    }}
                    onClick={() => clearFilters()}
                >
                    очистить фильтр
                </Button>}
            </Box>
            {viewType === EViewType.MAP ?
                <PlatformsYandexMapComponent platformsList={localPlatformsList}/> :
                <PlatformsCitizenTableComponent platformsList={localPlatformsList}/>}
            <PlatformsNewsCard/>
            <PlatformsSubscribeNewsCard/>
            <ModalComponent open={openModal}  close={setOpenModal} size="large">
                <PlatformFilterComponent filter={filter} dataFilter={filters}/>
            </ModalComponent>
        </>
    );
}

export default Platforms;
