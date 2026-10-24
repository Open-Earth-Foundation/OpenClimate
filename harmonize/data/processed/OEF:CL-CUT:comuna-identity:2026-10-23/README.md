# Chile comuna identity crosswalk

This dataset maps all 346 official Chilean comuna CUT codes to OpenClimate
actors. It contains identity and naming data only.

`CL ATC` is a synthetic transitional actor ID for Antártica (`CL12202`). It is
not an official UN/LOCODE. All other actor IDs resolve to records in the
OpenClimate `UNLOCODE` dataset.

The generated tables are:

- `Actor.csv`: the new Antártica actor only;
- `ActorIdentifier.csv`: all 346 CUT-to-actor mappings in the `CL-CUT`
  namespace;
- `ActorName.csv`: the official Spanish comuna names;
- `Publisher.csv` and `DataSource.csv`: provenance required by the importer.

No emissions, energy, activity, or inventory data is included or referenced.

Regenerate the files from the repository root with:

```sh
python3 harmonize/scripts/process_CL_CUT_comunas.py
```
