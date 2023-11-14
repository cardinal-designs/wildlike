var gulpif = require("gulp-if");
var gulp = require("gulp");
var flatten = require("gulp-flatten");
var changed = require("gulp-changed");
var watch = require("gulp-watch");
var path = require("path");
var ejs = require("gulp-ejs");
var _ = require("lodash");
var defaultData = require("../schema/default.js");

function isAccountTemplate(file) {
  return file.path.includes("templates/customers");
}

function isLiquidOrJSON(file) {
  return /\.(liquid|json)/.test(file.path);
}

gulp.task("copy", function () {
  return gulp
    .src(["src/liquid/**/*", "!src/liquid/config/settings_data.json", "!src/liquid/templates/*.json", "!src/liquid/templates/**/*.json"])
    .pipe(
      gulpif(
        isAccountTemplate,
        flatten({ includeParents: 2 }),
        flatten({ includeParents: 1 })
      )
    )
    .pipe(gulpif(isLiquidOrJSON, ejs(defaultData)))
    .pipe(changed("dist/", { hasChanged: changed.compareContents }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("copy:watch", function (done) {
  watch(["src/liquid/**/*", "!src/liquid/config/settings_data.json", "!src/liquid/templates/*.json", "!src/liquid/templates/**/*.json"])
    .pipe(
      gulpif(
        isAccountTemplate,
        flatten({ includeParents: 2 }),
        flatten({ includeParents: 1 })
      )
    )
    .pipe(gulpif(isLiquidOrJSON, ejs(defaultData)))
    .pipe(changed("dist/", { hasChanged: changed.compareContents }))
    .pipe(gulp.dest("dist/"));

  done();
});

gulp.task("copy:storybook", function () {
  return gulp
    .src(["src/liquid/assets/*"])
    .pipe(
      gulpif(
        isAccountTemplate,
        flatten({ includeParents: 2 }),
        flatten({ includeParents: 1 })
      )
    )
    .pipe(gulpif(isLiquidOrJSON, ejs(defaultData)))
    .pipe(
      changed(".storybook/dist/assets/", {
        hasChanged: changed.compareContents,
      })
    )
    .pipe(gulp.dest(".storybook/dist/assets/"));
});

gulp.task("copy:watch:storybook", function (done) {
  watch(["src/liquid/assets/*"])
    .pipe(
      gulpif(
        isAccountTemplate,
        flatten({ includeParents: 2 }),
        flatten({ includeParents: 1 })
      )
    )
    .pipe(gulpif(isLiquidOrJSON, ejs(defaultData)))
    .pipe(
      changed(".storybook/dist/assets/", {
        hasChanged: changed.compareContents,
      })
    )
    .pipe(gulp.dest(".storybook/dist/assets/"));

  done();
});
