#!/usr/bin/env python3
"""Build the OpenClimate identity tables for Chile's 346 comunas.

This processor intentionally handles identity data only. It does not accept or
emit emissions, energy, or activity data.
"""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path


HARMONIZE_DIR = Path(__file__).resolve().parent.parent
RAW_FILE = HARMONIZE_DIR / "data/raw/CL-CUT-comuna-identity/chile_comunas.csv"
OUTPUT_DIR = (
    HARMONIZE_DIR
    / "data/processed/OEF:CL-CUT:comuna-identity:2026-10-23"
)
UNLOCODE_ACTOR_FILE = HARMONIZE_DIR / "data/processed/UNLOCODE/Actor.csv"

DATASOURCE_ID = "OEF:CL-CUT:comuna-identity:2026-10-23"
CANONICAL_FIELDS = [
    "comuna_code",
    "comuna_name",
    "region_code",
    "region_name",
    "locode",
    "locode_name",
    "locode_status",
]
SOURCE_FIELDS = CANONICAL_FIELDS[:-1]
VALID_STATUSES = {
    "official_direct",
    "official_name_variant",
    "official_related_location",
    "synthetic_transitional",
}

# Prefer direct OpenClimate/UNLOCODE actors over border crossings or related
# locations used in the original spatial crosswalk.
DIRECT_CODE_OVERRIDES = {
    "CL05301": ("CL LND", "Los Andes"),
    "CL05606": ("CL SDO", "Santo Domingo"),
    "CL10304": ("CL PYH", "Puyehue"),
    "CL12401": ("CL PNT", "Puerto Natales"),
}

NAME_VARIANT_CODES = {"CL04105", "CL05502", "CL06204"}
RELATED_LOCATION_CODES = {
    "CL04305",  # Rio Hurtado -> Hurtado
    "CL05303",  # Rinconada -> Rinconada de Los Andes
    "CL06110",  # Mostazal -> San Francisco de Mostazal
    "CL08304",  # Laja -> La Laja
    "CL10208",  # Quellon -> Puerto Quellon
    "CL11201",  # Aysen -> Puerto Aysen
    "CL11202",  # Cisnes -> Puerto Cisnes
    "CL12401",  # Natales -> Puerto Natales
}


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def status_for(comuna_code: str) -> str:
    if comuna_code == "CL12202":
        return "synthetic_transitional"
    if comuna_code in NAME_VARIANT_CODES:
        return "official_name_variant"
    if comuna_code in RELATED_LOCATION_CODES:
        return "official_related_location"
    return "official_direct"


def initialize_raw(source: Path) -> None:
    """Create the canonical identity file from the reviewed working crosswalk."""
    fields, rows = read_csv(source)
    if fields != SOURCE_FIELDS:
        raise ValueError(f"Unexpected source columns: {fields}")

    canonical_rows: list[dict[str, object]] = []
    for row in rows:
        locode, locode_name = DIRECT_CODE_OVERRIDES.get(
            row["comuna_code"], (row["locode"], row["locode_name"])
        )
        canonical_rows.append(
            {
                **{field: row[field] for field in SOURCE_FIELDS[:4]},
                "locode": locode,
                "locode_name": locode_name,
                "locode_status": status_for(row["comuna_code"]),
            }
        )

    write_csv(RAW_FILE, CANONICAL_FIELDS, canonical_rows)


