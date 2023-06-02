import React, { useState, useEffect } from "react";
import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getWeekString } from "../../helpers/helpers";
import AdminModal from "./AdminModal";
import consts from "../../consts/consts";
import axios from "axios";

export default function AdminTable (props) {
    const [displayTable, setDisplayTable] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [adminRegisterSale, setAdminRegisterSale] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedClassDetails, setSelectedClassDetails] = useState(null);
    const [weekClasses, setWeekClasses] = useState([]);
    const [officeClass, setOfficeClass] = useState(
        {
            gearBox: '', // Filled on click
            courseType: '', 
            emName: '',
            emPhone: '',
            emRel: '',
            email: '',
            folio: '',
            instructor: '', // Filled on click
            name: '',
            phoneNum: '',
            year: '',
            availableWeeks: '', // Filled on click
            availableWeeksArr: [],
            weeksNum: [], // Filled on click
            hours: [], // Filled on click
            gMapsCoords: {lng: 0, lat:0},
            address: {
                codPost: "",
                colonia: "",
                desc: "",
                entreCalles: "",
                municipio: "",
                numExt: "",
                numInt: "",
                referencias: "",
                street: ""
            }
        }
    )

    /// USE EFFECTS.............
    useEffect(() => {
        getInstructors();
    }, []);

    useEffect(() => {
        if (officeClass.gearBox != '' && openModal == false && adminRegisterSale == false) {
            setAdminRegisterSale(true);
            setOpenModal(true);
        }

        // Handle something else ...
    }, [officeClass]);

    useEffect(() => {
        getWeekClasses(props.currentWeek);
        // Format date week
        var year = new Date().getFullYear();
        var dateString = getWeekString(props.currentWeek, year);
        props.setStringWeek(dateString);
        setOfficeClass(prevState => ({
            ...prevState,
            year : year
        }));
    }, [props.currentWeek]);

    useEffect(() => {
        createTableData();
    }, [weekClasses]);

    useEffect(() => {
        props.updateData && updateData();
        props.setUpdateData(false);
    }, [props.updateData]);



    /// FUNCTIONS.......

    let updateData = () => {
        setDisplayTable(false);
        getWeekClasses(props.currentWeek);
        alert('Información actualizada.');
    }

    let getInstructors = () => {
        // Get all the available instructors
        let url = process.env.NODE_ENV == 'development' ? 'http://localhost:9000' : process.env.REACT_APP_BLL_URL;
        axios.post(`${url}/api/getAllInstructors`)
        .then(res => {
            setInstructors(res.data);
        })
        .catch(err => {
            alert('Hubo un error obteniendo a los instructores, favor de contactar a soporte, error :: ' + err);
        })
    };

    let createTableData = () => {
        // Reset table for new data
        setDisplayTable(false);
        let rows = [];

        Object.keys(consts.hours).forEach(hour => {
            // Loop between each hour to generate a row for each available hour
            let hourRow = [];
            let classesInHour = weekClasses.filter(classes => classes.hour == hour);
            instructors.forEach(instructor => {
                let classInHourFromInstructor = classesInHour.filter(clazz => clazz[instructor.INS_ID] != null)[0];
                let hourTemplate = {
                    tableValue: (classInHourFromInstructor != undefined) ? classInHourFromInstructor[instructor.INS_ID] : 'Disp.',
                    details: (classInHourFromInstructor != undefined) ? classInHourFromInstructor[instructor.INS_ID] : null,
                    insID: instructor.INS_ID
                }
                // Loop between each instructor to generate a column for each available class
                hourRow.push(hourTemplate);
            });
            rows.push(hourRow);
        });


        setTableRows(rows);
        setDisplayTable(true);
    }

    let getWeekClasses = (week) => {
        setWeekClasses([]);
        // Get the scheduled classes on the matching week
        if (week != '') {
            let url = process.env.NODE_ENV == 'development' ? 'http://localhost:9000' : process.env.REACT_APP_BLL_URL;
            axios.post(`${url}/api/getSalesByWeek`,
            {"queryWeek": `${week}`})
            .then(res => {
                setWeekClasses(res.data);
            })
            .catch(err => {
                alert('Hubo un error obteniendo las clases, favor de contactar a soporte, error :: ' + err);
            });
        }
    };

    let getClassDetails = async (folio) => {
        if (folio != null) {
            // Get class details from folio
            let classDetails = null;
            let url = process.env.NODE_ENV == 'development' ? 'http://localhost:9000' : process.env.REACT_APP_BLL_URL;
            await axios.post(`${url}/api/getUserByFolio`, {folio: folio})
            .then((res) => {
                classDetails = res.data[0];
                console.log(res.data[0]);
                // Show in modal
                let displayClassDetails = {
                    "Folio" : classDetails.folio,
                    "Dirección" : undefined /*(
                        (classDetails.address.street == '') 
                        ?
                        (`${classDetails.gMapsCoords.lat},${classDetails.gMapsCoords.lng}`)
                        :
                        (
                            String(
                                classDetails.address.street 
                            + ' '
                            + classDetails.address.numExt
                            + ' ,'
                            + classDetails.address.colonia
                            + ' ,'
                            + classDetails.address.codPost
                            )))*/,
                    "Tipo de curso" : (classDetails.courseType == 'basic' ? 'Básico' : classDetails.courseType == 'inter' ? "Intermedio" : "Avanzado"),
                    "Nombre del alumno" : classDetails.name,
                    "Número de teléfono del alumno" : classDetails.phoneNum,
                    "Contacto de emergencia" : classDetails.emName,
                    "Número del contacto de emergencia" : classDetails.emPhoneNum,
                    "Relación del contacto de emergencia" : classDetails.emRel
                }
                setOpenModal(true);
                setSelectedClassDetails(displayClassDetails);
            })
            .catch((err) => {
                console.log(err);
            })
            console.log(classDetails);
            
        }
    }

    ////// RENDER ................

    return (
        <Grid>
            <AdminModal 
                openModal={openModal} 
                setOpenModal={setOpenModal}
                selectedClassDetails={selectedClassDetails}
                setOfficeClass={setOfficeClass}
                officeClass={officeClass}
                setAdminRegisterSale={setAdminRegisterSale}
                adminRegisterSale={adminRegisterSale}
                getWeekClasses={getWeekClasses}
                currentWeek={props.currentWeek}
            />
            {(displayTable) &&
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: '90vw'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}}>Horario</TableCell>
                                {instructors.map((instructor) => (
                                    <TableCell
                                        style={instructor.GEARBOX == 'AUTO' ? 
                                            {backgroundColor: '#ADE5FF'} 
                                            :
                                            {backgroundColor: '#FAF4B2'}
                                        }
                                    >{instructor.FULL_NAME}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row, index) => {
                                return (
                                    <TableRow>
                                        <TableCell>{consts.hours[index]}</TableCell>
                                        {row.map((value, valueIndex) => (
                                            <TableCell
                                                className={
                                                    instructors[valueIndex].GEARBOX == 'AUTO'
                                                    ?
                                                    'table-cell-auto'
                                                    :
                                                    'table-cell-manual'
                                                }
                                                style={
                                                    instructors[valueIndex].GEARBOX == 'AUTO'
                                                    ?
                                                    {backgroundColor: '#e8f8ff'}
                                                    :
                                                    {backgroundColor: '#fdfbe2'}
                                                }
                                                onClick={(e) => {
                                                    if (e.target.innerText == 'Disp.') {
                                                        // Handle Admin modal to register sale
                                                        setOfficeClass(prevState => ({
                                                            ...prevState,
                                                            hours: [Number(index), (Number(index) + 1)],
                                                            weeks: [''],
                                                            weeksNum: [props.currentWeek],
                                                            instructor: instructors[valueIndex].INS_ID,
                                                            gearBox: instructors[valueIndex].GEARBOX
                                                        }))
                                                    } else {
                                                        // There's a class, show class details.
                                                        setAdminRegisterSale(false);
                                                        getClassDetails(value.details);
                                                    }
                                                    
                                                }}
                                            >{value['tableValue']}</TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })}                                   
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </Grid>
    )
}