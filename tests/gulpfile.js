let gulp = require("gulp");
let ts = require("gulp-typescript");

gulp.task('src', function () {

    let tsProject = ts.createProject("./tsconfig.json", {typescript: require('typescript')});

    return gulp.src("src/**/*.ts")
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['src']);