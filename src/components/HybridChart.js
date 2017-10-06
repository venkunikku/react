import React from 'react'
import { render } from 'react-dom'
import { SVG } from './ChartUtils'
import * as d3 from 'd3'
import ReactDOM from 'react-dom'
import { parseTime, yearMonthDayWithDash, currencyFormat } from './Utils'




class HybridChart extends React.Component {

    constructor(props) {
        super(props)

        const { data, id, title } = this.props
        this.createBarChart = this.createBarChart.bind(this)
    }

    // before render
    componentWillMount() {
        this.createBarChart()
    }

    // after render
    componentDidMount() {
        this.createBarChart()

    }

    // for clean up
    componentWillMount() {

    }

    mapStateToProps(stat) {

    }

    createBarChart() {

    }

    render() {

        const node = this.node
        const reactDom = ReactDOM.findDOMNode(this)

        const { data, maringProp, paddingProp, oWidht, oHeight, pathLineStrokWidth = "1.5" } = this.props

        const margin = maringProp,
            padding = paddingProp,
            outerWidth = oWidht,
            outerHeight = oHeight,
            innerWidth = outerWidth - margin.left - margin.right, //920
            innerheight = outerHeight - margin.top - margin.bottom, //460
            width = innerWidth - padding.left - padding.right, // 800
            height = innerheight - padding.top - padding.bottom //340

        const firstG = "translate(" + margin.left + "," + margin.top + ")"
        const secondG = "translate(" + padding.left + "," + padding.top + ")";

        // Separating last year data array and current year data array.
        const currentRevenueData = data[0][0].data
        const lastYearRevenueData = data[0][1].data


        // Combining all the revenues to find MAX and MIN for scales
        const currentRevenueList1 = currentRevenueData.map((d) => d[1])
        const lastYearRevenueList2 = lastYearRevenueData.map((d) => d[1])
        const allRevenueData = currentRevenueList1.concat(lastYearRevenueList2)


        // get MAX date for XScale
        const startDate = d3.min(currentRevenueData,
            function (d) { return new Date(d[0]) }
        )

        // get MIN date for xScale
        const endDate = d3.max(currentRevenueData,
            function (d) { return new Date(d[0]) }
        )

        console.log("Min Start date: " + startDate)
        console.log("Max end Date: " + endDate)


        var startFinal = startDate.setDate(startDate.getDate() - 1);
        var endFinal = endDate.setDate(endDate.getDate() + 2);


        // Building xScale
        const xScale = d3.scaleTime()
            .domain([startFinal, endFinal])
            .rangeRound([0, width])

        // get max value for YScale
        const maxRevenueForYAxis = d3.max(allRevenueData, (d) => d)

        // building yScale 
        const yScale = d3.scaleLinear()
            .domain([0, maxRevenueForYAxis])
            .rangeRound([height, 0])


        // building X-AXIS
        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5)
            .tickFormat(parseTime)

        // building Y-AXIS
        const yAxis = d3.axisLeft()
            .scale(yScale)

        // axis for grid lines
        const gridYAxis = makeYGridLines(yScale, 5)
        const gridXAxis = makeXGridLines(xScale)

        // X AXIS line and the labels 
        const lablesData = getXAxisLabels(currentRevenueData, 5)


