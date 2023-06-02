
import { CssBaseline, createTheme, ThemeProvider  } from '@mui/material';
import { UserAuthContext } from './UserAuthContext'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { green } from "@mui/material/colors";
import LandingPage from "./LandingPage"
import RequireAuth from "./RequireAuth";
import SessionPage from './SessionPage';
import {useThemeMode} from "./ThemeModeContext";
import Navbar from './Navbar';

function App() {

  let {mode} = useThemeMode();

  const theme = createTheme({
    spacing: 8,
    palette: {
      mode: mode,
      customGreen: {
        main: green[300],
        dark: green[800],
        light: green[200]
      }
    },
    typography:{
      "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
      "fontSize": 14,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
    },

  })

  return (
    <UserAuthContext>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar/>
          <Routes>
            <Route path={"/"} element={<LandingPage></LandingPage>}></Route>
            <Route path={"/session/:id"} element={<RequireAuth redirectTo={"/"}>
              <SessionPage></SessionPage>
            </RequireAuth>}></Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </UserAuthContext>
  )
}

export default App
