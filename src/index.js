import React from 'react'
import { render } from 'react-dom'
import fetch from 'isomorphic-fetch'
import { displayList, createScream } from './learning.js'
import { v4 } from 'uuid'
import HybridChart from './components/HybridChart'
import * as d3 from 'd3'
import ReactDOM from 'react-dom'
import { parseTime, yearMonthDayWithDash, daysBackDate } from './components/Utils'
import $ from 'jquery'
//import * as native from 'react-native';


const thirtyDays = 30;
const nintyDays = 90;
const todayDate = new Date()


class ShoppingcartTrend extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			countryName: [],
			loading: false,
			id: v4()
		}
	}

	static propTypes = {
		loading: React.PropTypes.string,
		countryName: React.PropTypes.array
	}
	// After the render menthod is called this method will be activated
	componentDidMount() {

		this.setState({ loading: true })
		fetch('https://restcountries.eu/rest/v1/all')
			.then(response => response.json())
			.then(countryName => this.setState({ countryName: countryName, loading: false }))

	}

	render() {

		const { countryName, loading } = this.state
		return (
			(loading) ?
				<div> Loading Country List </div> :
				(!countryName.length) ?
					<div> No County Names </div> :
					<ul>
						{
							countryName.map(

								(k, i) => <li>{k.nativeName}</li>

							)
						}

					</ul>


		)
	}

}

class AddColorForm extends React.Component {

	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)

	}

	submit(e) {
		const { _title, _color } = this.refs
		e.preventDefault()
		alert(`Following Values entered ${_title} and ${_color}`)
		_title.value = ''
		_color.value = ''
		_title.focus();

	}

	render() {
		return (
			<form onSubmit={e => e.preventDefault()}>
				<input type="text" placeholder="colortitle" ref="_title" required />
				<input type="color" ref="_color" required />
				<button> Add </button>
			</form>

		)


	}

}

//inverse data flow by sending function as argument to the componet 
// and componets return/pass data as argument
class AddColorForm2 extends React.Component {

	constructor(props) {
		super(props)
		this.props.globalWidth = 800;
		this.state = {
			sprs: {
				tabClicked: true,
				data: [],
				dataAvailable: false,
				startDate: yearMonthDayWithDash(todayDate),
				endDate: yearMonthDayWithDash(daysBackDate())
			},
			revenueTotal: {
				tabClicked: true,
				data: [],
				dataAvailable: false,
				startDate: yearMonthDayWithDash(todayDate),
				endDate: yearMonthDayWithDash(daysBackDate())

			},
			windowWidth: this.props.globalWidth,
			tooltip: false
		}

		this.submit = this.submit.bind(this)
		this.tick = this.tick.bind(this)
		this.tooltipFnc = this.tooltipFnc.bind(this)
		this.tooltipMouseOut = this.tooltipMouseOut.bind(this)
	}

	submit(e) {
		const { _title, _color } = this.refs
		e.preventDefault()
		this.props.onNewColor(_title.value, _color.value)
		_title.value = ''
		_color.value = '#000000'
		_title.focus();
	}
	componentDidMount() {

		this.windowResize()


	}