        const line = d3.line()
            .x(function (d) {
                return xScale(new Date(d[0]));
            })
            .y(function (d) {
                return yScale(d[1])
            })
        return (
            <SVG height={outerHeight} width={outerWidth} ref={node => this.node = node} >
                <g transform={firstG}>
                    <g transform={secondG}>

                        {/* this is X Axis Display part */}
                        <g className="axis" transform={"translate(5," + height + ")"} fill="none"
                            fontSize="10" fontFamily="sans-serif"
                            textAnchor="middle">

                            <path className="domain" stroke="#000" d={"M0.5 6 V0.5 H" + width} />
                            {lablesData.map((d) =>
                                <g className="tick" opacity="1" transform={"translate(" + xScale(new Date(d[0])) + ",0)"}>
                                    <line stroke="#000" y2="6" x1="0.5" x2="0.5" />
                                    <text fill="#000" y="9" x="0.5" dy="0.71em">{parseTime(new Date(d[0]))}</text>
                                </g>

                            )
                            }
                        </g>

                        {/* this is y Axis Display part */}
                        <g className="axis" transform={"translate(0,0)"} fill="none"
                            fontSize="10" fontFamily="sans-serif"
                            textAnchor="end">

                            <path class="domain" stroke="#000" d={"M-6," + (height + 0.5) + "H0.5V0.5H-6"}></path>
                            {yScale.ticks().map((d) =>
                                <g className="tick" opacity="1" transform={"translate(0," + yScale(d) + ")"}>
                                    <line stroke="#000" y1="0.5" y2="0.5" x2="-6" />
                                    <text fill="#000" x="-9" y="0.5" dy="0.32em">{"$"+currencyFormat(d)}</text>
                                </g>

                            )
                            }
                        </g>

                        {/* Grid Lines Y Axis */}
                        <g>

                            {
                                yScale.ticks().map((d, i) =>
                                    (i % 2 === 0) ? <AxisGrid classNm="yaxisGrid" width={width} yTranslate={yScale(d)} /> : null

                                )
                            }

                        </g>



                        {/* this is Rect graph part */}
                        <g className="garea">
                            {
                                currentRevenueData.map((d, i) =>
                                    <Rectangle x={xScale(new Date(d[0]))}
                                        y={yScale(d[1])}
                                        width={Math.floor((width - 200) / currentRevenueData.length)}
                                        height={height - yScale(d[1])}
                                        fill={"rgb(218, 135," + Math.floor(yScale(d[1])) + ")"}
                                        dataValue={d[1]}
                                    />
                                )

                            }
                        </g>

                        {/* this is line graph part */}
                        <g>
                            <Path lineFunction={line} data={lastYearRevenueData} stroke="#138808" fill="none" strokeWidth={pathLineStrokWidth} strokeLineJoin="round" strokeLineCap="round" />

                        </g>

                        {/* creating circle at the path joins */}
                        <g>
                            {

                                lastYearRevenueData.map((d) => {
                                    return ([
                                        <circle cx={xScale(new Date(d[0]))} cy={yScale(d[1])}
                                            r="3" fill="white" stroke="steelblue" strokeOpacity="0.1"

                                        />,
                                        <circle cx={xScale(new Date(d[0]))} cy={yScale(d[1])}
                                            r="3" fill="none" stroke="#008000" strokeOpacity="1.1"
                                            strokeWidth="2.5"

                                        />

                                    ])
                                }
                                )


                            }
                        </g>
                    </g>
                </g>

            </SVG>


        )
    }


}


const makeYGridLines = ({ yScale, ticks }) => d3.axisLeft(yScale).ticks(5)
const makeXGridLines = (xScale) => d3.axisLeft(xScale)



class Rectangle extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classNm, id, x, y, width, height, fill, rx = 3, ry = 3, dataValue } = this.props

        return (

            <rect className={classNm} id={id} x={x} y={y} width={width} height={height} fill={fill} rx={rx} ry={ry} data-value={dataValue} />
        )
    }
}


class Path extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {

        const { classNm, id, lineFunction, data, stroke, fill = "none", strokeWidth = "1.5", strokeLineJoin = "round", strokeLineCap = "round" } = this.props

        return (
            <path className={classNm} id={id} className="line shadow" d={lineFunction(data)}
                fill={fill} stroke={stroke} stroke-linejoin={strokeLineJoin} stroke-linecap={strokeLineCap}
                strokeWidth={strokeWidth} />
        )
    }


}

class Circle extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { classNm, id, x, y, r, fill = "none", stoke, strokeOpacity = "0.1", strokeWidth } = this.props
        return (
            <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} stroke-opacity={strokeOpacity} stroke-width={strokeWidth} />
        )
    }
}

class AxisGrid extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {

        const { classNm, id, width, yTranslate } = this.props
        return (

            <line className={classNm} id={id} opacity="0.1" stroke="#000" x1="0" y1="0.5" y2="0.5" x2={width} transform={"translate(0," + yTranslate + ")"} />

        )
    }
}

const getXAxisLabels = (data, totalTicks = 5) => {
    const [first, ...rest] = data
    var axisPoints = [first]
    var [lastElement] = rest.reverse()
    let totalRecords = (rest.length) - 1
    let ticks = Math.round(totalRecords / totalTicks)
    for (var i = ticks; i < totalRecords; i = i + ticks) {
        if (i !== totalRecords) {
            axisPoints.push(rest[i])
        }
    }
    axisPoints.push(lastElement)
    return axisPoints
}

export default HybridChart