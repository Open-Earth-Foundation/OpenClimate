import { FunctionComponent } from "react";
import { MdArrowUpward} from "react-icons/md"
import {DonutChart} from 'react-circle-chart'

const EarthCard:FunctionComponent<{}> = (props) => {

    // Donut earth props items
    const items = [
        {
            value: 32,
            label: "Total",
            color: "#D9D9D9"
        },
        {
            value: 68,
            label: "Difference",
            color: "#FA7200"
        },
    ]

    return (
        <div>
            <span className="review__actor-type">Global</span>
            <div className="review__earth-card">
                <div className="review__earth-card-head">
                    <span>Earth</span>
                </div>
                <div className='review__earth-card-body'>
                    <div className="review__earth-card-content">
                        <div>
                            <MdArrowUpward className="review__earth-card-item-icon"/>
                            <span className="review__earth-card-item-large-text">49.8</span>
                            <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                        </div>
                        <div className="review__earth-card-item-normal-text">in 2019</div>
                    </div>
                    <div className="review__earth-card-content donut-card">
                        <div className='donut'>
                            <DonutChart items={items} size={30} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                        </div>
                        <div className='right-column'>
                            <div>
                                <span className="review__earth-card-item-large-text">287.4</span>
                                <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                            </div>
                            <div className="review__earth-card-item-normal-text target-text">Left based on 1.5 target</div>
                        </div>
                    </div>
                    <div className="review__earth-card-content">
                        <div>
                            <MdArrowUpward className="review__earth-card-item-icon"/>
                            <span className="review__earth-card-item-large-text">1.1 <sup>o</sup>C</span>
                            <span className="review__earth-card-item-small-text"></span>
                        </div>
                        <div className="review__earth-card-item-normal-text">Temperature <br /> since  1880</div>
                    </div>
                    <div className="review__earth-card-content donut-card co2concentration">
                        <div className=''>
                            <div>
                                <MdArrowUpward className="review__earth-card-item-icon"/>
                                <span className="review__earth-card-item-large-text">415.3</span>
                                <span className="review__earth-card-item-small-text">ppm</span>
                            </div>
                            <div className="review__earth-card-item-normal-text">atmospheric CO<sub>2 </sub>concentration</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EarthCard