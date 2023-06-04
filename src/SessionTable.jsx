import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useAuth } from './UserAuthContext';
import { fetchSessionsSnapshot } from './services/fetchSessionsSnapshot';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  

export default function SessionTable() {
  const [sessions, setSessions] = useState([])
  const { user}  = useAuth();
  let navigate = useNavigate();
    //   console.log("sessionsss")
    //   console.log(sessions)

    // sessions?.forEach(_session => {
    //     dat.push(_session)
    // });


    useEffect( () => {
        if(user == null)
          return;

        // fetch sessions for user
        fetchSessionsSnapshot(user.id, (_querySnapshot) => {
          setSessions(_querySnapshot.docs.map(_doc => ({id: _doc.id, data: _doc.data()})));
      });
    }, [user])


    useEffect(() => {
      console.log(sessions)
    
      return () => {
        null
      }
    }, [sessions])
    
    
    const goToSession = (_sessionID) => {
      navigate("/session/" + _sessionID);
    }

    return (
        // <TableContainer component={Paper} sx={{mt:2}}>
          <Paper version="outlined" sx={{ minWidth: 350}}>
            <Table sx={{ minWidth: "xs"}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions?.map(_session => (
                <TableRow
                  key={_session.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {/* <TableCell component="th" scope="row">
                    {_session.created}
                  </TableCell> */}
                  <TableCell align="left"><Button onClick={() => goToSession(_session.id)}>{_session.id}</Button></TableCell>
                  <TableCell align="right">{new Date(_session.data.created.seconds * 1000).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Paper>
        // </TableContainer>
      );
}
