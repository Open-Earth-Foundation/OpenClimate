# OpenClimate Data

This directory contains processed data imported in to the OpenClimate database, as well as the raw data and the processing scripts. The processing scripts harmonize the raw data to conform to the [OpenClimate schema](https://github.com/Open-Earth-Foundation/OpenClimate-Schema).

## Directory Structure

```
.
├── LICENSE           <-- project License file 
├── Pipfile           <-- used by pipenv to manage dependences
├── README.md         <-- top-level project description
├── data/             <-- raw and processed data
│   ├── processed/    <-- processed data, ready for databast ingestion
│   └── raw/          <-- raw/unprocessed data
├── resources/        <-- any additional resources (e.g. climActor dictionaries)
└── scripts/          <-- scripts to process raw data
```

## Help us find data
If you know of any data sources relevant to OpenClimate, please open an issue and let us know how we can access the data. 