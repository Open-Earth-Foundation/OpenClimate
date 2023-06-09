# 1.10.1 (2023-06-09)
## Fixes
- Include changelog

# 1.10.0 (2023-06-09)
## Features
- Trends widget
- Canadian emissions targets
- footer section
- emissions widget tests
## Fixes
- data in emissions widget
- target values in trends widget
- chromatic action build error

# 1.9.0 (2023-06-04)
## Features
- Great Britain subnational emissions
- CEADS cities
- CEADS provinces
- CEADS national
- unit tests for explorer components
- Matomo for API calls
- Citations
- Target value in percent_achieved_reason
- add Minx et al. (2021) v6 national emissions
- add EnergyConsumption and EnergyConsumptionBreakdown tables
- carbon monitor cities
- level cards for mobile
## Fixes
- Correct Earth data in indicator cards
- Tooltip behaviour in methodology tags
- Widget view for mobile
- show target year for all target types
- correct spelling of organization
- readability for PRIMAP data source name

## Fixes

# 1.8.0 (2023-04-11)
## Features
- pledge widget in mobile
- updated data source tags on many sources
- companies and sites in sitemaps
- contribution email in contribution doc
- completion data in pledge popover
## Fixes
- All target types should have correct text
- actorId redirect should work correctly
- test timeout raised to 30s
- change company to organization in sitemaps
- correct EPA ids
- popovers in explorer are clickable
- correct link for sitemaps in sitemap index
- change 'GHG neural' -> 'GHG neutral' in Net Zero Tracker
- change 'absolute emissions reduction' to 'absolute emission reduction'
- better path lookup for nonexistent actors
- better check for recent eligible emissions

# 1.7.3 (2023-03-28)
## Fixes
- More pledges popup merge issues

# 1.7.2 (2023-03-28)
## Fixes
- Correct country sitemap URL in sitemap index

# 1.7.1 (2023-03-28)
## Fixes
- Fixed build error in Pledges widget from merge artefact

# 1.7.0 (2023-03-28)
## Features
- Search by identifier, like ISO code or airport code
- Case-insensitive search
- Accent-insensitive search
- Sitemap index and geographical sitemap
- Data coverage query updated
- First uses of Storybook for UI (Context widget, Emissions widget)
- Import Indian state data
- Import Chinese province data
- Compression middleware for API
- Percent achieved calculation data in API
- startup script in UI creates config data for download
- Upgrade Docker and default packages to NodeJS 18.x
## Fixes
- Pledge popover shows correct reason for percent achieved calculation
- Error in emissions widget dropdown corrected
- Fix URL generation in API
- Correct units for absolute emission reductions
