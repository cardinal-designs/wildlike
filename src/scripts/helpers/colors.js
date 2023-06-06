// accepts color string as a value, then expects the type of switch
// switch types: color, background, fill
// primary switch defaults to color switch
// all switches default to black if case is not matched

export const colorSwitch = (type, color) => {

  const colorSwitch = (color) => {
    switch (color) {
      case 'primary':
        return 'color-brand-primary'
      case 'secondary':
        return 'color-brand-secondary'
      case 'accent_1':
        return 'color-accent-1'
      case 'accent_2':
        return 'color-accent-2'
      case 'accent_3':
        return 'color-accent-3'
      case 'black':
        return 'color-black'
      case 'white':
        return 'color-white'
      case 'off_black':
        return 'color-black'
      case 'greyscale_1':
        return 'color-grey'
      case 'greyscale_2':
        return 'color-off-black'
      default:
        return 'color-black'
    }
  }

  const bgSwitch = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-brand-primary'
      case 'secondary':
        return 'bg-brand-secondary'
      case 'accent_1':
        return 'bg-accent-1'
      case 'accent_2':
        return 'bg-accent-2'
      case 'accent_3':
        return 'bg-accent-3'
      case 'black':
        return 'bg-black'
      case 'white':
        return 'bg-white'
      case 'off_black':
        return 'bg-black'
      case 'off_white':
        return 'bg-white'
      case 'greyscale_1':
        return 'bg-grey'
      case 'greyscale_2':
        return 'bg-off-black'
      default:
        return 'bg-black'
    }
  }

  const fillSwitch = (color) => {
    switch (color) {
      case 'primary':
        return 'fill-brand-primary'
      case 'secondary':
        return 'fill-brand-secondary'
      case 'accent_1':
        return 'fill-accent-1'
      case 'accent_2':
        return 'fill-accent-2'
      case 'accent_3':
        return 'fill-accent-3'
      case 'black':
        return 'fill-black'
      case 'white':
        return 'fill-white'
      case 'off_black':
        return 'fill-black'
      case 'greyscale_1':
        return 'fill-grey'
      case 'greyscale_2':
        return 'fill-off-black'
      default:
        return 'fill-black'
    }
  }

  switch (type) {
    case 'color':
      return colorSwitch(color)
    case 'background':
      return bgSwitch(color)
    case 'fill':
      return fillSwitch(color)
    default:
      return colorSwitch(color)
  }
}