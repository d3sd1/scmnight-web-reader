var gulp = require('gulp'),
        electron = require('electron');
var packager = require('electron-packager');
var exec = require('child_process').exec;
gulp.task('default', function () {
    
});
gulp.task('compile_web', function () {
    exec('ng build --prod', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});
gulp.task('compile_', function () {
    packager({
        dir: ".",
        name: "SCM",
        platform: "win32",
        arch: "x64",
        version: "1.7.12",
        out: "output/SO_FINAL",
        overwrite: true,
        asar: true
    }, function done(err, appPath) {
        console.log("DONE, path: " + appPath);
    })
});
