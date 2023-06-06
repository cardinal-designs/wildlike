var gulp = require("gulp");
var svgstore = require("gulp-svgstore");
var inject = require("gulp-inject");
var rename = require("gulp-rename");
var path = require("path");
var fs = require("fs");

gulp.task("icons", function () {
  var svgs = gulp
    .src(
      "src/icons/**/*.svg",
      { uniqueBy: (fileInfo) => path.basename(fileInfo.path) } // only one file with that file name
    )
    .pipe(svgstore({ inlineSvg: true }));

  function fileToString(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src(["src/liquid/snippets/icon-store.liquid"])
    .pipe(inject(svgs, { transform: fileToString }))
    .pipe(gulp.dest("dist/snippets"));
});

gulp.task("icons:watch", function (done) {
  gulp.watch("src/icons/**/*", gulp.series("icons"));
  done();
});

gulp.task("icons:storybook", function () {
  var svgs = gulp
    .src(
      "src/icons/**/*.svg",
      { uniqueBy: (fileInfo) => path.basename(fileInfo.path) } // only one file with that file name
    )
    .pipe(svgstore({ inlineSvg: true }));

  function fileToString(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src([".storybook/preview-body-template.html"])
    .pipe(inject(svgs, { transform: fileToString }))
    .pipe(rename("preview-body.html"))
    .pipe(gulp.dest(".storybook"));
});

gulp.task("icons:watch:storybook", function (done) {
  gulp.watch("src/icons/**/*", gulp.series("icons:storybook"));
  done();
});
