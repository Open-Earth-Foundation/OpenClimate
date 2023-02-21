# https://di.unfccc.int/api/parties
import asyncio
import concurrent.futures
from functools import wraps
import os
import pandas as pd
from pathlib import Path
import requests


def concurrent_decorator(func):
    """decorator to make concurrent futures"""

    def wrapper(*args, **kwargs):
        if isinstance(args[0], str):
            args = ([args[0]],)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(func, *args, **kwargs))
        return results

    return wrapper


def async_decorator(func):
    """decorator to make function asynchronous"""

    @wraps(func)
    async def wrapper(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, func, *args, **kwargs)

    return wrapper


def party_codes():
    """get ISO3 country codes from UNFCCC API"""
    out = requests.get("https://di.unfccc.int/api/parties")
    return {
        "groups": pd.DataFrame(out.json()[0]["parties"]),
        "annexOne": pd.DataFrame(out.json()[1]["parties"]),
        "nonAnnexOne": pd.DataFrame(out.json()[2]["parties"]),
    }


@async_decorator
def download_file(url=None, output_dir="./downloaded_data"):
    """download url to output_dir"""
    base_path = Path(os.path.abspath(output_dir))
    filename = url.split("/")[-1]
    resp = requests.get(url, allow_redirects=True)
    if resp.status_code == 200:
        with open(f"{base_path}/{filename}", "wb") as f:
            f.write(resp.content)


@concurrent_decorator
def get_url_from_iso3(iso3=None):
    """create download URL from a given ISO3 code"""
    base_url = "https://di.unfccc.int/ghg_profiles/nonAnnexOne"
    return f"{base_url}/{iso3}/{iso3}_ghg_profile.xlsx"


async def download_all_urls(url_list, base_path):
    """async function to download a list of urls to base_path"""
    tasks = [asyncio.create_task(download_file(url, base_path)) for url in url_list]
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    # uncomment if working jupyter/ipython
    # import nest_asyncio
    # nest_asyncio.apply()

    # define output directory and type of UNFCCC parties to download
    output_dir = "./data"
    party_type = "nonAnnexOne"  # ('annexOne, nonAnnexOne, groups)

    # make output_dir if does not exist
    base_path = os.path.abspath(output_dir)
    Path(Path(base_path).as_posix()).mkdir(parents=True, exist_ok=True)

    # download data from urls
    code_list = list(party_codes()[party_type]["code"])
    url_list = get_url_from_iso3(code_list)
    asyncio.run(download_all_urls(url_list, base_path))
