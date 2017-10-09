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
			type: {
				tabClicked: false,
				data: [],
				dataAvailable: false,
				startDate: '',
				endDate: ''

			},
			windowWidth: this.props.globalWidth
		}
		
		this.submit = this.submit.bind(this)
		this.tick = this.tick.bind(this)
		//console.log("Constructor Called:" + GetSPRSRevenues().then(data => data))

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
		
		 $(window).on("resize",(e)=>
			{

			this.windowResize()
			var node = ReactDOM.findDOMNode(this)
			console.log("Node: "+ node)
			console.log("Node: "+ $(node).width())
			console.log("Window width: "+ $(window).width())
			console.log("Window width: "+ $(document).width())
			
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


		if (this.state.type.tabClicked) {
			fetch('http://outlet4.dev.ch3.s.com/d/dashboard/service/ffm_trends/2016-1-1/2016-1-2?siteId=9322')
				.then(response => response.json())
				.then(countryName => {
					const type = Object.assign({}, this.state.type, { data: [countryName.type], tabClicked: false, dataAvailable: true })
					this.setState({ type })
				})
		}


	}

	windowResize(){
		let currenWidth = $(document).width()
		if (this.props.globalWidth>currenWidth){
		this.setState({windowWidth:currenWidth-30})
		} else {
			this.setState({windowWidth:this.props.globalWidth})
		}
	}
	render() {
		const { sprs } = this.state
		let graphs1 = null;
		let graphs2 = null;
		if (sprs.dataAvailable) {
			graphs1 = <HybridChart data={this.state.sprs.data}
				maringProp={{ top: 20, right: 20, bottom: 20, left: 20 }}
				paddingProp={{ top: 60, right: 60, bottom: 60, left: 60 }}
				oWidht={this.state.windowWidth}
				oHeight={500}
				pathLineStrokWidth="2.25"
			/>
			//graph2 = <HybridChart data={this.state.type.data} />
		}

		if (sprs.dataAvailable) {
			graphs2 = <HybridChart data={this.state.sprs.data}
				maringProp={{ top: 20, right: 20, bottom: 20, left: 20 }}
				paddingProp={{ top: 60, right: 60, bottom: 60, left: 60 }}
				oWidht={this.state.windowWidth}
				oHeight={500}
				pathLineStrokWidth="2.25"
			/>
			//graph2 = <HybridChart data={this.state.type.data} />
		}


		return (


			<div>
				<form onSubmit={this.submit}>
					<input type="text" placeholder="colortitle" ref="_title" required />
					<input type="color" ref="_color" required />
					<button> Add </button>
				</form>
				<div>
					{
						(sprs.data.length) ?
							<p> Value present {sprs.data.lenght}</p>
							: <p> Value is not Presenet {sprs.data.lenght}</p>
					}

				</div>

				<div id="mygraphs1">
					{graphs1}
				</div>

				<div id="mygraphs2">
					{graphs2}
				</div>

				}
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
