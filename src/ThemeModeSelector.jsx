import {Brightness7Rounded, Brightness4Rounded} from "@mui/icons-material"
import {IconButton} from "@mui/material"
import {useThemeMode} from "./ThemeModeContext";

// light or dark only
export default function ThemeModeSelector(){
    const {mode, setMode} = useThemeMode(null);

    return (
        <IconButton sx={{ ml: 1 }} onClick={() => setMode(mode === "dark" ? "light" : "dark")} color="inherit">
            {mode === 'dark' ? <Brightness7Rounded /> : <Brightness4Rounded />}
        </IconButton>
    );
}

// export default ThemeModeSelector;