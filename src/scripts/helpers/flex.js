// helps with aligning content in a standard flex row container
// type requires either 'align' or 'justify'
// position requires the string equal to the switch cases below, build theme settings accordingly

export const flexSwitch = (type, position) => {
  const alignSwitch = (position) => {
    switch (position) {
      case 'top':
        return 'flex-align-start'
      case 'middle':
        return 'flex-align-center'
      case 'bottom':
        return 'flex-align-end'
      case 'left':
        return 'flex-align-start'
      case 'center':
        return 'flex-align-center'
      case 'right':
        return 'flex-align-end'
      default:
        return 'flex-align-start'
    }
  }
  const justifySwitch = (position) => {
    switch (position) {
      case 'left':
        return 'flex-justify-start'
      case 'center':
        return 'flex-justify-center'
      case 'right':
        return 'flex-justify-end'
      case 'top':
        return 'flex-justify-start'
      case 'middle':
        return 'flex-justify-center'
      case 'bottom':
        return 'flex-justify-end'
      default:
        return 'flex-justify-start'
    }
  }
  switch (type) {
    case 'align':
      return alignSwitch(position)
    case 'justify':
      return justifySwitch(position)
    default:
      return alignSwitch(position)
  }
}