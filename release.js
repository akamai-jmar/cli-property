// build.js
// Very simple build script to run angular build
// Needed because all the cross platform things I tried didn't work

// No command line arguments, we're just going to use the env vars
let fs = require('fs')

let source = "bin/akamaiProperty"
let target = "akamai-property-1.0.1"

var exec = require('child-process-promise').exec;

exec(`pkg ${source} --target node8-linux-x86,node8-linux-x64,node8-win-x86,node8-win-x64,node8-macos-x64 --output ${target}`)
    .then(function (result) {
        let stdout = result.stdout;
        let stderr = result.stderr;
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
    })
    .then(() => {
      exec(`ls akamai-property\*`)
    .then(result => {
      for (let filename of result.stdout.split('\n')) {
        console.log(filename)
        let oldname = filename
        filename =filename.replace('-win-','-windows-')
        filename =filename.replace('-x64','-amd64')
        filename =filename.replace('macos','mac')
        filename =filename.replace('x86','386')
        fs.renameSync(oldname,"release/" + filename)
        require('child_process').execSync(`gpg -s -o release/${filename}.sig release/${filename}`)
      }    
    })
    .catch(function (err) {
        console.error('ERROR: ', err);
    })
  })
