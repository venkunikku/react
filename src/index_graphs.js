import React from 'react'
import { render } from 'react-dom'
import fetch from 'isomorphic-fetch'
import d3 from 'd3'


const dataConvert = (data)=> data.map((data,i)=> {
	
	
})

const parseTime = d3.timeParse("%m/%d/%y");

class BarChart extends React.Component{
	
	constructor(props){
		super(props)
		const h = "600";
        const w = "500";
		const padding = 20;
        const barPadding = 1;
		const {data } = this.props.data
		this.state = {data}
		const {target} = this.ref
		
		
	}
	componentDidMount(){
		const {data} = this.state
		const { targe } = this.ref
		const yScale = d3.scaleLinear()
							.domain([0, 250000])
							.range([0, h])
							
		const xScale = d3.scaleTime()
						.domain([parseTime(new Date(1503723600000)),parseTime(new Date(1506315600000)) ])
						.range([padding, w-padding]
		
		var svg = d3.select(target)
			.append("svg")
			.attr('height', h)
            .attr('width', w)
		svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", function(d,i){
				return xScale(parseTime(new Date(d[1])))
			})
			.attr("y", function(d,i){
				return yScale(d[0])
			})
			.attr("width", xScale.bandwidth())
			.attr("height", function(d) {
			   		return yScale(d);
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + Math.round(d * 10) + ")";
			   })
			
		
	}
	
	render (){
		return (
			<div ref="target"></div>
		)
	}
	
}

class ShoppingcartTrend extends React.Component{


	constructor(props){
		super(props)
		this.state={
			countryName:[],
			loading:true,
			cName:[],
			sprLoad: true
		}
		this.tick()
	}

	// After the render menthod is called this method will be activated
	componentDidMount(){
		this.timerID = setInterval(
			() => this.tick(), 4000
		
		);
		
		
		

	}
	
	tick(){
		
		if (this.state.sprLoad){
			this.setState({loading:true})
			fetch('http://outlet3.dev.ch3.s.com/d/dashboard/service/sprs/2017-8-26/2017-9-25')
			.then(response => { 
			const j = response.json()
			console.log(j)
			return j})
			.then(countryName=> this.setState({cName: countryName, loading: false}))
		}
	}
	
	componentWillUnmount() {
    clearInterval(this.timerID);
  }

	render(){

		const {cName, loading} = this.state
		
		return (
				(loading) ?
				<div> Loading Country List </div> :
				   <div ref="targe"> 
				   
						
				    </div> 
						

			)
	}

}

render(
		<ShoppingcartTrend />,
		document.getElementById('react-container')
	)