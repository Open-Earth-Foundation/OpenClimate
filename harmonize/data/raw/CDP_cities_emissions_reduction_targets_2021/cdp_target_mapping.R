# DDL - Zhi Yi Yeo
# Script to remap raw CDP targets data to data model format
library(ClimActor)
library(tidyverse)


# Read in raw data 
x <- read.csv("Raw/2021_Cities_Emissions_Reduction_Targets_clean_names.csv",
              stringsAsFactors = F, encoding = "UTF-8")
# Map UN Locodes - use the ingested version in OC github
# locodes <- read.csv("../../../../OpenClimate-UNLOCODE/UNLOCODE/ActorName.csv",
#                     stringsAsFactors = F, fileEncoding = "UTF-8")
kd_lc <- read.csv("../../../key_dict_LOCODE_to_climactor.csv",
                  stringsAsFactors = F, fileEncoding = "UTF-8")
# Quick check
# length(unique(x$name))
# sum(unique(x$name) %in% locodes$name)
# sum(unique(x$name) %in% kd_lc$right)
# sum(unique(x$name) %in% kd_lc$right)
# sum(unique(x$name) %in% kd_lc$wrong)
# sum(unique(paste0(x$name, x$iso)) %in% paste0(kd_lc$right, kd_lc$iso))
# any(is.na(kd_lc$locode))

# Change data to OC schema first and incorporate updates from before

datasource_id <- "CDPCitiesTargets:2021"

# Merge in Locodes
x <- x %>% 
  left_join(kd_lc %>% select(right, iso, locode), by = c("name" = "right", 
                                                         "iso" = "iso"))
# Filter for those with only unique locodes
x <- x %>% 
  group_by(name, iso, entity_type) %>%
  mutate(num_locode = length(unique(locode))) %>%
  filter(!is.na(locode) & num_locode == 1) %>%
  filter(!is.na(Type.of.target) & Type.of.target != "No target")

Actor <- x %>% 
  select(name, entity_type, iso, locode) %>%
  rename(
    "actor_id" = locode,
    "name" = name,
    "iso" = iso,
    "type" = entity_type,
  ) %>%
  distinct()

ActorIdentifier <- x %>%
  ungroup() %>%
  select(Account.Number, locode) %>% 
  rename(
    "actor_id" = locode,
    "identifier" = Account.Number
  ) %>%
  mutate(namespace = "CDP") %>%
  distinct()

Tag <- data.frame(
  tag_id = c("BAU", "self-reported", "baseline_em", "target_em"),
  tag_name = c("Business-as-usual scenario", "Self-reported", "Baseline emissions", "Target emissions")
)

Target <- x %>%
  ungroup() %>%
  select(locode, Type.of.target, Base.year, Percentage.reduction.target, Target.year, Sector, 
         Target.boundary.relative.to.city.boundary,Target.year.absolute.emissions..metric.tonnes.CO2e.,
         Intensity.unit..Emissions.per., Estimated.business.as.usual.absolute.emissions.in.target.year..metric.tonnes.CO2e.,
         Percentage.of.target.achieved.so.far, Last.update) %>%
  mutate(target_type = case_when(Type.of.target == "Baseline scenario (business as usual) target" ~ "Relative emission reduction",
                                 Type.of.target == "Base year emissions (absolute) target" ~ "Absolute emission reduction",
                                 Type.of.target == "Base year intensity target" ~ "Carbon intensity reduction",
                                 Type.of.target == "Fixed level target" ~ "Absolute emission reduction"),
         baseline_year = case_when(target_type == "Relative emission reduction" ~ Target.year,
                                   Type.of.target == "Fixed level target" ~ NA_integer_,
                                   TRUE ~ Base.year),
         target_id = paste0(datasource_id, ":", locode),
         target_value = case_when(Type.of.target == "Fixed level target" ~ Target.year.absolute.emissions..metric.tonnes.CO2e.,
                                  TRUE ~ Percentage.reduction.target),
         target_unit= case_when(Type.of.target == "Fixed level target" ~ "tCO2e",
                                TRUE ~ "percent"),
         data_source = datasource_id) %>% 
  rename(
    "actor_id" = locode,
    "sector_list" = Sector,
    "target_year" = Target.year,
    "target_boundary" = Target.boundary.relative.to.city.boundary,
    "percent_achieved" = Percentage.of.target.achieved.so.far,
    "last_updated" = Last.update
  ) %>% 
  select(-grep("\\.", names(.))) %>%
  filter(if_all(c(target_year, target_value, baseline_year), ~!is.na(.x)))

