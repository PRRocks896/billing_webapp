// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import ColorOptions from './ColorOptions';
import FilterChip from './FilterChip';

// types
import { ProductsFilter } from 'types/e-commerce';

function getColor(color: string) {
  return ColorOptions.filter((item: any) => item.value === color);
}

interface ProductFilterViewProps {
  filter: ProductsFilter;
  initialState: ProductsFilter;
  filterIsEqual: (initialState: ProductsFilter, filter: ProductsFilter) => boolean;
  handleFilter: (type: string, params: string, rating?: number) => void;
}

// ==============================|| PRODUCT - FILTER VIEW ||============================== //

export default function ProductFilterView({ filter, filterIsEqual, handleFilter, initialState }: ProductFilterViewProps) {
  return (
    <>
      {!filterIsEqual(initialState, filter) && (
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h5">Active Filters</Typography>
          {!(initialState.search === filter.search) && (
            <Grid>
              <FilterChip label={filter.search} onRemove={() => handleFilter('search', '')} />
            </Grid>
          )}
          {!(initialState.sort === filter.sort) && (
            <Grid>
              <Stack>
                <Typography variant="subtitle1">Sort</Typography>
                <FilterChip label={filter.sort} onRemove={() => handleFilter('sort', initialState.sort)} />
              </Stack>
            </Grid>
          )}
          {!(JSON.stringify(initialState.gender) === JSON.stringify(filter.gender)) && (
            <Grid>
              <Stack>
                <Typography variant="subtitle1">Gender</Typography>
                <Grid container sx={{ ml: '-10px' }}>
                  {filter.gender.map((item: string, index: number) => (
                    <FilterChip key={index} label={item} onRemove={() => handleFilter('gender', item)} />
                  ))}
                </Grid>
              </Stack>
            </Grid>
          )}
          {!(JSON.stringify(initialState.categories) === JSON.stringify(filter.categories)) && filter.categories.length > 0 && (
            <Grid>
              <Stack>
                <Typography variant="subtitle1">Categories</Typography>
                <Grid container sx={{ ml: '-10px' }}>
                  {filter.categories.map((item: string, index: number) => (
                    <FilterChip key={index} label={item} onRemove={() => handleFilter('categories', item)} />
                  ))}
                </Grid>
              </Stack>
            </Grid>
          )}
          {!(JSON.stringify(initialState.colors) === JSON.stringify(filter.colors)) && (
            <Grid>
              <Stack>
                <Typography variant="subtitle1">Colors</Typography>
                <Grid container sx={{ ml: '-10px' }}>
                  {filter.colors.map((item: string, index: number) => {
                    const colorsData = getColor(item);
                    return <FilterChip key={index} label={colorsData[0].label} onRemove={() => handleFilter('colors', item)} />;
                  })}
                </Grid>
              </Stack>
            </Grid>
          )}
          {!(initialState.price === filter.price) && (
            <Grid>
              <Stack>
                <Typography variant="subtitle1">Price</Typography>
                <Grid sx={{ ml: '-10px' }}>
                  <FilterChip label={filter.price} />
                </Grid>
              </Stack>
            </Grid>
          )}
          {!(initialState.rating === filter.rating) && (
            <Grid>
              <Stack>
                <Typography variant="subtitle1">Rating</Typography>
                <Grid sx={{ ml: '-10px' }}>
                  <FilterChip label={String(filter.rating)} onRemove={() => handleFilter('rating', '', 0)} />
                </Grid>
              </Stack>
            </Grid>
          )}
          <Grid>
            <Button variant="text" color="primary" sx={{ ml: '-10px' }} onClick={() => handleFilter('reset', '')}>
              Reset all filters
            </Button>
          </Grid>
          <Grid>
            <Divider sx={{ ml: '-8%', mr: '-8%' }} />
          </Grid>
        </Stack>
      )}
    </>
  );
}
