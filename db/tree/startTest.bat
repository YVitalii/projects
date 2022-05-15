set PORT=3033
set DEVELOPMENT=1
REM cd db/tree
nodemon --exec "mocha -c"  -w "./*"