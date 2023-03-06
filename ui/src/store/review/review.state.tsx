import ICountry from "../../api/models/review/country";
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes";
import { IReviewFilter } from "../../api/models/review/dashboard/reviewFilter";
import ITrackedEntity from "../../api/models/review/entity/tracked-entity";

export interface ReviewState {
  loading: boolean;
  filters: Array<IReviewFilter>;
  dashboardType: FilterTypes | null;
  selectedEntities: Array<ITrackedEntity>;
}
