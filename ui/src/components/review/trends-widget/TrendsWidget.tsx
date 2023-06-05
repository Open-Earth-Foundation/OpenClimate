import React, { FC, useState } from "react";
import style from "./TrendsWidget.module.scss"
import {MdArrowDropDown, MdFilterList, MdLink, MdOpenInNew, MdOutlineFileDownload} from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { readableEmissions } from "../../util/units";


interface TrendsWidgetProps {
    actor: object [];
}

const TrendsWidget:FC<TrendsWidgetProps> = ({actor}) => {
    
    const [openFilterDropdown, setOpenFilterDropdown] = useState<boolean>(false);
    
    const handleFrilterDropdown = () => {
        if(!openFilterDropdown){
            setOpenFilterDropdown(true)
        } else {
            setOpenFilterDropdown(false)
        }
    }

    const emk = Object.keys(actor.emissions);

    emk.forEach((key)=> {
        const emOb = actor.emissions[key];
        const sd = emOb.data.sort((a, b)=> a.year - b.year);
        emOb.data = sd
    })

    const mk = Object.keys(actor.emissions);

    mk.forEach((key:any)=> {
        const fd = actor.emissions[key].data.filter((item)=> item.year >= 1990);
        actor.emissions[key] = {
            data: fd,
            tags: actor.emissions[key].tags
        }
    })

    const dt = {
        "emissions": actor.emissions,
        "targets": actor.targets
    }
    
    const data = [];

    const {emissions, targets} = dt

    for (const sourceKey in emissions) {
        if (emissions.hasOwnProperty(sourceKey)) {            
            const sourceData = emissions[sourceKey].data;
            const tags = emissions[sourceKey].tags
   
          // Iterate over the data points for each source
            sourceData.forEach((dataPoint) => {
                const { year, total_emissions } = dataPoint;
        
                // Check if there is an entry for the year in the main data array
                const yearEntry = data.find((entry) => entry.year === year);
        
                // If the year entry exists, add the emissions value for the source
                
                if (yearEntry) {
                    yearEntry.emissions[sourceKey] = {
                        total_emissions,
                        tags
                    }
                }
                // Otherwise, create a new entry for the year and add the emissions value
                else {
                const newEntry = {
                    year: year,
                    emissions: {
                    [sourceKey]: {
                        total_emissions,
                        tags
                    }
        
                    },
                };
                
                data.push(newEntry);
                }
          });
        }
      }
    
    targets.forEach((target) => {
        const year = target.target_year;
        const yearEntry = data.find((entry) => entry.year === year);
        
        if (yearEntry) {
            const baselineValue = target.percent_achieved_reason? target.percent_achieved_reason.baseline.value : null;
            const targetValue = baselineValue * (target.target_value / 100);
            yearEntry.target = targetValue;
        } else {
            const newEntry = {
            year: year,
            emissions: {
                tags:[]
            },
            target: target.percent_achieved_reason ? target.percent_achieved_reason.baseline.value * (target.target_value / 100): null,
            };
            data.push(newEntry);
        }
    });
 
    const sources = Object.keys(data[0].emissions);

    const [selectedSources, setSelectedSources] = useState(sources);
    
    const handleSourceToggle = (source) => {
        const updatedSources = selectedSources.includes(source)
          ? selectedSources.filter((selectedSource) => selectedSource !== source)
          : [...selectedSources, source];
        setSelectedSources(updatedSources);
    };

    const handleResetSelection = () => {
        setSelectedSources(sources)
    }

    const lines = selectedSources.map((source) => (
        <Line 
            type="monotone" 
            dataKey={`emissions.${source}.total_emissions`} 
            key={source}
            fill="#fa7200" 
            stroke="#fa7200"
            unit="Mt"
       />
    ));

    const targetLine = (
        <Line
          type="monotone"
          dataKey="target"
          stroke="#ffffff"
          strokeWidth={0}
          dot={TrendDot}
          isAnimationActive={true}
        />
    );

    interface TooltipProps {
        active: boolean
        payload: []
        label: string
    }

    const ToolTipContent:FC<TooltipProps> = ({active, payload, label}) => {
        if(active && payload && payload.length){
            const tooltipData = data.find((entry) => entry.year === label);
            const tooltipSources = Object.keys(tooltipData);
            const filteredSources = sources.filter((source) => {
                const dataKey = `emissions.${source}`;
                return payload.some((entry) => entry.dataKey === dataKey);
              });
         
            let src = payload[0].dataKey.split(".")
            src = src[1]
            
            let modifiedSrc = null

            if(src){
                modifiedSrc = src.split(":")[0].trim()
            }
            
            let tags = null
            
            if(src){
                tags = payload[0].payload.emissions[src].tags
            }else{
                tags = payload[0].payload.emissions.tags
            }

          return(
            <div className={style.tooltip}>
                <div className={style.tooltipHeader}>
                    <h3>{label}</h3>
                </div>
                <div className={style.tooltipBody}>
                    <div className={style.emissionsData}>
                        <p className={style.ttlEmsValue}>{readableEmissions(payload[0].value)}</p>
                        <p className={style.ttlEmsText}>Total emissions in GtCO2eq</p>
                    </div>
                    <div className={style.sourceData}>
                        <p key={src} className={style.ttlSrcValue}>{modifiedSrc}</p>
                        <p className={style.ttlSrcText}>Source</p>
                    </div>
                    <div className={style.methodologies}>
                        {
                            tags && (tags.map((tag:any)=> <div key={tag.tag_id} className={style.tag}>{tag.tag_name}</div>))
                        }                  
                    </div>
                    <div>
                        <p className={style.methodologiesText}>Methodologies Used</p>
                    </div>
                </div>
            </div>
            
          )
        }
      
        return null;
    }

    return(
        <div className={style.root}>
            <div className={style.container}>
                <div className={style.header}>
                    <div className={style.headerRightColumn}>
                        <h1 className={style.title}>Trends</h1>
                        <p className={style.dateUpdated}>Last updated in 2019</p>
                    </div>
                    <div className={style.headerLeftColumn}>
                        <button className={style.downloadBtn}>
                            <MdOutlineFileDownload size={24}/>
                        </button>
                    </div>
                </div>
                <div className={style.body}>
                    <div className={style.filterWrapper}>
                        <button onClick={handleFrilterDropdown} className={style.filterButton}>
                            <MdFilterList className={style.filterIcon} size={24}/>
                            <span className={style.sourcesText}>Sources</span>
                            <span className={style.badge}>{sources.length}</span>
                            <MdArrowDropDown className={style.dropdownIcon} size={16}/>
                        </button>
                        {
                            openFilterDropdown && (
                                <>
                                    <div className={style.filterDropdown}>
                                        <div className={style.sourceListWrapper}>
                                            <FormGroup>
                                                {
                                                    sources.map((source) => {
                                                        return(
                                                            <div key={source} className={style.sourceItem}>
                                                                <FormControlLabel control={<Checkbox checked={selectedSources.includes(source)} defaultChecked />} onChange={()=>handleSourceToggle(source)} label={source.split(":")[0].trim()} />
                                                                <MdOpenInNew size={16}/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </FormGroup>
                                        </div>
                                        <div className={style.footer}>
                                            <div className={style.footerWrapper}>
                                                <button
                                                    onClick={handleResetSelection}                            
                                                    className={style.resetBtn}>Reset</button>
                                                <button 
                                                    onClick={handleFrilterDropdown}
                                                    className={style.applyBtn}>Apply</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className={style.chartArea}>
                        <div className={style.chartTitle}>
                            <div className={style.histTitle}>
                                Historical Emissions
                            </div>
                            <div className={style.targetTitle}>
                                Emissions Targets
                            </div>
                        </div>
                        <LineChart height={400} width={1350} data={data}>
                            <CartesianGrid stroke="#E6E7FF" height={1}/>
                            <XAxis dataKey="year" capHeight={30}/>
                            
                            <YAxis widths={10} stroke="E6E7FF" />
                            <Tooltip content={<ToolTipContent />} isAnimationActive={true} shared={false}/>
                            <Legend content={<LegendContent />}/>
                            {lines}
                            {targetLine}
                        </LineChart>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default TrendsWidget;

export const LegendContent:FC = () => {
    return(
        <div className={style.legend}>
            <p className={style.legendTitle}>Types of emissions and pledges</p>
            <div className={style.legendContent}>
                <div className={style.legendItem}>
                    <div className={style.emissionsIndicator}/>
                    <span>GHG Emissions</span>
                </div>
                <div className={style.legendItem2}>
                    <MdArrowDropDown className={style.legendDropdownIcon} size={36}/>
                    <span>Absolute emissions reduction</span>
                </div>
            </div>
        </div>
    );
}

function TrendDot(props) {
    const { cx=0, cy=0, value, trend="increase" } = props;
    const triangleSize = 30; // Adjust this as needed
  
    return (
      <g>
        {/* <circle cx={cx} cy={cy} r={3} fill="green" /> */}
        <path
          d={
            trend === 'increase'
              ? `M${cx} ${cy} L${cx - 15} ${cy - 15} L${cx + 15} ${cy - 15} Z`
              : `M${cx - triangleSize / 2} ${cy + triangleSize} h ${triangleSize} l ${-triangleSize / 2} ${triangleSize} z`
          }
          fill={trend === 'increase' ? '#24be00' : 'red'}
        />
      </g>
    );
  }
  
