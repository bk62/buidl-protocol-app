import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = {
  mono: `'Menlo', monospace`,
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`
}

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const Card = {
  baseStyle: ({ colorMode }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderWidth: "1 px",
    rounded: "base",
    shadow: "md",
    bg: "bg.1",
    color: "text",
    width: "full",
  }),
  variants: {
    simple: {},
    gradient: ({ colorMode }) => ({
      bg: colorMode === "light" ?
        "white" :
        "linear-gradient(160deg, rgba(74,85,104,1) 20%, rgba(45,55,72,1) 70%)",
    }),
  },
  defaultProps: {
    variant: "simple",
  }
}

const CardHeader = {
  baseStyle: {
    d: "flex",
    width: "full",
    flexDirection: "column",
  }
}

const CardContent = {
  baseStyle: {
    d: "flex",
    width: "full",
    flexDirection: "column",
  }
}

const theme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: 'gray.900',
        _dark: 'gray.100',
      },
      "text.50": {
        default: 'gray.600',
        _dark: 'gray.400'
      },
      "text.100": {
        default: 'gray.700',
        _dark: 'gray.50'
      },
      "text.200": {
        default: 'gray.500',
        _dark: 'gray.400'
      },
      "text.300": {
        default: 'gray.500',
        _dark: 'gray.200'
      },
      "text.cta": {
        default: "teal.500",
        _dark: "teal.200"
      },
      "text.cta.hover": {
        default: "teal.400",
        _dark: "teal.100"
      },
      "bg.0": {
        default: 'gray.50',
        _dark: 'inherit',
      },
      "bg.1": {
        default: 'gray.200',
        _dark: 'gray.600'
      },
      "bg.2": {
        default: 'white',
        _dark: 'gray.700'
      },
      "bg.submit": {
        default: "gray.50",
        _dark: "gray.900"
      },
      "bg.dashboard": {
        default: 'white',
        _dark: 'gray.800',
      },
      error: "red.500",
      success: "green.50",
      primary: {
        default: "red.500",
        _dark: "red.400"
      },
      secondary: {
        default: "red.800",
        _dark: "red.700"
      }
    }
  },
  colors: {
    black: '#16161D'
  },
  fonts,
  breakpoints,
  config: {
    initialColorMode: "light"
  },
  components: {
    Card,
    CardHeader,
    CardContent,
  }
})

export default theme
