import React from "react";
import { Grid, 
    Typography,
    Button,
    Pagination,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

// import AdminLogin from "./AdminLogin";
// import AdminTable from "./AdminTable";


export default function AdminView (props) {
    const [stringWeek, setStringWeek] = useState('');
    const [updateData, setUpdateData] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [login, setLogin] = useState(false);

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    useEffect(() => {
        getToday();
        checkLoginCookie();
    }, []);


    let checkLoginCookie = () => {
        let adminLogguedIn = getCookie('adminLogin');
        (adminLogguedIn == 'true') && setLogin(true);
    }

    let getCookie = (cname) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    let getToday = () => {
        let today = new Date();
        let thisWeek = new Date(today).getWeek();
        setCurrentWeek(thisWeek);
    }

    let handleNewWeek = (e, page) => {
        console.log(page);
        setCurrentWeek(page);
    }

    Date.prototype.getWeek = function() {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                              - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    let CustomPagination = () => {
        return (
            <Stack spacing={0} sx={{width: '100%'}}>
                        <Pagination 
                            count={52} 
                            color="secondary" 
                            size='medium'
                            boundaryCount={52}
                            defaultPage={currentWeek}
                            onChange={(e, page) => handleNewWeek(e, page)}
                            />
                    </Stack>
        )
    }

    return (
        <Grid sx={{margin: '10px 20px'}}>
            {
                login
                ?
                <h1>HelloWorld</h1>
                // <Grid container>
                //     <Grid item style={{display: 'block'}} xs={12}>
                //         <Grid container direction='row'>
                //             <Grid xs={8} style={{textAlign: 'left'}}>
                //             <Button 
                //                     variant='outlined'
                //                     style={{margin: '5px', display: 'inline-block'}}
                //                     onClick={(e) => getToday()}
                //                 >
                //                     {'Hoy'}
                //                 </Button>
                //             <Button 
                //                     variant='outlined'
                //                     style={{margin: '5px', display: 'inline-block'}}
                //                     onClick={(e) => setCurrentWeek(currentWeek - 1)}
                //                 >
                //                     {'<'}
                //                 </Button>
                //                 <Button 
                //                     variant='outlined'
                //                     style={{margin: '5px', display: 'inline-block'}}
                //                     onClick={(e) => setCurrentWeek(currentWeek + 1)}
                //                 >
                //                     {'>'}
                //                 </Button>
                //                 <Typography
                //                     style={{display: 'inline-block', marginLeft: '30px', fontSize: '18px', fontWeight: 'bold'}}
                //                 >{stringWeek}</Typography>
                //             </Grid>
                //             <Grid xs={4}>
                //                 <Button
                //                     variant='outlined'
                //                     sx={{float: 'right'}}
                //                     onClick={() => setUpdateData(true)}
                //                 >
                //                     Actualizar
                //                 </Button>
                //             </Grid>
                //         </Grid>
                //     </Grid>
                //     <Grid item sx={{margin: '30px 0px'}}>
                //         {/* <AdminTable 
                //             currentWeek={currentWeek} 
                //             setStringWeek={setStringWeek} 
                //             updateData={updateData} 
                //             setUpdateData={setUpdateData}
                //         /> */}
                //     </Grid>
                // </Grid>
                :
                <h1>Hello World 2</h1>// <AdminLogin setLogin={setLogin}></AdminLogin>
            }
        </Grid>
    )
}