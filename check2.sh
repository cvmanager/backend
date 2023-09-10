#!/bin/bash

# Run the command and capture the output
output=$(docker exec cv_app npm run test 2>&1)
# Get the exit code
exit_code=$?
# Get the execution time in seconds
start_time=$(date +%s)
end_time=$(date +%s)
duration=$((end_time - start_time))

# Format the output as JUnit XML
cat <<EOF > report.xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="tests" tests="1" failures="$((exit_code != 0 ? 1 : 0))" errors="0" skipped="0" time="$duration">
  <testcase name="jtest" classname="tests" time="$duration">
    $(if [ $exit_code != 0 ]; then echo "<failure message=\"Command failed with exit code $exit_code\">$output</failure>"; fi)
    <system-out>$output</system-out>
  </testcase>
</testsuite>
EOF
