import React, { useState, useEffect } from "react";
import {
    Modal,
    Table,
    TableBody,
    TableCell,
    Button,
    Checkbox,
    Typography,
    Grid,
    TableRow,
    Switch,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    TextField,
    CircularProgress,
    FormControlLabel,
    Box,
    Backdrop,
    Fade
} from "@mui/material";
import axios from "axios";
import consts from "../../consts/consts";
import { getWeekString } from "../../helpers/helpers";

export default function AdminModal (props) {
    useEffect(() => {
    }, [props.openModal]);
    const [isSaving, setIsSaving] = useState(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    let handleOfficeClassChange = (name, value) => {
        props.setOfficeClass(prevState => ({
            ...prevState,
            [name] : value
        }));
    }

    let handleHourSwitch = (checked) => {
        let tempNewHours = props.officeClass.hours;
        let availableWeeks = 0;
        if (checked) {
            // Delete half of the scheduled weeks
            if ((props.officeClass.courseType == 'inter' && props.officeClass.weeksNum.length == 2) || (props.officeClass.courseType == 'advanced' && props.officeClass.weeksNum.length == 4)) {
                let tempArr = props.officeClass.weeksNum;
                let newArr = tempArr.splice(0,(tempArr.length / 2));
                props.setOfficeClass(prevState => ({
                    ...prevState,
                    weeksNum : newArr
                }));
            }
            tempNewHours.push(Math.max(...tempNewHours) + 1 , Math.max(...tempNewHours) + 2);
            props.officeClass.courseType == 'inter' ? (availableWeeks = 1) : (availableWeeks = 2);
        } else {
            tempNewHours = tempNewHours.slice(0, 2);
            props.officeClass.courseType == 'inter' ? (availableWeeks = 2) : (availableWeeks = 4);
        }

        props.setOfficeClass(prevState => ({
            ...prevState,
            hours : tempNewHours,
            availableWeeks: availableWeeks
        }));
    }

    let handleCloseModal = () => {
        props.setOpenModal(false);
    }

    let openWhatsApp = (key, number) => {
        if (key == 'Número de teléfono del alumno' || key == 'Número del contacto de emergencia') {
            window.open(`https://wa.me/52${number}`, '_blank');
        }
    }

    let manuallyRegisterSale = async () => {
        setIsSaving(true);
        // Step 1 :: We save the class folio in the adequate schedules selected
        let url = process.env.NODE_ENV == 'development' ? 'http://localhost:9000' : process.env.REACT_APP_BLL_URL;
        await axios.post(`${url}/api/newSale`, props.officeClass)
        .then((res) => {
            alert('La clase ha sido registrada correctamente.');
            props.setOpenModal(false);
            props.setAdminRegisterSale(false);
            setIsSaving(false);
            props.getWeekClasses(props.currentWeek);
        })
        .catch((err) => {
            alert('Hubo un error registrando la clase, por favor contacte a soporte técnico.');
            props.setOpenModal(false);
            props.setAdminRegisterSale(false);
            setIsSaving(false);
        })
    }

    return (
        <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.openModal}>
                    <Box sx={modalStyle}>
                        {
                            isSaving
                            ?
                            <Grid sx={{margin: '50px'}}>
                                <Typography>Registrando...</Typography>
                                <CircularProgress />
                            </Grid>
                            :
                            <div>
                                {
                                    props.adminRegisterSale
                                    ?
                                    <div>
                                        <div style={{width: '100%'}}>
                                            <h1 style={{width: '90%', display: 'inline-block'}}>{`Registrar clase ${props.officeClass.gearBox == 'auto' ? 'Automático' : 'Estándar'}`}</h1>
                                            <Button variant='outlined' onClick={() => handleCloseModal()} style={{width: '10%', display: 'inline-block', cursor: 'pointer', textAlign: 'right'}} disabled={isSaving}>X</Button>
                                        </div>
                                        <Grid container direction='row'>
                                            <Grid item xs={6}>
                                                <TextField sx={{width: '95%'}} label='Nombre del alumno' variant="filled" name='name' onChange={(e) => handleOfficeClassChange(e.target.name, e.target.value)}></TextField>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField label='Número de teléfono' variant="filled" name='phoneNum' onChange={(e) => handleOfficeClassChange(e.target.name, e.target.value)}></TextField>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField label='Folio' variant="filled" name='folio' onChange={(e) => handleOfficeClassChange(e.target.name, e.target.value)}></TextField>
                                            </Grid>
                                        </Grid>
                                        <Grid container direction='row' sx={{marginTop: '20px'}}>
                                            <Grid item xs={6}>
                                                <TextField sx={{width: '95%'}} label='Contacto de emergencia' variant="filled" name='emName' onChange={(e) => handleOfficeClassChange(e.target.name, e.target.value)}></TextField>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField label='Número de emergencia' variant='filled' name='emPhone' onChange={(e) => handleOfficeClassChange(e.target.name, e.target.value)}></TextField>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField label='Relación con alumno' variant='filled' name='emRel' onChange={(e) => handleOfficeClassChange(e.target.name, e.target.value)}></TextField>
                                            </Grid>
                                        </Grid>
                                        <Grid container direction='row' sx={{marginTop: '20px'}}>
                                            <Grid item xs={6} style={{maxWidth: '90%', width: '90%'}}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Tipo de curso</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={props.officeClass.courseType}
                                                        label="Tipo de curso"
                                                        onChange={(e) =>{
                                                                // Based on the course type, we will allow the user to pick from the remaining year's weeks to schedule
                                                                let availableWeekArray = [];
                                                                let availableWeeks = 0;
                                                                for (let i = props.officeClass.weeksNum[0]; i <= 52; i++) {
                                                                    availableWeekArray.push(i);
                                                                }

                                                                (e.target.value == 'basic') ? (availableWeeks = 1)
                                                                :
                                                                (e.target.value == 'inter') ? (availableWeeks = 2)
                                                                :
                                                                (e.target.value == 'advanced') ? (availableWeeks = 4) : (availableWeeks = 0);
                                                                // Set values to props.officeClass object
                                                                props.setOfficeClass(prevState => ({
                                                                    ...prevState,
                                                                    courseType: e.target.value,
                                                                    availableWeeksArr: availableWeekArray,
                                                                    availableWeeks: availableWeeks,
                                                                    weeksNum: [props.currentWeek]
                                                                }))
                                                            }
                                                        }
                                                    >
                                                        <MenuItem value={'basic'}>Básico</MenuItem>
                                                        <MenuItem value={'inter'}>Intermedio</MenuItem>
                                                        <MenuItem value={'advanced'}>Avanzado</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3} sx={{marginLeft: '50px'}}>
                                                    <FormControlLabel control={<Switch disabled={(props.officeClass.courseType == 'basic' || props.officeClass.courseType == '')} onChange={(e, checked) => handleHourSwitch(checked)}/>} label="2 horas diarias" />
                                                </Grid>
                                            <Grid container direction='row' sx={{marginTop: '20px'}}>
                                                <Grid xs={3}>
                                                    <h3>Horarios</h3>
                                                    <Grid item sx={{height: '100px'}}>
                                                        {props.officeClass.hours.map((hour) => 
                                                            <Typography>{consts.hours[hour]}</Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6}>
                                                    <h3>Fechas</h3>
                                                    <div style={{maxHeight: '120px', overflow: 'scroll'}}>
                                                        {props.officeClass.availableWeeksArr.map(availableWeekNum => (
                                                            <div>
                                                                <Checkbox 
                                                                    sx={{display: 'inline-block'}}
                                                                    value={availableWeekNum}
                                                                    checked={props.officeClass.weeksNum.includes(availableWeekNum)}
                                                                    disabled={!props.officeClass.weeksNum.includes(availableWeekNum) && (props.officeClass.availableWeeks == props.officeClass.weeksNum.length)}
                                                                    onChange={(e) => {
                                                                        let tempWeeksNum = props.officeClass.weeksNum;
                                                                        if (e.target.checked) {
                                                                            // New checked item, add to weekNum array
                                                                            tempWeeksNum.push(Number(e.target.value));
                                                                        } else {
                                                                            // Unchecked, delete from array
                                                                            let index = tempWeeksNum.indexOf(e.target.value);
                                                                            tempWeeksNum.splice(index, 1);
                                                                        }
                                                                        props.setOfficeClass(prevState => ({
                                                                            ...prevState,
                                                                            weeksNum: tempWeeksNum
                                                                        }));
                                                                    }}
                                                                >
                                                                    </Checkbox>
                                                                <Typography sx={{display: 'inline-block', position: 'relative', top: '-5px', marginLeft: '10px'}}>{getWeekString(availableWeekNum, 2022)}</Typography>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Grid>
                                                
                                                <Grid xs={3} sx={{textAlign: 'right', alignSelf: 'flex-end'}}>
                                                    <Button 
                                                            variant='outlined'
                                                            onClick={() => manuallyRegisterSale()}
                                                        >Confirmar
                                                    </Button>
                                                </Grid>
                                                
                                                
                                            </Grid>
                                        </Grid>
                                    </div>
                                    :
                                    <div>
                                        <div style={{width: '100%'}}>
                                            <h1 style={{width: '90%', display: 'inline-block'}}>Detalles de la clase</h1>
                                            <Button variant='outlined' onClick={() => handleCloseModal()} style={{width: '10%', display: 'inline-block', cursor: 'pointer', textAlign: 'right'}}>X</Button>
                                        </div>
                                        {props.selectedClassDetails
                                        ?
                                        <Table>
                                            <TableBody>
                                                {Object.entries(props.selectedClassDetails).map(([classDetailsKey, classDetailsValue]) => (
                                                    <TableRow>
                                                        <TableCell>{classDetailsKey}</TableCell>
                                                        <TableCell
                                                        onClick={() => openWhatsApp(classDetailsKey, classDetailsValue)}
                                                        style={
                                                            (classDetailsKey == 'Número de teléfono del alumno' || classDetailsKey == 'Número del contacto de emergencia')
                                                            ?
                                                            {cursor: 'pointer', color: 'green', textDecoration: 'underline'}
                                                            :
                                                            {}
                                                        }
                                                        >{(classDetailsKey == 'Dirección' /*&& props.classStruct.address.street == ''*/)
                                                        ?
                                                        <Button onClick={() => window.open(`https://maps.google.com/?q=${classDetailsValue}`, '_blank')}>Abrir ubicación en Google Maps</Button>
                                                        :
                                                        classDetailsValue
                                                        }</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        :
                                        ''
                                        }
                                    </div>
                                }
                            </div>
                        }
                    </Box>
                </Fade>
            </Modal>
    )
}