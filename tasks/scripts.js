var gulp = require("gulp");
var rename = require("gulp-rename");
var webpack = require("webpack-stream");
var path = require("path");
var envPath = path.resolve(__dirname, "../.env");

require("dotenv").config({ path: envPath });

var webpackDev = require("../webpack.dev.js");
var webpackProd = require("../webpack.prod.js");

var scriptsPath = "src/scripts/bvaccel.js";
var scriptsDest = "dist/assets";

function clearCacheString(file) {
  if (file.extname.indexOf("?") !== -1) {
    file.extname = file.extname.split("?")[0];
  }

  return file;
}

gulp.task("scripts:dev", function (done) {
  return gulp
    .src(scriptsPath)
    .pipe(webpack(webpackDev))
    .pipe(rename((file) => clearCacheString(file)))
    .on("error", (err) => done(err))
    .pipe(gulp.dest(scriptsDest))
    .on("end", () => done());
});

gulp.task("scripts:prod", function (done) {
  gulp
    .src(scriptsPath)
    .pipe(webpack(webpackProd))
    .pipe(rename((file) => clearCacheString(file)))
    .on("error", (err) => done(err))
    .pipe(gulp.dest(scriptsDest))
    .on("end", () => done());
});

gulp.task("scripts:watch", function (done) {
  gulp.watch(
    [
      "src/scripts/**/*",
      "src/styles/boilerplate.scss",
      `src/styles/variables.scss`,
      "src/styles/tools/*.scss",
    ],
    gulp.series("scripts:dev")
  );
  done();
});
