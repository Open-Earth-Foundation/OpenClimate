import concurrent.futures
import pandas as pd
from pathlib import Path
import requests


def concurrent_executor(func):
    """decorator to make concurrent futures"""

    def wrapper(*args, **kwargs):
        if isinstance(args[0], str):
            args = ([args[0]],)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(func, *args, **kwargs))
        return results

    return wrapper


def is_numeric(s):
    try:
        float(s)
        return True
    except ValueError:
        return False


def df_wide_to_long(df=None, value_name=None, var_name=None):
    var_name = "year" if var_name is None else var_name
    value_name = "values" if value_name is None else value_name

    assert isinstance(df, pd.core.frame.DataFrame), f"df must be a DataFrame"
    assert isinstance(var_name, str), f"var_name must a be string"
    assert isinstance(value_name, str), f"value_name must be a string"

    df.columns = df.columns.astype(str)
    id_vars = [val for val in list(df.columns) if not is_numeric(val)]
    value_vars = [val for val in list(df.columns) if is_numeric(val)]
    df_long = df.melt(
        id_vars=id_vars, value_vars=value_vars, var_name=var_name, value_name=value_name
    )
    df_long[var_name] = df_long[var_name].astype(float)
    return df_long


@concurrent_executor
def get_iso2_from_iso3(iso3=None):
    try:
        version = "/api/v1"
        base_url = "https://openclimate.openearth.dev"
        server = f"{base_url}{version}"
        endpoint = f"/search/actor?identifier={iso3}&namespace=ISO-3166-1%20alpha-3"
        url = f"{server}{endpoint}"
        headers = {"Accept": "application/json"}
        response = requests.get(url, headers=headers)
        records = response.json()["data"]
        iso2 = records[0]["actor_id"]
        return {iso3: iso2}
    except IndexError:
        return {iso3: None}


class UNFCCC:
    def __init__(self, fl: str = None, *args, **kwargs):
        self.fl = fl
        self.sector_sheet_name = "Data_by_sector"
        self.gas_sheet_name = "Data_by_gas"
        self.df_sector = pd.read_excel(
            self.fl, sheet_name=self.sector_sheet_name, header=None
        )
        self.df_gas = pd.read_excel(
            self.fl, sheet_name=self.gas_sheet_name, header=None
        )

    def __repr__(self):
        return f"UNFCCC({self.fl})"

    def __str__(self):
        return f"UNFCCC({self.fl})"

    @property
    def iso3(self):
        if isinstance(self.fl, str):
            path_obj = Path(self.fl)
        else:
            path_obj = self.fl

        iso3 = path_obj.stem.split("_")[0]
        return iso3

    @property
    def iso2(self):
        return get_iso2_from_iso3(self.iso3)[0][self.iso3]

    def sector_summary(self):
        df = self.df_sector
        section_start = df.loc[
            df.iloc[:, 0] == "GHG emissions, Gg CO2 equivalent"
        ].index[0]
        section_end = df.loc[df.iloc[:, 0] == "7. Other"].index[0]
        df_emissions_tmp = df.loc[section_start:section_end]
        summary_start = (
            df_emissions_tmp.loc[df_emissions_tmp.iloc[:, 0] == "Summary Total"].index[
                0
            ]
            + 1
        )
        summary_end = df_emissions_tmp.iloc[:, 0].isna().idxmax() - 1
        df_summary = df_emissions_tmp.loc[summary_start:summary_end].set_axis(
            df.iloc[section_start, :], axis=1
        )
        df_summary["iso3"] = self.iso3
        df_summary["iso2"] = self.iso2
        return df_summary

    def sector_breakdown(self):
        df = self.df_sector
        section_start = df.loc[
            df.iloc[:, 0] == "GHG emissions, Gg CO2 equivalent"
        ].index[0]
        section_end = df.loc[df.iloc[:, 0] == "7. Other"].index[0]
        df_emissions_tmp = df.loc[section_start:section_end]
        breakdown_start = (
            df_emissions_tmp.loc[
                df_emissions_tmp.iloc[:, 0] == "Breakdown by sub-sectors"
            ].index[0]
            + 1
        )
        breakdown_end = len(df_emissions_tmp)
        df_breakdown = df_emissions_tmp.loc[breakdown_start:breakdown_end].set_axis(
            df.iloc[section_start, :], axis=1
        )
        df_breakdown["iso3"] = self.iso3
        df_breakdown["iso2"] = self.iso2
        return df_breakdown

    def gas_with_landuse(self):
        df = self.df_gas
        section_start = df.loc[
            df.iloc[:, 0] == "GHG emissions, Gg CO2 equivalent"
        ].index[0]
        start_index = df.index[df.iloc[:, 0] == "GHG emissions with LULUCF / LUCF"][0]
        end_index = df.index[(df.iloc[:, 0] == "Total GHG") & (df.index > start_index)][
            0
        ]
        df_out = df.loc[start_index + 1 : end_index].set_axis(
            df.iloc[section_start, :], axis=1
        )
        df_out["iso3"] = self.iso3
        df_out["iso2"] = self.iso2
        return df_out

    def gas_without_landuse(self):
        df = self.df_gas
        section_start = df.loc[
            df.iloc[:, 0] == "GHG emissions, Gg CO2 equivalent"
        ].index[0]
        start_index = df.index[df.iloc[:, 0] == "GHG emissions without LULUCF / LUCF"][
            0
        ]
        end_index = df.index[(df.iloc[:, 0] == "Total GHG") & (df.index > start_index)][
            0
        ]
        df_out = df.loc[start_index + 1 : end_index].set_axis(
            df.iloc[section_start, :], axis=1
        )
        df_out["year"] = df_out["year"].astype(int)
        df_out["iso3"] = self.iso3
        df_out["iso2"] = self.iso2
        return df_out
