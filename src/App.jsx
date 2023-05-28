
import { UserAuthContext } from './UserAuthContext'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { green } from "@mui/material/colors";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import LandingPage from "./LandingPage"
import RequireAuth from "./RequireAuth";
import SessionPage from './SessionPage';

function App() {

  //let {mode} = useThemeMode();

  const theme = createTheme({
    spacing: 8,
    palette: {
      //mode: mode,
      customGreen: {
        main: green[300],
        dark: green[800],
        light: green[200]
      }
    }
  })

  return (
    <UserAuthContext>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />

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