These are the data objects for ejs

`default.js` must be present

example useage in schema:

````{
  "type":      "select",
  "id":        "bg_color",
  "label":     "Background Color",
  "options": <%- uikit.backgroundOptions -%>,
  "default": "bg-brand-primary"
}```


NOTE:
  - NOT live updating! Run `yarn start` or `yarn watch` after updating!
  - All properties in brand specific files must also exist in default
````
