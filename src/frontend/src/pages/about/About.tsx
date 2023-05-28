import Typography from '@mui/material/Typography';
import {theme} from '../../app/themes/customTheme';

function About() {
    return (
        <>
            <Typography variant={'h3'} sx={{
                my: '40px',
                fontSize: '60px',
                fontWeight: 500,
                lineHeight: 1.25,
                [theme.breakpoints.down(769)]: {
                    fontSize: '32px'
                }
            }}>О платформе</Typography>
            <Typography sx={{
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: 1.65,
                mb: 5,
                width: '60%',
                [theme.breakpoints.down(769)]: {
                    width: '100%',
                    maxWidth: '500px'
                }
            }}>Агентство креативных индустрий является единым окном для взаимодействия
                органов власти и представителей креативного предпринимательства Москвы.
                Программы Агентства направлены на развитие и поддержку креативных
                предпринимателей столицы.
                Данный веб-сервис является единой платформой для
                бронирования креативных площадок и услуг (креативные кластеры,
                звукозаписывающие студии, галереи, киноплощадки для проведения съемок и
                кинотеатры для проведения показов и фестивалей и проч.),
                что упростит процесс как для горожан и бизнес-сообщества, так и для арендодателей и креативных площадок.
            </Typography>
            <Typography sx={{
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: 1.65,
                width: '60%',
                mb: '100px',
                [theme.breakpoints.down(769)]: {
                    width: '100%',
                    maxWidth: '500px'
                }
            }}>Создание веб-сервиса АНО “Агентство креативных индустрий” по онлайн
                бронированию в одном месте всех креативных площадок Москвы позволило собрать
                всю креативную инфраструктуру по «системе единого окна» (креативные кластеры,
                креативные пространства от звукозаписывающих студий до галерей, киноплощадки
                для проведения съемок и кинотеатры для проведения показов и фестивалей и проч.).
                Платформа позволяет удовлетворить запросы как горожан для
                организации своего тематического креативного досуга (например, аренда
                звукозаписывающей студии для записи своего музыкального трека), а также для
                бизнес-сообщества для организации своего рабочего процесса (например,
                перекрытие улицы для съемки фильма и организация кино-каравана на парковочной
                территории на перекрытой улице).

            </Typography>
        </>
    );
}

export default About;