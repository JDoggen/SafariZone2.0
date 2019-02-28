const pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.start({
    script    : 'app.js',         // Script to be run
    exec_mode : 'fork',        // Allows your app to be clustered
    instances : 1,                // Optional: Scales your app by 4
    max_memory_restart : '100M',   // Optional: Restarts your app if it reaches 100M
    max_restarts : 3,
    output : './output.log',
    error : './error.log',
    pm2_env:{
      pm_out_log_path: ''
    }
  }, function(err, apps) {
      console.log(err);
  });
});
