// helps with aligning text dynamically based upon section settings
// self explanatory

export const textAlignSwitch = (position) => {
  switch (position) {
    case 'left':
      return 'text-left'
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
}