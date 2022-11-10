# Dataset

Extracted from Wikidata on 6 Nov 2022 by Evan Prodromou <evan@openearth.org>

SPARQL query is:

```

#title: Cities with areas in km2
SELECT DISTINCT ?city ?locode ?area
WHERE
{
  ?city p:P1937 ?statement0 .
  ?statement0 (ps:P1937) ?locode .

  ?city p:P2046 ?statement1 .
  ?statement1 a wikibase:BestRank .

  ?statement1    psv:P2046                   ?valuenode.
  ?valuenode     wikibase:quantityAmount     ?raw_area.
  ?valuenode     wikibase:quantityUnit       ?unit.

  # conversion to SI unit
  ?unit          p:P2370                 ?unitstmnode.   # conversion to SI unit
  ?unitstmnode   psv:P2370               ?unitvaluenode.
  ?unitvaluenode wikibase:quantityAmount ?conversion.
  ?unitvaluenode wikibase:quantityUnit   wd:Q25343.      # square meter
  BIND(?raw_area * ?conversion AS ?area_in_m2).
  BIND(?area_in_m2 * 1e-6 AS ?area).

}
ORDER BY ?city
```