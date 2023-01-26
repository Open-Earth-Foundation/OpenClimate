export const PledgeSchemas = [
  {
    category: "Pledges",
    type: "Target Emission Reduction",
    display_name: "Target emission reduction",
    fields: [
      {
        name: "pledge_emission_reduction",
        placeholder: "* % reduction",
        type: "number",
        required: true,
      },
      {
        name: "pledge_base_year",
        placeholder: "* Base year",
        type: "number",
        required: true,
      },
      {
        name: "pledge_base_level",
        placeholder: "* Base level",
        type: "number",
        required: true,
      },
      {
        name: "pledge_plan_details",
        placeholder: "Plan details",
        type: "text",
        required: false,
      },
      {
        name: "pledge_public_statement",
        placeholder: "Public statement",
        type: "text",
        required: false,
      },
    ],
  },
  {
    category: "Pledges",
    type: "Target Carbon Intensity Reduction",
    display_name: "Target carbon intensity reduction",
    fields: [
      {
        name: "pledge_carbon_intensity_reduction",
        placeholder: "* % reduction",
        type: "number",
        required: true,
      },
      {
        name: "pledge_base_year",
        placeholder: "* Base year",
        type: "number",
        required: true,
      },
      {
        name: "pledge_base_level",
        placeholder: "* Base level",
        type: "number",
        required: true,
      },
      {
        name: "pledge_plan_details",
        placeholder: "Plan details",
        type: "text",
        required: false,
      },
      {
        name: "pledge_public_statement",
        placeholder: "Public statement",
        type: "text",
        required: false,
      },
    ],
  },
  {
    category: "Pledges",
    type: "Target Carbon Intensity",
    display_name: "Target carbon intensity",
    fields: [
      {
        name: "pledge_carbon_intensity_target",
        placeholder: "* Carbon intensity level",
        type: "number",
        required: true,
      },
      {
        name: "pledge_plan_details",
        placeholder: "Plan details",
        type: "text",
        required: false,
      },
      {
        name: "pledge_public_statement",
        placeholder: "Public statement",
        type: "text",
        required: false,
      },
    ],
  },
  {
    category: "Pledges",
    type: "Target emission",
    display_name: "Target emission",
    fields: [
      {
        name: "pledge_emission_target",
        placeholder: "* Emission level",
        type: "number",
        required: true,
      },
      {
        name: "pledge_plan_details",
        placeholder: "Plan details",
        type: "text",
        required: false,
      },
      {
        name: "pledge_public_statement",
        placeholder: "Public statement",
        type: "text",
        required: false,
      },
    ],
  },
];
