import { ChangeEvent } from 'react';

// material-ui
import { Button, Grid, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchNormal1, Add } from 'iconsax-reactjs';

// ==============================|| SEARCH CONTAINER ||============================== //

interface SearchContainerProps {
    searchText?: string;
    buttonTitle?: string;
    isSearchable?: boolean;
    handleBtn?: () => void;
    handleSearchText: (searchText: string) => void;
}

const SearchContainer = ({ isSearchable, searchText, buttonTitle, handleSearchText, handleBtn }: SearchContainerProps) => {
    return (
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                {isSearchable && (
                    <OutlinedInput
                        size='small'
                        id="header-search"
                        sx={{ width: '100%', maxWidth: 350 }}
                        placeholder="Search"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchNormal1 size={16} />
                            </InputAdornment>
                        }
                        value={searchText}
                        onChange={(e) => handleSearchText(e.target.value)}
                    />
                )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
                {buttonTitle && (
                    <Button variant="contained" startIcon={<Add />} onClick={handleBtn}>
                        {buttonTitle}
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

export default SearchContainer;
