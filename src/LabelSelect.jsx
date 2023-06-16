import {Autocomplete, Chip, createFilterOptions, TextField} from "@mui/material";

const filter = createFilterOptions();

function LabelSelect({value, setValue, availableTags, inputErrorMessage, maxSelect}){
    return (
        <Autocomplete
            multiple
            selectOnFocus
            filterSelectedOptions
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            getOptionDisabled={() => (value.length == maxSelect ? true : false)}
            options={availableTags}
            value={value}
            isOptionEqualToValue={(option1, option2) => option1.name === option2.name}
            getOptionLabel={option => {
                if (option.inputValue) {
                    return option.inputValue;
                }

                return option.name;
            }}
            renderTags={(value, getTagProps) => (
                value.map((option, index) => (
                    <Chip {...getTagProps({index})} label={option.value} key={index}/>
                ))
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={"Tags"}
                    InputLabelProps={{ shrink: true }}
                    error={inputErrorMessage != ""}
                    helperText={inputErrorMessage != "" ? inputErrorMessage : ""}
                />
            )}
            onChange={(event, value) => {
                setValue(value);
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // const { inputValue } = params;
                // Suggest the creation of a new value
                // const isExisting = options.some((option) => inputValue === option.name);

                // if (inputValue !== '' && !isExisting) {

                //     filtered.push({
                //         value: inputValue,
                //         name: `Add "${inputValue}"`,
                //         createdNow: true
                //     });

                // }

                return filtered;
            }}
        />
    );
}

export default LabelSelect;