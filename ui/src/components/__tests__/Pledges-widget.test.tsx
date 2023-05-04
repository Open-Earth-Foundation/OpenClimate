import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import PledgesWidget from "../review/pledges-widget/pledges-widget";

// Test / Moch Data

const targets = [
    {
        target_id: "TEST:unconditional:C1",
        target_type: "Fake Absolute emission reduction",
        baseline_year: 2006,
        baseline_value: null,
        target_year: 2030,
        target_value: "40",
        target_unit: "percent",
        is_net_zero: false,
        percent_achieved: 76.965773410381,
        percent_achieved_reason: {
            baseline: {
                year: 2005,
                value: 741182843,
                datasource: {
                    datasource_id: "TEST:TEST_SOURCE:2019-11-08",
                    name: "ACME 111",
                    published: "2019-11-08T00:00:00.000Z",
                    URL: "https://acme.com/time_series"
                }
            },
            current: {
                year: 2021,
                value: 513000000,
                datasource: {
                    datasource_id: "TEST:TEST_SOURCE_1:2019-11-08",
                    name: "ACME 112",
                    published: "2019-11-08T00:00:00.000Z",
                    URL: "https://acme.com/time_series"
                }
            },
            target: {
                value: 444709705.8
            }
        },
        datasource_id: "Test:abc/abc-5005",
        datasource: {
            datasource_id: "Test:abc/abc-5005",
            name: "Test",
            publisher: "Abc Publisher",
            published: "2022-10-01T00:00:00.000Z",
            URL: "https://acme.com/test",
            created: "2023-02-10T19:34:22.337Z",
            last_updated: "2023-02-10T19:34:22.337Z"
        },
        initiative: {
            initiative_id: "1",
            name: "Test Agreement",
            description: "The Test Agreement is a legally binding international treaty on climate change. It was adopted by 196 Parties at COP 21 in Paris, on 12 December 2015 and entered into force on 4 November 2016. Its goal is to limit global warming to well below 2, preferably to 1.5 degrees Celsius, compared to pre-industrial levels. To achieve this long-term temperature goal, countries aim to reach global peaking of greenhouse gas emissions as soon as possible to achieve a climate neutral world by mid-century. The Paris Agreement is a landmark in the multilateral climate change process because, for the first time, a binding agreement brings all nations into a common cause to undertake ambitious efforts to combat climate change and adapt to its effects.",
            URL: "https://acme.int/test/"
        }
    },
];

const current = {targets};
const isMobile = false;
const currentWidth = 0

// cleanup render / dom after each test

afterEach(()=> {
    cleanup()
})

// test cases

it('should render pledges widget with targets', () => {

    const {targets} = current;
    // render widget with props containing test data

    render(<PledgesWidget current={current} isMobile={isMobile} currentWidth={currentWidth} />);

    // Access dom elements via roles assigned to each of them
    const widgetHeadTitle = screen.getByText(/Pledges/i);
    const targetType = screen.getByText(/Net Zero Target/i);
    const targetItems = screen.getAllByRole('targetitem');
    const targetItemByID = screen.getByTestId('target-TEST:unconditional:C1');

    const popoverBtn = screen.getByRole('popover-button');

    // manages events triggered by click actions
    fireEvent.click(popoverBtn);
    
    const popoverContent = screen.getByRole('popover-content', {hidden: true});
    const popoverHeader = screen.getByRole('popover-header-title');
    const popoverDataSourceName = screen.getByRole('data-source-name');
    const baselineValue = screen.getByRole('baseline-value');
    const baselineYear = screen.getByRole('baseline-year');
    const currentEmissionsValue = screen.getByRole('current-emissions-value');
    const currentEmsSrcName = screen.getByRole('data-src-name');
    const targetValue = screen.getByRole('target-value');
    const targetValueYear = screen.getByRole('target-value-year')

    // Assertions
    expect(widgetHeadTitle).toBeInTheDocument();
    expect(targetType).toBeInTheDocument();
    expect(targetItems).toHaveLength(current.targets.length);
    expect(targetItemByID).toBeInTheDocument();
    expect(popoverContent).toBeInTheDocument();
    expect(popoverHeader).toHaveTextContent('Fake Absolute emission reduction');
    expect(popoverDataSourceName).toHaveTextContent('Test');
    expect(baselineValue).toHaveTextContent('0.741GT CO2e');
    expect(baselineYear).toHaveTextContent('in 2006');
    expect(currentEmissionsValue).toHaveTextContent('0.513GT CO2e');
    expect(currentEmsSrcName).toHaveTextContent('ACME 112');
    expect(targetValue).toHaveTextContent('445MT')
    expect(targetValueYear).toHaveTextContent('in 2030')

    targets.forEach((target, index) => {
        const targetItem = targetItems[index];
        expect(targetItem).toHaveTextContent(/40% by 2030, relative to 2006Fake Absolute emission reductionGHG EMISSIONS77%77%/i);   
    });
})

it('should render pledges widget with no targets', () => {
    const noDataTextContent = "There's no data available, if you have any suggested data sources or you are a provider please"
    const collaborateText = "COLLABORATE WITH DATA"
    const linkHref = "https://docs.google.com/forms/d/e/1FAIpQLSfL2_FpZZr_SfT0eFs_v4T5BsZnrNBbQ4pkbZ51JhJBCcud6A/viewform?pli=1&pli=1"

    render(<PledgesWidget current={[]} isMobile={isMobile} currentWidth={currentWidth} />);

    const widgetHeadTitle = screen.getByText(/Pledges/i)
    const noDataText = screen.getByRole('no-data-text')
    const collaborateLink = screen.getByRole('collaborate-text')
        
    expect(widgetHeadTitle).toBeInTheDocument();
    expect(noDataText).toHaveTextContent(noDataTextContent);
    expect(collaborateLink).toHaveTextContent(collaborateText);
    expect(collaborateLink).toHaveAttribute('href', linkHref);
})
