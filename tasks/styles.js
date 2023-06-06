var gulp = require("gulp");
var rename = require("gulp-rename");
var uglifyCSS = require("gulp-uglifycss");
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var path = require("path");
var envPath = process.env.ENV
  ? path.resolve(__dirname, "../.env." + process.env.ENV)
  : path.resolve(__dirname, "../.env");

require("dotenv").config({ path: envPath });

var stylesPath = `src/styles/theme.scss`;
var stylesDest = "dist/assets";
var storybookDest = ".storybook/dist/assets";

var sassSettings = {
  includePaths: ["node_modules"],
};

gulp.task("styles:dev", function () {
  return gulp
    .src(stylesPath)
    .pipe(sourcemaps.init())
    .pipe(sass(sassSettings).on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(rename("bvaccel.css.liquid"))
    .pipe(gulp.dest(stylesDest));
});

gulp.task("styles:prod", function () {
  return gulp
    .src(stylesPath)
    .pipe(
      sass(sassSettings).on("error", (error) => {
        throw new Error(error.message);
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(uglifyCSS())
    .pipe(rename("bvaccel.css.liquid"))
    .pipe(gulp.dest(stylesDest));
});

gulp.task("styles:watch", function (done) {
  gulp.watch(["src/styles/**/*", "src/styles/*"], gulp.series("styles:dev"));
  done();
});

gulp.task("styles:storybook", function () {
  return gulp
    .src(stylesPath)
    .pipe(sourcemaps.init())
    .pipe(sass(sassSettings).on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(rename("sb.css"))
    .pipe(gulp.dest(storybookDest));
});

gulp.task("styles:watch:storybook", function (done) {
  gulp.watch("src/styles/**/*", gulp.series("styles:storybook"));
  done();
});
