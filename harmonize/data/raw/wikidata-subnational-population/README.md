Query for this dataset:

```
SELECT DISTINCT ?item ?iso31662 ?population ?populationYear WHERE {
  ?item wdt:P300 ?iso31662.
  { ?item p:P1082 ?st . ?st ps:P1082 ?population . ?st pq:P585 ?populationDate }
  BIND(YEAR(?populationDate) as ?populationYear) . #if available: year
  FILTER( ?populationDate >= "2017-01-01T00:00:00"^^xsd:dateTime )
}
```