import {zodResolver} from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {EMethod} from '../../../app/api/enums';
import {useAppDispatch, useAppSelector} from '../../../app/store/store';
import {colors, theme} from '../../../app/themes/customTheme';
import SelectComponent from '../../../common/components/SelectComponent';
import TextFieldComponent from '../../../common/components/TextFieldComponent';
import {ECategoriesTypes} from '../enums';
import {useCreateUpdatePlatformMutation} from '../platformsApiSlice';
import {addPlatformToList} from '../platformsSlice';
import {IPlatform} from '../types';
import {platformSchema, TPlatformSchema} from '../validation';

const style = {
    button: {
        mr: 1,
        minWidth: 'unset',
        p: 1,
        width: 30,
        height: 30,
        borderRadius: 30,
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
    },
    icon: {
        color: colors.white,
        width: 20,
        height: 20,
        [theme.breakpoints.down(769)]: {
            width: '40px',
            height: '40px'
        }
    }
};

/**
 * Component Props.
 *
 * @prop {IPlatform} data Данные площадки.
 * @prop {(flag: boolean) => void} isOpenModal Обработчик закрытия окна.
 */
interface IComponentProps {
    data: IPlatform,
    isOpenModal: (flag: boolean) => void
}
function PlatformCardComponent ({data, isOpenModal}: IComponentProps) {
    const [openModalContact, setOpenModalContact] = useState(false);
    const [openDropzoneDialog, setOpenDropzoneDialog] = useState(false);
    const [editedContactIndex, setEditedContactIndex] = useState(-1);
    //const [contacts, setContacts] = useState(data.contacts);
    const {access_token} = useAppSelector(state => state.authSession);
    const {companies} = useAppSelector(state => state.user);
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    //const [photos, setPhotos] = useState(data.photos);
    const [createUpdatePlatform] = useCreateUpdatePlatformMutation();
    const dispatch = useAppDispatch();

    const methods = useForm<TPlatformSchema>({
        values: data,
        resolver: zodResolver(platformSchema),
        mode: 'all'
    });

    const {
        handleSubmit,
        formState: {isValid}
    } = methods;

    const onSubmit = async (formData: any) => {
        if (access_token && companies && companies.length) {
            const platformData = data ?
                formData :
                {
                    ...formData,
                    company_id: companies[0].id
                };
            const response = await createUpdatePlatform({
                data: platformData,
                id: data.id ?? '',
                token: access_token,
                method: data.id ?
                    EMethod.UPDATE :
                    EMethod.CREATE
            }).unwrap();
            if (!data) {
                platformData.id = response?.id;
                dispatch(addPlatformToList(platformData));
            }
            isOpenModal(false);
        }
        
    };
    /*const editContact = (index: number) => {
        setEditedContactIndex(index);
        setOpenModalContact(true);
    };
    const saveContact = (contact: IContact) => {
        const items = contacts.slice();
        if (editedContactIndex > -1)
            items[editedContactIndex] = contact;
        else
            items.push(contact);
        setContacts(items);
        setOpenModalContact(false);
    };

    const deleteContact = (index: number) => {
        const items = contacts.slice();
        items.splice(index, 1);
        setContacts(items);
    };

    const addContact = () => {
        setEditedContactIndex(-1);
        setOpenModalContact(true);
    };
    const addPhoto = () => {
        setOpenDropzoneDialog(true);
    };

    const savePhotos = (files: any) => {
        //todo: отправка файлов, добавление в список
        setOpenDropzoneDialog(false);
        console.log(files);

    };
    
    const renderContacts = () => {
        return (
            contacts.map((element: IContact, index: number) => {
                return (
                    <Grid 
                        key={index}
                        container
                        columnSpacing={1}
                        sx={{
                            mb: 1
                        }}
                    >
                        <Grid item xs={8}>
                            <Typography sx={{
                                borderBottom: `1px solid ${colors.grey1}`,
                                py: '4px'
                            }}>
                                {element.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                variant="contained"
                                onClick={() => editContact(index)}
                                sx={style.button}
                            >
                                <Tooltip title="Редактировать">
                                    <EditIcon sx={style.icon}/>
                                </Tooltip>
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => deleteContact(index)}
                                sx={style.button}
                            >
                                <Tooltip title="Удалить">
                                    <DeleteIcon sx={style.icon}/>
                                </Tooltip>
                            </Button>
                        </Grid>
                    </Grid>
                );
            })      
        );
    };

    const renderPhotos = () => {
        return (
            <ImageList sx={{
                width: 600,
                height: 158
            }} cols={4} rowHeight={158}>
                {photos.map((element: string, index: number) => (
                    <ImageListItem key={index} >
                        <img
                            src="http://more-radosti.ru/wp-content/uploads/2019/12/85-4.jpg"
                            alt="photo"
                            loading="lazy"
                            width="150px"
    
                        />
                    </ImageListItem>
    
                ))}
            </ImageList>
        );
    };*/
    return (
        <>
            <Typography variant="h5" sx={{
                mb: 3,
                mt: 1,
                [theme.breakpoints.down(769)]: {
                    fontSize: '22px',
                }
            }}>
                Описание площадки
            </Typography>
            <FormProvider {...methods}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        pt: 2
                    }}
                >
                    <Grid container 
                        columnSpacing={3}
                        rowSpacing={4}
                        columns={{
                            xs: 3,
                            md: 12,
                            sm: 3,
                        }}
                        sx={{
                            mb: 3,
                            [theme.breakpoints.down(769)]: {
                                direction: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                            }
                        }}
                    >
                        <Grid item xs={4}>
                            <SelectComponent
                                controlled
                                name="category"
                                label="Категория"
                                fullWidth
                                required
                                options={Object.values(ECategoriesTypes).map(value => ({
                                    label: value,
                                    value
                                }))}
                                sx={{
                                    [theme.breakpoints.down(769)]: {
                                        maxWidth: 'calc(100vw - 56px)'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="name"
                                label="Наименование площадки"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="url"
                                label="Ссылка на сайт владельца"
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container
                        columnSpacing={3}
                        rowSpacing={4}
                        columns={{
                            xs: 3,
                            md: 12,
                            sm: 3,
                        }}
                        sx={{
                            mb: 3,
                            [theme.breakpoints.down(769)]: {
                                direction: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                            }
                        }}
                    >
                        <Grid item xs={8}>
                            <TextFieldComponent
                                name="description"
                                label="Описание"
                                multiline
                                minRows={4}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="phone"
                                label="Телефон"
                                fullWidth
                                required
                                sx={{
                                    mb: 1.6
                                }}
                            />
                            <TextFieldComponent
                                name="email"
                                label="Эл. почта"
                                fullWidth
                                required
                            />
                        </Grid>
                        {/*<Grid item xs={4}>
                            <TextFieldComponent
                                name="presentation"
                                label="Презентация"
                                fullWidth
                                required
                            />
                        </Grid>*/}
                    </Grid>
                    <Grid container 
                        columnSpacing={3}
                        rowSpacing={4}
                        columns={{
                            xs: 3,
                            md: 12,
                            sm: 3,
                        }}
                        sx={{
                            mb: 3,
                            [theme.breakpoints.down(769)]: {
                                direction: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                            }
                        }}
                    >
                        <Grid item xs={8}>
                            <TextFieldComponent
                                name="address"
                                label="Адрес локации"
                                fullWidth
                                required
                                sx={{
                                    mb: 1.6,
                                    [theme.breakpoints.down(769)]: {
                                        mb: 3
                                    }
                                }}
                            />
                            <Box sx={{
                                display: 'flex',
                                [theme.breakpoints.down(769)]: {
                                    flexDirection: 'column',
                                    gap: '16px'
                                }
                            }}>
                                <TextFieldComponent
                                    name="latitude"
                                    label="Координаты (широта)"
                                    fullWidth
                                    required
                                    sx={{
                                        mr: 3,
                                        [theme.breakpoints.down(769)]: {
                                            mr: '0px'
                                        }
                                    }}
                                />
                                <TextFieldComponent
                                    name="longitude"
                                    label="Координаты (долгота)"
                                    fullWidth
                                    required
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="working"
                                label="Расписание"
                                fullWidth
                                multiline
                                minRows={4}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container
                        columnSpacing={3}
                        rowSpacing={4}
                        columns={{
                            xs: 3,
                            md: 12,
                            sm: 3,
                        }}
                        sx={{
                            mb: 3,
                            [theme.breakpoints.down(769)]: {
                                direction: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                            }
                        }}
                    >
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="unit_price"
                                label="Цена (в сутки)"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                        {/*<Grid item xs={4}>
                            <TextFieldComponent
                                name="locationCoordinates"
                                label="Координаты на карте"
                                fullWidth
                                required
                            />
                        </Grid>*/}
                    </Grid>
                    <Grid container 
                        columnSpacing={3}
                        rowSpacing={4}
                        columns={{
                            xs: 3,
                            md: 12,
                            sm: 3,
                        }}
                        sx={{
                            mb: 3,
                            [theme.breakpoints.down(769)]: {
                                direction: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                            }
                        }}
                    >
                        {/*<Grid item xs={4}>
                            <TextFieldComponent
                                name="locationAdditionalInfo"
                                label="Как добраться"
                                multiline
                                minRows={3}
                                fullWidth
                                required
                            />
                        </Grid>*/}

                        {/*<Grid item xs={4}>
                            <TextFieldComponent
                                name="rentTerms"
                                label="Условия аренды"
                                minRows={3}
                                multiline
                                fullWidth
                                required
                            />
                        </Grid>*/}
                    </Grid>

                    {/*<Grid container
                        columnSpacing={3}
                        sx={{
                            mb:3
                        }}
                    >
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="services"
                                label="Предоставляемые услуги"
                                multiline
                                minRows={3}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="objectsCollectiveUse"
                                label="Объекты коллективного пользования"
                                multiline
                                minRows={3}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="facilitiesEquipment"
                                label="Оборудование объектов"
                                minRows={3}
                                multiline
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container
                        columnSpacing={3}
                        sx={{
                            mb:3
                        }}
                    >
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="totalArea"
                                label="Общая площадь (кв. м)"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextFieldComponent
                                name="freeRentableArea"
                                label="Aрендопригодная площадь (кв. м)"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <SelectComponent
                                controlled
                                name="booking_type"
                                label="Тип бронирования"
                                fullWidth
                                required
                                options={Object.values(EBookingType).map(value => ({
                                    label: value,
                                    value
                                }))}
                            />
                        </Grid>
                    </Grid>
                    <Grid container 
                        columnSpacing={3}
                        sx={{
                            mb:3
                        }}
                    >
                        <Grid item xs={4}>
                            <Card sx={{
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                p: 2
                            }}>
                                <Typography sx={{
                                    mb: 1,
                                    color: 'rgba(255, 255, 255, 0.2)'
                                }}>
                                    Контакты
                                </Typography>
                                {renderContacts()}
                                <Button
                                    size="large"
                                    variant="text"
                                    onClick={() => addContact()}
                                >
                                    добавить контакт
                                </Button>
                            </Card>
                        </Grid>
                        <Grid item xs={8}>
                            <Card sx={{
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                p: 2
                            }}>
                                <Typography sx={{
                                    mb: 1,
                                    color: 'rgba(255, 255, 255, 0.2)'
                                }}>
                                    Фотографии
                                </Typography>
                                {renderPhotos()}
                                <Button
                                    variant="text"
                                    size="large"
                                    onClick={() => addPhoto()}
                                >
                                    добавить фотографию
                                </Button>
                            </Card>
                        </Grid>

                    </Grid>*/}
                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        disabled={!isValid}
                        sx={{
                            my: 2,
                            fontSize: 17
                        }}
                    >
                        сохранить
                    </Button>
                    <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={() => isOpenModal(false)}
                        sx={{
                            my: 2,
                            ml: 2,
                            fontSize: 17
                        }}
                    >
                        отмена
                    </Button>
                    {/*<Grid>
                        
                    </Grid>*/}
                </Box>
            </FormProvider>
            {/*<ModalComponent open={openModalContact} size="small">
                <ContactFormComponent cancelFunc={setOpenModalContact} data={editedContactIndex > -1 ?
                    contacts[editedContactIndex] :
                    undefined}
                save={saveContact}
                />
            </ModalComponent>
            <DropzoneDialog
                dialogTitle="Добавить фотографии"
                cancelButtonText="отмена"
                submitButtonText="сохранить"
                dropzoneText="Перетащите файл сюда или нажмите"
                previewText="Просмотр:"
                open={openDropzoneDialog}
                onSave={savePhotos}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                maxFileSize={5000000}
                onClose={() => setOpenDropzoneDialog(false)}
            />*/}
        </>
    );
}

export default PlatformCardComponent;
