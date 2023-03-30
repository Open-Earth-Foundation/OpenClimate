# How to contribute data

OpenClimate includes data contributions from many different publishers and data sources. The better our data coverage, the more useful the tool is to policy makers and the public. We welcome contributions of data from researchers, governments, and open data advocates worldwide.

## Identify a data source

The first step to making a contribution is identifying the data source.

### What kind of data is needed

OpenClimate includes information about these kinds of actors:

- Countries
- States or provinces
- Cities
- Companies
- Facilities

It includes this kind of data, current and historical:

- Greenhouse gas emissions
- Land reservations
- Emissions reductions targets
- Contextual data about territories (population, GDP, coordinates, area)
- Contextual data about companies (location, number of employees, revenue)

The coverage is global.

### Check data rights

Data rights are tricky! Typically, sharing factual information is not protected by copyright, but some modified data can be, as well as a collection of factual data. OpenClimate appreciates the work that goes into these data sets, and we want to respect the creators.

When deciding whether it's OK to share a data set, here are some good questions to ask:

- Is the data explicitly marked as free to re-use?
- Is the data explicitly marked as *not* free to re-use?
- Was the data created or shared by a government agency?
- Did you have to pay for the data?
- Did you have to log in somewhere to get the data?

If you're in doubt, you can consult with the data publisher or the OpenClimate data team.

### Check that it hasn't already been included

We have included 30 data sets from various agencies and researchers already, with about 25 more in our queue. If you'd like to check whether the data set you've identified has already been imported, check [OpenClimate](https://openclimate.network/) . You can search for a few example actors, like a city or a region, and check if the relevant data is empty, or if the data source is marked.

In case it's not clear, you can check the [harmonize](https://github.com/Open-Earth-Foundation/OpenClimate/tree/main/harmonize) directory for data sets that have already been imported.

## Sending a link

If you identify data that should be in OpenClimate, and you don't have the skills or time to import it, please send us an email at openclimate-data@openearth.org. We'll queue it up for import.

## Obtaining the data

It's easiest to input data that's in a file format made for data interchange. If you have an option, choose these file formats in descending order of usefulness:

- Comma-separated values (CSV)
- Tab-separated values or other delimiters
- JSON
- Excel or other spreadsheet formats
- XML
- HTML or other text-based formats
- PDF, Microsoft Word, or other binary document formats
- JPEG, PNG, or other image formats

When you're collecting data, it's also very useful to obtain an URL for the location and description of the data, and any publisher information, publication dates or other publication metadata.

Data files over 25Mb require special handling.

## (Optional) convert to OpenClimate import format

OpenClimate has tools to import data directly into our database using a specific file format. In this format, each data source is in a separate directory. Each table in our [schema](https://github.com/Open-Earth-Foundation/OpenClimate-Schema) has its own CSV file, with columns matching the database columns.

If you can convert your data set into this format, it can make it much more likely that the data gets imported quickly.

Ideally, you should also include the raw data and any tools (like Python or R scripts) you used to transform the data.

## Create a pull request (PR)

To submit your data, you should create a pull request (PR) on the OpenClimate GitHub repository.

### If you're used to GitHub flow

[Github flow](https://docs.github.com/en/get-started/quickstart/github-flow) is a technique for making contributions to OpenClimate.

When you make your PR, remember to include the following information:

- Put the unprocessed data in its own sub-directory `harmonize/data/raw`
- Put any contextual data, such as publication metadata, in a `README.md` file in the same directory.
- (Optional) If you've converted the data to OpenClimate import format, add it to its own
  sub-directory of `harmonize/data/processed`. Ideally, use the same sub-directory name as for the
  unprocessed data!
- (Optional) If you used a script for converting the raw data to OpenClimate import format,
  add that script to the `harmonize/scripts` sub-directory.

### If you're not used to Git flow

You'll still need a [GitHub](https://github.com/) account.

- In a browser, go to [the raw data directory on GitHub](https://github.com/Open-Earth-Foundation/OpenClimate/tree/develop/harmonize/data/raw) .
- Click "Add files...", then "Upload files".
- Choose the files you want to add.
- In the "commit changes" dialog box, add the information about the data set, including the
  publisher, publication date, source URL, and re-distribution restrictions if any.
- Choose "Create a new branch".
- Click "Propose changes"
- In the "Open a pull request" screen, give a brief overview of your changes.
- Click "Create pull request".

There may be some updates on your changes; you should get notified directly by GitHub.
