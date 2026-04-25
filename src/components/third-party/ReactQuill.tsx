// material-ui
import Box, { BoxProps } from '@mui/material/Box';

// third-party
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
  value?: string;
  borderRadius?: number;
  editorMinHeight?: number;
  onChange?: (value: string) => void;
  placeholder?: string;
  sx?: BoxProps['sx'];
  modules?: any;
}

// ==============================|| QUILL EDITOR ||============================== //

export default function ReactQuillDemo({
  value,
  editorMinHeight = 180,
  onChange,
  placeholder = 'Write something...',
  borderRadius,
  sx = {},
  modules
}: Props) {
  const editorRadius = borderRadius || 8;

  return (
    <Box
      sx={[
        (theme) => ({
          borderRadius: editorRadius,
          '& .quill': {
            '& .ql-toolbar': {
              bgcolor: 'secondary.lighter',
              borderColor: 'secondary.300',
              borderTopLeftRadius: editorRadius,
              borderTopRightRadius: editorRadius,
              ...theme.applyStyles('dark', { bgcolor: 'secondary.400', borderColor: 'secondary.400' }),
              '&.ql-snow': {
                // toolbar - picker & it's options styling
                '& .ql-picker': {
                  height: 26,
                  '& .ql-picker-label': {
                    p: 0.5,
                    pt: 0.25,
                    borderRadius: 0.5,
                    border: 0,
                    ...theme.applyStyles('dark', { color: theme.vars.palette.secondary[200] }),
                    '& svg': { right: 0, left: 'unset' },
                    '&.ql-active, &:hover, &:focus': {
                      bgcolor: 'secondary.light',
                      color: theme.vars.palette.text.primary,
                      '& svg > path, & svg > line, & svg > rect, & svg > circle, & svg > polygon': {
                        color: theme.vars.palette.text.primary,
                        stroke: theme.vars.palette.text.primary
                      }
                    }
                  },
                  '& .ql-picker-options': {
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    '& .ql-picker-item': { '&:hover': { color: theme.vars.palette.primary.main } }
                  },
                  '&.ql-expanded': {
                    '& .ql-picker-label': {
                      color: 'secondary.dark',
                      'svg .ql-stroke': { stroke: theme.vars.palette.secondary.dark },
                      ...theme.applyStyles('dark', {
                        borderColor: 'secondary.200',
                        color: 'background.paper',
                        'svg .ql-stroke': { stroke: theme.vars.palette.background.paper }
                      })
                    },
                    '& .ql-picker-options': { borderColor: 'secondary.200', borderRadius: 1, color: 'secondary.main' }
                  }
                },

                // toolbar - button styling
                '& button': {
                  width: 26,
                  height: 26,
                  mr: 0.5,
                  p: 0.5,
                  borderRadius: 0.5,
                  ...theme.applyStyles('dark', {
                    '& .ql-stroke': { stroke: theme.vars.palette.secondary[200] },
                    '& .ql-fill': { fill: theme.vars.palette.secondary[200] }
                  }),
                  '&.ql-active, &:hover, &:focus': {
                    '& .ql-stroke': { stroke: theme.vars.palette.text.primary },
                    '& .ql-fill': { fill: theme.vars.palette.text.primary },
                    bgcolor: 'secondary.light'
                  }
                }
              }
            },

            // content - styling
            '& .ql-container': {
              borderColor: 'secondary.300',
              borderBottomLeftRadius: editorRadius,
              borderBottomRightRadius: editorRadius,
              ...theme.applyStyles('dark', { borderColor: 'secondary.200' }),
              '& .ql-editor': {
                minHeight: editorMinHeight,
                textAlign: 'left',
                '&.ql-blank::before': {
                  color: 'secondary.300',
                  fontStyle: 'unset',
                  opacity: 0.6,
                  ...theme.typography.body2,
                  ...theme.applyStyles('dark', { color: 'secondary.400' })
                }
              }
            }
          }
        }),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      <ReactQuill 
        {...(value && { value })} 
        {...(onChange && { onChange })} 
        {...(modules && { modules })}
        placeholder={placeholder} 
      />
    </Box>
  );
}
