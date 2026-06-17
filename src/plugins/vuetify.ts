import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Material Design 3 color system — healthcare-appropriate teal/blue palette
const md3Light = {
  dark: false,
  colors: {
    primary: '#1B6B5A',
    'on-primary': '#FFFFFF',
    'primary-container': '#A4F2DC',
    'on-primary-container': '#002019',
    secondary: '#4B635B',
    'on-secondary': '#FFFFFF',
    'secondary-container': '#CDE9DD',
    'on-secondary-container': '#072019',
    tertiary: '#406652',
    'on-tertiary': '#FFFFFF',
    'tertiary-container': '#C2ECD2',
    'on-tertiary-container': '#002112',
    error: '#BA1A1A',
    'on-error': '#FFFFFF',
    'error-container': '#FFDAD6',
    'on-error-container': '#410002',
    background: '#F5FBF7',
    'on-background': '#191C1B',
    surface: '#F5FBF7',
    'on-surface': '#191C1B',
    'surface-light': '#FFFFFF',
    'surface-variant': '#DBE5DF',
    'on-surface-variant': '#3F4944',
    outline: '#6F7974',
    'outline-variant': '#BFC9C3',
    warning: '#7D5700',
    'on-warning': '#FFFFFF',
    'warning-container': '#FFDEA6',
    success: '#006D3A',
    'on-success': '#FFFFFF',
    'success-container': '#98F7B5',
    info: '#0061A4',
    'on-info': '#FFFFFF',
    'info-container': '#D1E4FF',
  },
}

const md3Dark = {
  dark: true,
  colors: {
    primary: '#87D6C0',
    'on-primary': '#00382D',
    'primary-container': '#005143',
    'on-primary-container': '#A4F2DC',
    secondary: '#B1CDC2',
    'on-secondary': '#1D352D',
    'secondary-container': '#344C43',
    'on-secondary-container': '#CDE9DD',
    tertiary: '#A7D0B7',
    'on-tertiary': '#113726',
    'tertiary-container': '#294E3B',
    'on-tertiary-container': '#C2ECD2',
    error: '#FFB4AB',
    'on-error': '#690005',
    'error-container': '#93000A',
    'on-error-container': '#FFDAD6',
    background: '#191C1B',
    'on-background': '#E1E3E0',
    surface: '#111413',
    'on-surface': '#E1E3E0',
    'surface-light': '#1E2422',
    'surface-variant': '#3F4944',
    'on-surface-variant': '#BFC9C3',
    outline: '#89938E',
    'outline-variant': '#3F4944',
    warning: '#F5BF48',
    'on-warning': '#422D00',
    'warning-container': '#5F4200',
    success: '#7CDA9A',
    'on-success': '#00391C',
    'success-container': '#00522B',
    info: '#9ECAFF',
    'on-info': '#003258',
    'info-container': '#00497D',
  },
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'md3Light',
    themes: {
      md3Light,
      md3Dark,
    },
  },
  defaults: {
    VCard: {
      rounded: 'xl',
      elevation: 0,
      border: true,
    },
    VBtn: {
      rounded: 'pill',
      elevation: 0,
    },
    VTextField: {
      rounded: 'pill',
      variant: 'outlined',
      density: 'comfortable',
    },
    VSheet: {
      rounded: 'xl',
    },
    VChip: {
      rounded: 'pill',
    },
    VAlert: {
      rounded: 'xl',
      border: 'start',
      elevation: 0,
    },
    VTable: {
      density: 'comfortable',
    },
    VProgressLinear: {
      rounded: true,
    },
    VAvatar: {
      rounded: 'lg',
    },
    VList: {
      rounded: 'xl',
    },
  },
})
