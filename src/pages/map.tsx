// material-ui
import Grid from '@mui/material/Grid';

// third-party
import { StyleSpecification } from 'maplibre-gl';

// project-imports
import MainCard from 'components/MainCard';
import MapContainerStyled from 'components/third-party/map/MapContainerStyled';
import { countries } from 'data/location';
import ClustersMap from 'sections/maps/ClustersMap';
import DraggableMarker from 'sections/maps/DraggableMarkerMap';
import GeoJSONAnimation from 'sections/maps/GeoJSONAnimation';
import Heatmap from 'sections/maps/HeatMap';
import HighlightByFilter from 'sections/maps/HighlightByFilter';
import InteractionMap from 'sections/maps/InteractionMap';
import MarkersPopups from 'sections/maps/MarkersPopups';
import alidade_smooth_dark from 'sections/maps/map-data/alidade_smooth_dark.json';
import alidade_smooth from 'sections/maps/map-data/alidade_smooth.json';
import osm_bright from 'sections/maps/map-data/osm_bright.json';
import RegionalMap from 'sections/maps/RegionalMap';
import ThemeVariants from 'sections/maps/ThemeVariants';
import ViewportAnimation from 'sections/maps/ViewportAnimation';

export const MAPLIBRE_THEMES = {
  light: alidade_smooth as unknown as StyleSpecification,
  dark: alidade_smooth_dark as unknown as StyleSpecification,
  streets: osm_bright as unknown as StyleSpecification
};

// ==============================|| MAPLIBRE - MAP ||============================== //

export default function Map() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="Theme Variants">
          <MapContainerStyled>
            <ThemeVariants themes={MAPLIBRE_THEMES} />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Regional Map">
          <MapContainerStyled>
            <RegionalMap />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Markers & Popups">
          <MapContainerStyled>
            <MarkersPopups data={countries} />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Draggable Marker">
          <MapContainerStyled>
            <DraggableMarker />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Geo JSON Animation">
          <MapContainerStyled>
            <GeoJSONAnimation />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Clusters">
          <MapContainerStyled>
            <ClustersMap />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Interaction">
          <MapContainerStyled>
            <InteractionMap />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Viewport Animation">
          <MapContainerStyled>
            <ViewportAnimation />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Highlight By Filter">
          <MapContainerStyled>
            <HighlightByFilter />
          </MapContainerStyled>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Heatmap">
          <MapContainerStyled>
            <Heatmap />
          </MapContainerStyled>
        </MainCard>
      </Grid>
    </Grid>
  );
}
