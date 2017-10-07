import React from 'react'
import { render } from 'react-dom'
import ReactDOM from 'react-dom'
import $ from 'jquery'


class SizeMixin extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {

        var _self = this;

        $(window).on("resize", (e) => {

            this.windowResize()
            var node = ReactDOM.findDOMNode(this)
            console.log("Node Widht: "+ $(node).width())

        }
        )

    }

    componentDidMount() {

        this.windowResize()

    }

    windowResize(){
        let currenWidth = $(document).width()
        console.log("Width propert: "+ this.props.oWidht)
		if (this.props.oWidht>currenWidth){
		this.setState({windowWidth:currenWidth-30})
		} else {
			this.setState({windowWidth:this.props.oWidht})
		}
	}
}