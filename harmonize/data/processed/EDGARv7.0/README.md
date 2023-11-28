# EDGARv7.0

This datasource is outdated and superseded by version 8.0

The following commands were used to generate the `*.delete.csv` files

### EmissionsAgg.delete
```sh
awk -F ',' 'NR == 1 || $1 {print $1}' EmissionsAgg.csv > EmissionsAgg.delete.csv
```

### DataSource.delete
```sh
awk -F ',' 'NR == 1 || $1 {print $1}' DataSource.csv > DataSource.delete.csv
```


### DataSourceTag.delete

```sh
cat DataSourceTag.csv > DataSourceTag.delete.csv
```


### EmissionsBySector.delete

```sh
awk -F ',' 'BEGIN {OFS = ","} {print $1, $2}' EmissionsBySector.csv > EmissionsBySector.delete.csv
```