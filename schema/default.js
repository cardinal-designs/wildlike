const json = JSON.stringify;
const backgroundOptions = [
  { label: 'None', value: '' },
  { label: 'Primary', value: 'bg-brand-primary' },
  { label: 'Secondary', value: 'bg-brand-secondary' },
  { label: 'Accent 1', value: 'bg-accent-1' },
  { label: 'Accent 2', value: 'bg-accent-2' },
  { label: 'Accent 3', value: 'bg-accent-3' },
  { label: 'Accent 4', value: 'bg-accent-4' },
  { label: 'Accent 5', value: 'bg-accent-5' },
  { label: 'White', value: 'bg-white' },
  { label: 'Light Grey', value: 'bg-light-grey' },
  { label: 'Grey', value: 'bg-grey' },
  { label: 'Off Black', value: 'bg-off-black' },
  { label: 'Black', value: 'bg-black' },
];

const grayscaleBackgroundOptions = [
  { label: 'None', value: '' },
  { label: 'White', value: 'bg-white' },
  { label: 'Light Grey', value: 'bg-light-grey' },
  { label: 'Grey', value: 'bg-grey' },
  { label: 'Off Black', value: 'bg-off-black' },
  { label: 'Black', value: 'bg-black' },
];

const colorOptions = [
  { label: 'Primary', value: 'color-brand-primary' },
  { label: 'Secondary', value: 'color-brand-secondary' },
  { label: 'Accent 1', value: 'color-accent-1' },
  { label: 'Accent 2', value: 'color-accent-2' },
  { label: 'Accent 3', value: 'color-accent-3' },
  { label: 'Accent 4', value: 'color-accent-4' },
  { label: 'Accent 5', value: 'color-accent-5' },
  { label: 'White', value: 'color-white' },
  { label: 'Light Grey', value: 'color-light-grey' },
  { label: 'Grey', value: 'color-grey' },
  { label: 'Off Black', value: 'color-off-black' },
  { label: 'Black', value: 'color-black' },
];

const grayscaleColorOptions = [
  { label: 'White', value: 'color-white' },
  { label: 'Light Grey', value: 'color-light-grey' },
  { label: 'Grey', value: 'color-grey' },
  { label: 'Off Black', value: 'color-off-black' },
  { label: 'Black', value: 'color-black' },
];

const fillOptions = [
  { label: 'Primary', value: 'fill-brand-primary' },
  { label: 'Secondary', value: 'fill-brand-secondary' },
  { label: 'Accent 1', value: 'fill-accent-1' },
  { label: 'Accent 2', value: 'fill-accent-2' },
  { label: 'Accent 3', value: 'fill-accent-3' },
  { label: 'Accent 4', value: 'fill-accent-4' },
  { label: 'Accent 5', value: 'fill-accent-5' },
  { label: 'White', value: 'fill-white' },
  { label: 'Light Grey', value: 'fill-light-grey' },
  { label: 'Grey', value: 'fill-grey' },
  { label: 'Off Black', value: 'fill-off-black' },
  { label: 'Black', value: 'fill-black' },
];

const grayscaleFillOptions = [
  { label: 'White', value: 'fill-white' },
  { label: 'Light Grey', value: 'fill-light-grey' },
  { label: 'Grey', value: 'fill-grey' },
  { label: 'Off Black', value: 'fill-off-black' },
  { label: 'Black', value: 'fill-black' },
];

const borderOptions = [
  { label: 'Primary', value: 'border-brand-primary' },
  { label: 'Secondary', value: 'border-brand-secondary' },
  { label: 'Accent 1', value: 'border-accent-1' },
  { label: 'Accent 2', value: 'border-accent-2' },
  { label: 'Accent 3', value: 'border-accent-3' },
  { label: 'Accent 4', value: 'border-accent-4' },
  { label: 'Accent 5', value: 'border-accent-5' },
  { label: 'White', value: 'border-white' },
  { label: 'Light Grey', value: 'border-light-grey' },
  { label: 'Grey', value: 'border-grey' },
  { label: 'Off Black', value: 'border-off-black' },
  { label: 'Black', value: 'border-black' },
];

const grayscaleBorderOptions = [
  { label: 'White', value: 'border-white' },
  { label: 'Light Grey', value: 'border-light-grey' },
  { label: 'Grey', value: 'border-grey' },
  { label: 'Off Black', value: 'border-off-black' },
  { label: 'Black', value: 'border-black' },
];

const buttonOptions = [
  { label: 'Primary Button', value: 'button button--primary' },
  { label: 'Default Button', value: 'button button--secondary' },
];

const linkOptions = [
  { label: 'Primary Text Link', value: 'link link--primary' },
  { label: 'Secondary Text Link', value: 'link link--secondary' },
];

const buttonAndLinkOptions = [...buttonOptions, ...linkOptions];

const linkTargetOptions = [
  { label: 'Current Tab', value: '_self' },
  { label: 'New Tab', value: '_blank' },
];

module.exports = {
  uikit: {
    backgroundOptions: json(backgroundOptions),
    grayscaleBackgroundOptions: json(grayscaleBackgroundOptions),
    colorOptions: json(colorOptions),
    grayscaleColorOptions: json(grayscaleColorOptions),
    fillOptions: json(fillOptions),
    grayscaleFillOptions: json(grayscaleFillOptions),
    buttonOptions: json(buttonOptions),
    grayscaleBorderOptions: json(grayscaleBorderOptions),
    linkOptions: json(linkOptions),
    buttonAndLinkOptions: json(buttonAndLinkOptions),
    borderOptions: json(borderOptions),
  },
  linkTargetOptions: json(linkTargetOptions),
};
