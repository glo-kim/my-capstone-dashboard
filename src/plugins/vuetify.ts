import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Material Design 3 — Maven-inspired deep green palette (WCAG AA accessible)
const md3Light = {
  dark: false,
  colors: {
    primary: '#0D4F3C',
    'on-primary': '#FFFFFF',
    'primary-container': '#D4F5E6',
    'on-primary-container': '#002114',
    secondary: '#3D6B5C',
    'on-secondary': '#FFFFFF',
    'secondary-container': '#E4F3EC',
    'on-secondary-container': '#1A2E26',
    tertiary: '#2E5E4E',
    'on-tertiary': '#FFFFFF',
    'tertiary-container': '#CBE9DA',
    'on-tertiary-container': '#0A2018',
    error: '#BA1A1A',
    'on-error': '#FFFFFF',
    'error-container': '#FFDAD6',
    'on-error-container': '#410002',
    background: '#F7FAF8',
    'on-background': '#1A1C1B',
    surface: '#F7FAF8',
    'on-surface': '#1A1C1B',
    'surface-light': '#FFFFFF',
    'surface-variant': '#E0E8E3',
    'on-surface-variant': '#414942',
    outline: '#717971',
    'outline-variant': '#C0C9C1',
    warning: '#7B5800',
    'on-warning': '#FFFFFF',
    'warning-container': '#FFEDC0',
    success: '#1B6D3E',
    'on-success': '#FFFFFF',
    'success-container': '#DCFAE4',
    info: '#0B5FAA',
    'on-info': '#FFFFFF',
    'info-container': '#D4E7FF',
  },
}

const md3Dark = {
  dark: true,
  colors: {
    primary: '#8CD9B8',
    'on-primary': '#003826',
    'primary-container': '#0D4F3C',
    'on-primary-container': '#D4F5E6',
    secondary: '#B4D1C4',
    'on-secondary': '#1F3A30',
    'secondary-container': '#2D5245',
    'on-secondary-container': '#E4F3EC',
    tertiary: '#A3CDBA',
    'on-tertiary': '#0F3626',
    'tertiary-container': '#1E4D3C',
    'on-tertiary-container': '#CBE9DA',
    error: '#FFB4AB',
    'on-error': '#690005',
    'error-container': '#93000A',
    'on-error-container': '#FFDAD6',
    background: '#111413',
    'on-background': '#E1E3E0',
    surface: '#111413',
    'on-surface': '#E1E3E0',
    'surface-light': '#1C201E',
    'surface-variant': '#414942',
    'on-surface-variant': '#C0C9C1',
    outline: '#8A938B',
    'outline-variant': '#414942',
    warning: '#F5C136',
    'on-warning': '#412D00',
    'warning-container': '#5D4200',
    success: '#7CDA9A',
    'on-success': '#003920',
    'success-container': '#005230',
    info: '#A4C9FF',
    'on-info': '#00315B',
    'info-container': '#004882',
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
      rounded: 'lg',
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
      rounded: 'lg',
    },
    VChip: {
      rounded: 'pill',
    },
    VAlert: {
      rounded: 'lg',
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