	componentWillMount() {

		var _self = this;

		$(window).on("resize", (e) => {

			this.windowResize()
			var node = ReactDOM.findDOMNode(this)
			console.log("Node: " + node)
			console.log("Node: " + $(node).width())
			console.log("Window width: " + $(window).width())
			console.log("Window width: " + $(document).width())

		}
		)

		this.tick()
		this.timerID = setInterval(
			() => this.tick()
			, 50000

		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	componentWillUpdate() {
		console.log('updating lifecycle')
	}

	tooltipFnc(x, y, dt, rev, daysBack) {

		/* 		this.refs.mycircle.measure((x,y,width,height,px,py) =>{
					console.log("Coordinates: "+ x);
				}) */

		this.setState({ tooltip: true })
		this.props.x = x
		this.props.y = y
		this.props.date = dt
		this.props.revenue = rev

	}
	tooltipMouseOut() {
		console.log("In Mouse out")
		this.setState({ tooltip: false })
	}

	tick() {


		if (this.state.sprs.tabClicked) {
			fetch(`http://outlet4.dev.ch3.s.com/d/dashboard/service/sprs/${this.state.sprs.endDate}/${this.state.sprs.startDate}`)
				.then(response => response.json())
				.then(countryName => {
					const sprs = Object.assign({}, this.state.sprs,
						{
							data: [countryName.sprs.graphsData],
							tabClicked: true,
							dataAvailable: true,
							startDate: yearMonthDayWithDash(todayDate),
							endDate: yearMonthDayWithDash(daysBackDate())
						})
					this.setState({ sprs })
				})
		}

		if (this.state.revenueTotal.tabClicked) {
			fetch(`http://outlet4.dev.ch3.s.com/d/dashboard/service/revsnapshot/${this.state.revenueTotal.endDate}/${this.state.revenueTotal.startDate}?siteId=9322`)
				.then(response => response.json())
				.then(countryName => {
					const revenueTotal = Object.assign({}, this.state.revenueTotal,
						{
							data: [countryName.revenueTotal.graphsData],
							tabClicked: true,
							dataAvailable: true,
							startDate: yearMonthDayWithDash(todayDate),
							endDate: yearMonthDayWithDash(daysBackDate())
						})
					this.setState({ revenueTotal })
				})
		}


	}

	windowResize() {
		let currenWidth = $(document).width()
		if (this.props.globalWidth > currenWidth) {
			this.setState({ windowWidth: currenWidth - 30 })
		} else {
			this.setState({ windowWidth: this.props.globalWidth })
		}
	}
	render() {
		const { sprs, revenueTotal } = this.state
		const { tooltipFnc, tooltipMouseOut } = this

		let graphs1 = null;
		let graphs2 = null;
		if (sprs.dataAvailable) {
			graphs1 = <HybridChart data={this.state.sprs.data}
				maringProp={{ top: 20, right: 20, bottom: 20, left: 20 }}
				paddingProp={{ top: 60, right: 60, bottom: 60, left: 60 }}
				oWidht={this.state.windowWidth}
				oHeight={500}
				pathLineStrokWidth="2.25"
				onMouseOver={tooltipFnc}
				onMouseOut={tooltipMouseOut}
			/>
			//graph2 = <HybridChart data={this.state.type.data} />
		}

		if (revenueTotal.dataAvailable) {
			graphs2 = <HybridChart data={this.state.revenueTotal.data}
				maringProp={{ top: 20, right: 20, bottom: 20, left: 20 }}
				paddingProp={{ top: 60, right: 60, bottom: 60, left: 60 }}
				oWidht={this.state.windowWidth}
				oHeight={500}
				pathLineStrokWidth="2.25"
				onMouseOver={tooltipFnc}
				onMouseOut={tooltipMouseOut}
			/>
			//graph2 = <HybridChart data={this.state.type.data} />
		}


		return (


			<div>

				<div id="mygraphs1">
					{graphs1}
				</div>

				<div id="mygraphs2">
					{graphs2}
				</div>
				<div id="tooltip-graph">
					<Tooltip {...this.props} tooltip={this.state.tooltip} />
				</div>

			</div>
		)


	}


}


class Tooltip extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		//const {x, y, date, revenue} = this.props 
		const { tooltip, x, y, date, revenue } = this.props
		console.log("Insider tooltip: " + tooltip + " x:" + x + " Y: " + y)
		const styles = {
			left: x + "px",
			top: y + "px"
		}
		return (
			<div id="tooltip" className={tooltip ? '' : "hidden"} style={styles}>
				<p>Date:{date} - {x},{y}</p>
				<p>Revenue:{revenue} </p>
			</div>
		)
	}
}

const GetSPRSRevenues = () =>
	fetch('http://outlet3.dev.ch3.s.com/d/dashboard/service/sprs/2017-9-2/2017-10-2')
		.then(
		response => response.json()
		)
const logColor = (title, color) =>
	console.log(`new Color: ${title} | ${color}`)


const Star = ({ selected = false, onClick = f => f }) =>
	<div className={(selected) ? "star selected" : "star"}
		onClick={onClick} >
	</div>

render(
	<div>
		<AddColorForm2 onNewColor={logColor} />
		<Star selected={true} onClick={() => console.log('star click')} />

	</div>,
	document.getElementById('react-container')
)
