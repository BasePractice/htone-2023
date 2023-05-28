import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import {YMaps, Map, ObjectManager} from '@pbe/react-yandex-maps';
import {useEffect, useState} from 'react';
import {colors, theme} from '../../../app/themes/customTheme';
import {IAnyObject} from '../../map/types';
import {IPlatform} from '../types';
import PlatformShortCardComponent from './PlatformShortCardComponent';

const yandexMapOptions = {
    maxAnimationZoomDifference: 8,
    minZoom: 1,
    /*searchControlPosition: {
        top: '15px',
        left: '60px'
    },*/
};
const style = {
    button: {
        minWidth: 'unset',
        p: 1,
        width: '30px',
        height: '30px',
        borderRadius: '30px',
        position: 'absolute',
        top: '18px',
        right: '18px',
        bgcolor: colors.blue2,
        '&:hover': {
            bgcolor: colors.blue2_2
        },
        [theme.breakpoints.down(769)]: {
            top: '6px',
            right: '6px',
            bgcolor: 'unset',
            '&:hover': {
                bgcolor: 'unset'
            },
        }
    },
    icon: {
        color: colors.white3,
        width: 20,
        height: 20,
        [theme.breakpoints.down(769)]: {
            width: '30px',
            height: '30px'
        }
    }
};

const yandexMapModules = [
    'ObjectManager',
    'map.action.Single',
    'control.SearchControl',
    'geoObject.addon.balloon',
    'objectManager.addon.objectsBalloon',
    'objectManager.addon.objectsHint',
    'templateLayoutFactory',
    'control.ZoomControl',
    'control.FullscreenControl',
    'control.GeolocationControl'
];

const yandexMapControl = ['searchControl', 'zoomControl', 'fullscreenControl', 'geolocationControl'];

/**
 * Компонент выводит карту с площадками.
 *
 * @prop {IPlatform[]} platformsList Список площадок.
 */
function PlatformsYandexMapComponent (props: { platformsList: IPlatform[] }) {
    const [ymaps, setYmaps] = useState<any>(undefined);
    const [myMap, setMyMap] = useState<ymaps.Map | undefined>(undefined);
    const [objectManagerRef, setObjectManagerRef] = useState<any>(undefined);
    const [objectManagerFeatures, setObjectManagerFeatures] = useState<IAnyObject[]>([]);
    const [currentPlatform, setCurrentPlatform] = useState<IPlatform | undefined>(undefined);
    const [openBalloon, setOpenBalloon] = useState(false);


    const onLoadMap = (ymaps: any) => {
        setYmaps(ymaps);
    };

    /**
     * Собираем список геообъектов в нужном формате перед передачей их в компонент с картой
     */
    const createGeoObjectsList = (data: IPlatform[]) => {
        const geoObjects: IAnyObject[] = [];
        for (const platform of data) {
            geoObjects.push({
                type: 'Feature',
                id: platform.id,
                geometry: {
                    type: 'Point',
                    coordinates: [platform.latitude, platform.longitude],
                },
                properties: {
                    platformName: platform.name,
                    platformOrganization: platform.company_name,
                    platformCategory: platform.category
                },
            });
        }
        setObjectManagerFeatures(geoObjects);
    };

    const setZoom = (zoom: number, center: Array<string>) => {
        if (zoom === 0) {
            zoom = 3;
        }
        if (ymaps) {
            const action = new ymaps.map.action.Single({
                center: center,
                zoom: zoom,
                duration: 500,
                timingFunction: 'ease-in',
                checkZoomRange: true
            });
            myMap && myMap.action.execute(action);
        }
    };

    const setMapObjectListener = () => {
        myMap && myMap.events.add('click', () => {
            setOpenBalloon(false);
        });

        objectManagerRef.objects.events.add('click', async (e: any) => {
            const objectId = e.get('objectId');
            const obj = objectManagerRef.objects.getById(objectId);
            const objectData = objectManagerRef.objects.balloon.getData();
            const platform = props.platformsList.find(item => item.id === objectId);
            if (platform && (!objectData || obj.id !== objectData.id)) {
                setOpenBalloon(true);
                setCurrentPlatform(platform);
                if (myMap && myMap.getZoom() < 14) {
                    setZoom(14, [platform.latitude, platform.longitude]);
                }
            }
        });
    };

    useEffect(() => {
        if (props.platformsList.length > 0) {
            createGeoObjectsList(props.platformsList);
        }
    }, [props.platformsList]);

    useEffect(() => {
        if (objectManagerRef && props.platformsList.length > 0) {
            setMapObjectListener();
        }
    }, [props.platformsList, objectManagerRef]);

    return (
        <Card sx={{
            display: 'block',
            position: 'relative',
            borderRadius: '7px',
            height: '560px',
            border: 'none',
            [theme.breakpoints.down(769)]: {
                width: 'calc(100% + 40px)',
                ml: '-20px',
                borderRadius: '0px'
            },
            [theme.breakpoints.down(479)]: {
                height: '500px'
            }
        }}>
            <YMaps>
                <Map
                    onLoad={onLoadMap}
                    defaultState={{
                        controls: yandexMapControl,
                        center: [55.751574, 37.573856],
                        zoom: 10,
                    }}
                    options={yandexMapOptions}
                    modules={yandexMapModules}
                    width={'100%'}
                    height={'100%'}
                    instanceRef={ref => setMyMap(ref)}
                >
                    <ObjectManager
                        options={{
                            clusterize: true,
                            gridSize: 32,
                        }}
                        objects={{
                            openBalloonOnClick: true,
                            preset: 'islands#redDotIcon',
                        }}
                        clusters={{
                            preset: 'islands#redClusterIcons',
                        }}
                        features={objectManagerFeatures}
                        modules={[
                            'objectManager.addon.objectsBalloon',
                            'objectManager.addon.objectsHint',
                        ]}
                        instanceRef={(ref: any) => setObjectManagerRef(ref)}
                    />

                </Map>
            </YMaps>
            {
                openBalloon && currentPlatform && <Card sx={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    width: '620px',
                    p: '18px',
                    backgroundColor: colors.grey,
                    borderRadius: '7px',
                    [theme.breakpoints.down(769)]: {
                        left: '10px',
                        width: 'auto',
                        p: '6px',
                    }
                }}>
                    <Button
                        variant="contained"
                        onClick={() => setOpenBalloon(false)}
                        sx={style.button}
                    >

                        <Tooltip title="Закрыть">
                            <CloseIcon sx={style.icon}/>
                        </Tooltip>
                    </Button>
                    <Box>
                        <PlatformShortCardComponent platform={currentPlatform}/>
                    </Box>
                </Card>
            }
        </Card>
    );
}

export default PlatformsYandexMapComponent;
