"use strict";

const gulp = require("gulp"),
  sass = require("gulp-sass"),
  watch = require("gulp-watch"),
  sourcemaps = require("gulp-sourcemaps"),
  postcss = require("gulp-postcss"),
  pxtorem = require("postcss-pxtorem"),
  concat = require("gulp-concat"),
  clean = require("gulp-clean"),
  cleanCSS = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  pipeline = require("readable-stream").pipeline,
  sassvg = require("gulp-sassvg"),
  image = require("gulp-image"),
  base64 = require("gulp-base64-inline"),
  uglifyjs = require('uglify-js'),
  composer = require('gulp-uglify/composer'),
  minify = composer(uglifyjs, console);

const input = {
  sass: "./assets/src/sass/**/*.scss",
  js: "./assets/src/js/_*.js",
  svg: "./assets/src/svg/**/*.svg",
};

const output = {
  css: "./assets/dist/css",
  js: "./assets/dist/js",
  sassvg: "./assets/src/sassvg",
};

gulp.task("sass", () => {
  return gulp
    .src(input.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(postcss([pxtorem()]))
    .pipe(base64(input.inlineImages))
    .pipe(gulp.dest(output.css));
});

gulp.task("js", () => {
  return gulp
    .src(input.js)
    .pipe(sourcemaps.init())
    .pipe(concat("core.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.js));
});

gulp.task("svg", function() {
  return gulp.src(input.svg).pipe(
    sassvg({
      outputFolder: output.sassvg,
      optimizeSvg: true,
    })
  );
});

gulp.task("watch", () => {
  gulp.watch(input.sass, gulp.series("sass"));
  gulp.watch(input.js, gulp.series("js"));
  gulp.watch(input.svg, gulp.series("svg"));
});

gulp.task("clean-css", () => {
  return gulp
    .src([output.css], { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task("clean-js", () => {
  return gulp.src([output.js], { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("clean", gulp.parallel(["clean-css", "clean-js"]));

gulp.task("minify-css", () => {
  return gulp
    .src(output.css + "/core.css")
    .pipe(cleanCSS({ compatibility: "ie10" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(output.css));
});

gulp.task("minify-js", () => {
  return gulp
    .src("assets/dist/js/core.js")
    .pipe(minify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/dist/js/"));
});

gulp.task("build:dev", gulp.series("clean", "svg", "sass", "js"));

gulp.task("build:prod", gulp.series("build:dev", "minify-css", "minify-js"));

gulp.task("default", gulp.series("build:dev"));
