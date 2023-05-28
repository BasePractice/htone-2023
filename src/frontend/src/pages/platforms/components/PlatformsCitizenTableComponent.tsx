import {Stack} from '@mui/material';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import {theme} from '../../../app/themes/customTheme';
import TableNoRowsOverlay from '../../../common/table/TableNoRowsOverlay';
import {IPlatform} from '../types';
import PlatformShortCardComponent from './PlatformShortCardComponent';

/**
 * Компонент выводит список площадок.
 *
 * @prop {IPlatform[]} platformsList Список площадок.
 */
function PlatformsCitizenTableComponent (props: { platformsList: IPlatform[] }) {
    
    return (
        <Card sx={{
            display: 'block',
            p: '24px',
            [theme.breakpoints.down(769)]: {
                p: '16px'
            }
        }}>
            <Stack
                direction="column"
                divider={<Divider orientation="horizontal" flexItem />}
                spacing={2}
            >
                {
                    props.platformsList && props.platformsList.length ?
                        props.platformsList.map((platform, index) => (
                            <PlatformShortCardComponent platform={platform} key={index}/>
                        )) :
                        <TableNoRowsOverlay />
                }
            </Stack>
        </Card>
    );
}

export default PlatformsCitizenTableComponent;
