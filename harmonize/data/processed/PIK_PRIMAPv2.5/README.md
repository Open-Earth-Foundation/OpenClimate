# PRIMAPv2.5

There appears to be something wrong with the latest year in PRIMAPv2.5.
For now we are not including 2022 data in our database.

Here is the command used to generate the `EmissionsAgg.delete.csv` file:

```sh
 awk -F ',' 'NR == 1 || $1 ~ /^PRIMAP-hist_v2\.5_final_ne:[A-Z][A-Z]:2022$/ {print $1}' EmissionsAgg.csv > EmissionsAgg.delete.csv
```