TargetTag <- Target %>%
  mutate(self_reported = 1, 
         BAU = case_when(target_type == "Relative emission reduction" ~ 1, 
                         TRUE ~ 0)) %>%
  pivot_longer(cols = c(BAU, self_reported),
               names_to = "tag_id") %>%
  filter(value == 1) %>%
  select(target_id, tag_id)

EmissionsAgg <- x %>%
  pivot_longer(cols = c(Base.year.emissions..metric.tonnes.CO2e., 
                        Target.year.absolute.emissions..metric.tonnes.CO2e.,
                        Estimated.business.as.usual.absolute.emissions.in.target.year..metric.tonnes.CO2e.),
               names_to = "emission_type",
               values_to = "total_emissions",
               names_repair = "unique") %>%
  ungroup() %>%
  mutate(emission_type = case_when(emission_type == "Base.year.emissions..metric.tonnes.CO2e." ~ "base",
                                   emission_type == "Target.year.absolute.emissions..metric.tonnes.CO2e." ~ "target",
                                   emission_type == "Estimated.business.as.usual.absolute.emissions.in.target.year..metric.tonnes.CO2e." ~ "BAU"),
         year = case_when(emission_type == "base" ~ Base.year,
                          TRUE ~ Target.year),
         emissions_id = paste0(datasource_id, ":", emission_type, ":", locode),
         datasource_id = datasource_id,
         total_emissions = as.integer(total_emissions)) %>%
  filter(!is.na(total_emissions)) %>%
  rename("actor_id" = locode) %>%
  select(actor_id, emissions_id, emission_type, year, total_emissions, datasource_id)

EmissionsTag <- EmissionsAgg %>%
  mutate(tag_id = case_when(emission_type == "base" ~ "baseline_em",
                            emission_type == "BAU" ~ "BAU",
                            emission_type == "target" ~ "target_em")) %>%
  select(emissions_id, tag_id)

EmissionsAgg <- EmissionsAgg %>% 
  select(-emission_type)

Territory <- x %>%
  ungroup() %>%
  select(City.Location, locode) %>%
  rename("actor_id" = locode) %>%
  mutate(lat = gsub("POINT \\((.*) (.*)\\)", "\\2", City.Location), 
         lng = gsub("POINT \\((.*) (.*)\\)", "\\1", City.Location)) %>%
  select(-City.Location)

Population <- x %>%
  ungroup() %>%
  select(Population, Population.Year, locode) %>%
  rename("actor_id" = locode,
         "population" = Population,
         "population_year" = Population.Year)

Publisher <- data.frame(id = "CDP", name = "CDP",
                        url = "https://www.cdp.net/en")

DataSource <- data.frame(datasource_id = datasource_id, name = "CDP Cities Targets 2021",
                         publisher = "CDP", published = "2021", 
                         URL = "https://data.cdp.net/Mitigation-Actions/2021-Cities-Emissions-Reduction-Targets/vevx-e5s3")


write.csv(Actor, "Harmonized/Actor.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(ActorIdentifier, "Harmonized/ActorIdentifier.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(EmissionsAgg, "Harmonized/EmissionsAgg.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(EmissionsTag, "Harmonized/EmissionsTag.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(Target, "Harmonized/Target.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(TargetTag, "Harmonized/TargetTag.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(Tag, "Harmonized/Tag.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(Publisher, "Harmonized/Publisher.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(DataSource, "Harmonized/DataSource.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(Population, "Harmonized/Population.csv", 
          row.names = F, fileEncoding = "UTF-8")
write.csv(Territory, "Harmonized/Territory.csv", 
          row.names = F, fileEncoding = "UTF-8")
