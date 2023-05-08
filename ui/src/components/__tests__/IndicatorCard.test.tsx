import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import IndicatorCard from "../review/indicator-card";

const EARTH = {
    "actor_id": "EARTH",
    "name": "Earth",
    "type": "planet",
    "icon": null,
    "is_part_of": null,
    "territory": null,
    "emissions": {
    },
    "population": [
    ],
    "gdp": [
    ],
    "targets": [
    ]
}

const isMobile = false;
const currentWidth = 0

const matchContent = (regexp:RegExp) => {
    return (content:any, element:any) => element.textContent.match(regexp)
}

// cleanup render / dom after each test

describe('inactive indicator card widget with Earth data', () => {

    beforeEach(() => {
        render(<IndicatorCard current={EARTH} parent={null} label={"Our Planet"} isActive={false} />);
    })

    afterEach(cleanup)

    it("has the correct CSS class", () => {
        const div = screen.getByTestId('activity-wrapper');
        expect(div).toBeInTheDocument();
        expect(div.className).toMatch(/review__earth-card-inactive/)
    })
})

describe('active indicator card widget with Earth data', () => {

    beforeEach(() => {
        render(<IndicatorCard current={EARTH} parent={null} label={"Our Planet"} isActive={true} />);
    })

    afterEach(cleanup)

    it("has the correct CSS class", () => {
        const div = screen.getByTestId('activity-wrapper');
        expect(div).toBeInTheDocument();
        expect(div.className).toMatch(/review__earth-card-active/)
    })

    it("has the label", () => {
        const label = screen.getByText("Our Planet")
        expect(label).toBeInTheDocument()
    })

    it("has the Earth title", () => {
        const title = screen.getByText(/Earth/);
        expect(title).toBeInTheDocument()
    })

    it("has the annual emissions", () => {
        const div = screen.getByTestId('emissions-info')
        expect(div).toHaveTextContent(/\d+\.\d\s*GtCO2e\s*in \d\d\d\d/)
    })

    it("has the remaining carbon budget", () => {
        const div = screen.getByTestId('carbon-budget')
        expect(div).toHaveTextContent(/\d+\.\d\s*GtCO2e\s*Left based on 1.5 target/)
    })

    it("has the temperature rise", () => {
        const div = screen.getByTestId('co2-history')
        expect(div).toHaveTextContent(/\d\.\d\s*oC\s*Temperature since \d\d\d\d/)
    })

    it("has the atmospheric concentration", () => {
        const div = screen.getByTestId('co2-concentration-content')
        expect(div).toHaveTextContent(/\d+.\dppm\s*atmospheric CO2 concentration/)
    })
})
