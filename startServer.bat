set PORT=3033
set DEVELOPMENT=1
supervisor --no-restart-on exit -i ./db/tree/test --program ./bin/www