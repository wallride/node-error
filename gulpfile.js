let fs = require('fs');
let gulp = require("gulp");
let ts = require("gulp-typescript");

let packageJson = JSON.parse( fs.readFileSync('./package.json').toString() );

gulp.task('src', function () {
    let merge = require('merge2');

    let tsProject = ts.createProject("./tsconfig.json", {typescript: require('typescript')});

    let result = gulp.src("src/**/*.ts")
        .pipe(tsProject());

    return merge([
        result.dts.pipe(gulp.dest('./build')),
        result.js.pipe(gulp.dest('./build'))
    ]);
});

gulp.task('package', ['src'], function () {
    require('dts-bundle').bundle({
        name: packageJson.name, //'@ips.su/fsm',
        out: 'module.d.ts',
        main: './build/index.d.ts'
    });
});

gulp.task('default', ['package']);