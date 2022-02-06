trap "kill 0" EXIT

BROWSER=none react-scripts start &
npx cypress run