def validate(rows: list[dict[str, str]]) -> None:
    if len(rows) != 346:
        raise ValueError(f"Expected 346 comunas, found {len(rows)}")

    comuna_codes = [row["comuna_code"] for row in rows]
    locodes = [row["locode"] for row in rows]
    if len(set(comuna_codes)) != 346:
        raise ValueError("Comuna codes must be unique")
    if len(set(locodes)) != 346:
        raise ValueError("Actor/LOCODE assignments must be unique")

    invalid_cut = [code for code in comuna_codes if not re.fullmatch(r"CL\d{5}", code)]
    invalid_locodes = [code for code in locodes if not re.fullmatch(r"CL [A-Z0-9]{3}", code)]
    invalid_statuses = [
        row["locode_status"]
        for row in rows
        if row["locode_status"] not in VALID_STATUSES
    ]
    if invalid_cut:
        raise ValueError(f"Invalid CUT codes: {invalid_cut}")
    if invalid_locodes:
        raise ValueError(f"Invalid actor IDs: {invalid_locodes}")
    if invalid_statuses:
        raise ValueError(f"Invalid LOCODE statuses: {invalid_statuses}")

    synthetic = [row for row in rows if row["locode_status"] == "synthetic_transitional"]
    if len(synthetic) != 1 or synthetic[0]["comuna_code"] != "CL12202":
        raise ValueError("Antartica/CL12202 must be the sole synthetic assignment")

    _, unlocode_rows = read_csv(UNLOCODE_ACTOR_FILE)
    unlocode_actors = {row["actor_id"]: row for row in unlocode_rows}
    missing = [
        row["locode"]
        for row in rows
        if row["locode"] != "CL ATC" and row["locode"] not in unlocode_actors
    ]
    if missing:
        raise ValueError(f"Assigned actors absent from OpenClimate UNLOCODE: {missing}")
    if "CL ATC" in unlocode_actors:
        raise ValueError("Synthetic CL ATC collides with an OpenClimate UNLOCODE actor")


def build() -> None:
    fields, rows = read_csv(RAW_FILE)
    if fields != CANONICAL_FIELDS:
        raise ValueError(f"Unexpected canonical columns: {fields}")
    validate(rows)

    publisher_rows = [
        {"id": "OEF", "name": "Open Earth Foundation", "URL": "https://openearth.org/"}
    ]
    datasource_rows = [
        {
            "datasource_id": DATASOURCE_ID,
            "name": "Chile CUT comuna identity crosswalk",
            "publisher": "OEF",
            "published": "2026-10-23",
            "URL": "",
            "citation": "Chile CUT-to-OpenClimate actor identity crosswalk for all 346 comunas.",
        }
    ]
    actor_rows = [
        {
            "actor_id": "CL ATC",
            "type": "city",
            "name": "Antártica",
            "is_part_of": "CL-MA",
            "datasource_id": DATASOURCE_ID,
        }
    ]
    identifier_rows = [
        {
            "actor_id": row["locode"],
            "identifier": row["comuna_code"],
            "namespace": "CL-CUT",
            "datasource_id": DATASOURCE_ID,
        }
        for row in rows
    ]
    name_rows = [
        {
            "actor_id": row["locode"],
            "name": row["comuna_name"],
            "language": "es",
            "preferred": 1,
            "datasource_id": DATASOURCE_ID,
        }
        for row in rows
    ]

    write_csv(OUTPUT_DIR / "Publisher.csv", ["id", "name", "URL"], publisher_rows)
    write_csv(
        OUTPUT_DIR / "DataSource.csv",
        ["datasource_id", "name", "publisher", "published", "URL", "citation"],
        datasource_rows,
    )
    write_csv(
        OUTPUT_DIR / "Actor.csv",
        ["actor_id", "type", "name", "is_part_of", "datasource_id"],
        actor_rows,
    )
    write_csv(
        OUTPUT_DIR / "ActorIdentifier.csv",
        ["actor_id", "identifier", "namespace", "datasource_id"],
        identifier_rows,
    )
    write_csv(
        OUTPUT_DIR / "ActorName.csv",
        ["actor_id", "name", "language", "preferred", "datasource_id"],
        name_rows,
    )

    print(
        f"Wrote identity-only OpenClimate data for {len(rows)} Chilean comunas "
        f"to {OUTPUT_DIR}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--initialize-from",
        type=Path,
        help="Initialize the canonical raw CSV from the reviewed six-column crosswalk.",
    )
    args = parser.parse_args()

    if args.initialize_from:
        initialize_raw(args.initialize_from)
    build()


if __name__ == "__main__":
    main()
