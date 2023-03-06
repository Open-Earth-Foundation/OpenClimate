# README.md

This data was extracted from Wikidata on 16 Feb 2023.

```
#List of countries in UN languages
SELECT ?country ?iso31661 ?label_en ?label_ru ?label_ar ?label_fr ?label_es ?label_zh
WHERE
{
    ?country wdt:P297 ?iso31661.
	?country rdfs:label ?label_en filter (lang(?label_en) = "en").
	?country rdfs:label ?label_ru filter (lang(?label_ru) = "ru").
	?country rdfs:label ?label_ar filter (lang(?label_ar) = "ar").
	?country rdfs:label ?label_fr filter (lang(?label_fr) = "fr").
	?country rdfs:label ?label_es filter (lang(?label_es) = "es").
	?country rdfs:label ?label_zh filter (lang(?label_zh) = "zh").
}
```