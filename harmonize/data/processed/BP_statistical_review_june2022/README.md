# BP

This datasource is outdated and has been superseded by ...

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
