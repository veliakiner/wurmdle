# Helper script for running Cypress tests against app without having to start the app separately

BROWSER=none react-scripts start&
APP_PID=$!


cleanup () {
    pkill -P $APP_PID
    exit $EXIT_CODE
}

trap cleanup EXIT

npx cypress run
EXIT_CODE=$?
