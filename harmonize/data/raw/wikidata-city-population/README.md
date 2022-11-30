# Dataset

Extracted from Wikidata on 6 Nov 2022 by Evan Prodromou <evan@openearth.org>

# Source

Query that generated this dataset:

```
SELECT DISTINCT ?item ?locode ?population ?populationYear WHERE {
  ?item wdt:P1937 ?locode.
  { ?item p:P1082 ?st . ?st ps:P1082 ?population . ?st pq:P585 ?populationDate }
  BIND(YEAR(?populationDate) as ?populationYear) . #if available: year
}
```